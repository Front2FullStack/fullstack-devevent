import {NextRequest, NextResponse} from 'next/server';
import Event from '@/database/event.model';
import {connectToDatabase} from '@/lib/mongodb';

/**
 * GET /api/events/[slug]
 * Fetches a single events by its slug
 */

type routeParams = {
    params: Promise<{
        slug: string
    }>;
}

export async function GET(
    req: NextRequest,
    {params}: routeParams
): Promise<NextResponse> {
    try {
        // Extract and validate slug parameter
        const {slug} = await params;

        if (!slug || typeof slug !== 'string' || slug.trim() === '') {
            return NextResponse.json(
                {message: 'Invalid slug parameter. Slug must be a non-empty string.'},
                {status: 400}
            );
        }

        // sanitize slug
        const sanitizedSlug = slug.trim().toLowerCase();

        // Connect to database
        await connectToDatabase();

        // Query events by slug
        const event = await Event.findOne({slug: sanitizedSlug}).lean();

        // Handle events not found
        if (!event) {
            return NextResponse.json(
                {message: `Event with slug '${sanitizedSlug}' not found.`},
                {status: 404}
            );
        }

        // Return successful response
        return NextResponse.json(
            {message: 'Event fetched successfully', event},
            {status: 200}
        );
    } catch (error) {
        // Log error for debugging (consider using proper logging service in production)
        console.error('Error fetching events by slug:', error);

        // Return generic error response
        return NextResponse.json(
            {
                message: 'Failed to fetch events',
                error: error instanceof Error ? error.message : 'An unexpected error occurred',
            },
            {status: 500}
        );
    }
}
