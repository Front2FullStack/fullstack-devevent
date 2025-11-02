import mongoose, { Mongoose } from "mongoose";

/**
 * Centralized Mongoose connection helper for Next.js (App Router / Route Handlers).
 * - Uses a typed global cache to avoid creating multiple connections during HMR in dev.
 * - Throws clearly if the required env var is missing.
 * - Keeps types strict (no `any`).
 */

// The connection string must be provided via environment variables.
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI || MONGODB_URI.length === 0) {
  throw new Error(
    "Invalid/Missing environment variable: 'MONGODB_URI'. Please set it in your .env file."
  );
}

// Optionally set global Mongoose behavior here (aligns with Mongoose 7+ best practices)
mongoose.set("strictQuery", true);

/**
 * The shape of our cached connection object stored on `globalThis`.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Augment the Node global type with our cache to survive HMR in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

// Initialize the cache once per runtime
const cached: MongooseCache = global.__mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.__mongooseCache) {
  global.__mongooseCache = cached;
}

/**
 * Establish (or reuse) a single Mongoose connection.
 *
 * This function is safe to call multiple times across API routes, Server Actions,
 * and Route Handlers. It reuses the cached connection in development to avoid
 * creating multiple connections during hot-reload.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Configure connection options suitable for typical production usage.
    const opts = {
      // Keep the pool modest unless you expect high concurrency.
      maxPoolSize: 10,
      // Fail quickly if the server can't be reached.
      serverSelectionTimeoutMS: 5000,
      // Buffer commands while connecting; set to 0 to disable buffering.
      // bufferCommands: false,
    } satisfies Parameters<typeof mongoose.connect>[1];

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

    try {
        // Wait for the connection to establish
        cached.conn = await cached.promise;
    } catch (error) {
        // Reset promise on error to allow retry
        cached.promise = null;
        throw error;
    }
  return cached.conn;
}

/**
 * Optional helper to check connection state without forcing a connection.
 */
export function isMongooseConnected(): boolean {
  // 1 = connected, 2 = connecting
  return mongoose.connection.readyState === 1;
}

/**
 * Optional graceful close (rarely needed in serverless). Call only in long-lived
 * environments (custom servers, scripts) when you want to terminate the process.
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

/**
 * Example usage (Server Action / Route Handler):
 *
 * import { connectToDatabase } from "@/lib/mongodb";
 * import User from "@/models/user";
 *
 * export async function GET() {
 *   await connectToDatabase();
 *   const users = await User.find({});
 *   return Response.json(users);
 * }
 */
