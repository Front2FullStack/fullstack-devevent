"use server"
import {connectToDatabase} from "@/lib/mongodb";
import {Booking} from "@/database";

export const createBookingPayload = async ({eventId, slug, email}: {
    eventId: string,
    slug: string,
    email: string
}) => {
    try {
        await connectToDatabase()
        await Booking.create({eventId, slug, email});
        return {
            success: true,
        }

    } catch (e) {
        console.error('Error creating booking:', e);
        return {
            success: false,
        }
    }
}