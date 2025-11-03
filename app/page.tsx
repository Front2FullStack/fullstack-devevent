import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {IEvent} from "@/database";
import {cacheLife, cacheTag} from "next/cache";

const Page = async () => {
    'use cache'
    cacheLife('hours')
    cacheTag('all-events')
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    if (!BASE_URL) {
        throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not defined');
    }
    const res = await fetch(`${BASE_URL}/api/events`, {next: { revalidate: 3600 }}); // fallback if cache directives don't work
    if (!res.ok) {
       throw new Error(`Failed to fetch events: ${res.status}`);
    }
    const {events} = await res.json();
    console.log(events)
    const allEvents = Array.isArray(events) ? events : [];

    return (
        <section>
            <h1 className="text-center">The Hub for Every Dev <br/> Event you can&apos;t miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in one Place</p>
            <ExploreBtn/>
            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>
                <ul className="events ">
                    {allEvents && allEvents.length > 0 && allEvents.map((event: IEvent) => (<li className="list-none" key={event.slug}>
                        <EventCard {...event}/>
                    </li>))}
                </ul>
            </div>
        </section>
    )
}
export default Page
