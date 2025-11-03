'use client'
import {useState, FormEvent} from 'react'

const BookEvent = () => {
    const [email, setEmail] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setTimeout(() => setSubmitted(true), 1000)
    }


    return (
        <div id="book-event">
            {submitted ? <p className="text-sm" role="status" aria-live="polite">Thank you for signing up!</p> : (<form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        required={true}
                        aria-required={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button className="button-submit" type="submit">Sign Up</button>
            </form>)}
        </div>
    )
}
export default BookEvent
