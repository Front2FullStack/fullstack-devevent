import React from 'react'
import {notFound} from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import {getSimilarEventsBySlug} from "@/lib/actions/event.actions";
import {IEvent} from "@/database";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


const EventDetailsItem = ({icon, alt, label}: { icon: string, alt: string, label: string }) => {
    return (
        <div className="flex-row-gap-2 items-center">
            <Image src={icon} alt={alt} width={17} height={17}/>
            <p>{label}</p>
        </div>
    )
}
const EvenAgenda = ({agendaItems}: { agendaItems: string[] }) => {
    return (
        <div className="agenda">
            <h2>Agenda</h2>
            <ul>
                {agendaItems.map((item) => (<li key={item}>{item}</li>))}
            </ul>
        </div>
    )
}
const EventTags = ({tags}: { tags: string[] }) => {
    return (
        <div className="flex flex-row gap-1.5 flex-wrap">
            {tags.map((tag) => (<div key={tag} className="pill">{tag}</div>))}
        </div>
    )
}
const EventDetails = async ({params}: { params: Promise<{ slug: string }> }) => {
    const {slug} = await params;
    const res = await fetch(`${BASE_URL}/api/events/${slug}`);

    if (!res.ok) {
        return notFound();
    }

    let data;
    try {
        data = await res.json();
    } catch (error) {
        console.error('Failed to parse JSON response:', error);
        return notFound();
    }

    const {event} = data;
    if (!event || !event._id) {
        return notFound();
    }

    const {_id, description, image, overview, date, time, location, mode, audience, agenda, organizer, tags} = event;
    const booking = 10
    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)

    if (!_id) return notFound();

    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>
            <div className="details">
                {/* Left Side Event Content */}
                <div className="content">
                    <Image src={image} className={"banner"} alt="event  banner" width={800} height={800}/>
                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailsItem icon="/icons/calendar.svg" alt="calendar" label={date}/>
                        <EventDetailsItem icon="/icons/clock.svg" alt="clock" label={time}/>
                        <EventDetailsItem icon="/icons/pin.svg" alt="pin" label={location}/>
                        <EventDetailsItem icon="/icons/mode.svg" alt="calendar" label={mode}/>
                        <EventDetailsItem icon="/icons/audience.svg" alt="calendar" label={audience}/>
                    </section>
                    <EvenAgenda agendaItems={agenda}/>
                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>
                    <EventTags tags={tags}/>

                </div>

                {/* Right Side Booking Form */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book your Spot</h2>

                    {booking > 0 ?
                        <p className="text-sm ">Join {booking} people who have already booked their
                            spot! </p> :
                        <p className="text-sm ">Be the first to book your spot!</p>}
                    <BookEvent/>
                    </div>
                </aside>
            </div>
            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 ? similarEvents.map((similarEvent: IEvent) => (
                        <EventCard key={similarEvent.id} {...similarEvent} />
                    )): 'No similar events found' }
                </div>
            </div>
        </section>
    )
}
export default EventDetails
