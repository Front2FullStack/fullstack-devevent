'use client'
import {useState, FormEvent} from 'react'
import {createBookingPayload} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

interface IProps {
    eventId: string;
    slug: string;
}
const BookEvent = ({eventId, slug}: IProps) => {
    const [email, setEmail] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const {success} = await createBookingPayload({eventId, slug, email})

        if(success) {
            setSubmitted(true)
            posthog.capture('event_booked', {eventId, slug, email})
        } else {
            console.error('Booking creation failed:');
            posthog.captureException('Booking creation failed')
        }
    }


    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm" role="status" aria-live="polite">Thank you for signing up!</p>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                            required
                            aria-required="true"
                        />
                    </div>

                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )}
        </div>
    )
}
export default BookEvent
