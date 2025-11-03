'use server'
import {connectToDatabase} from "@/lib/mongodb";
import Event, {IEvent} from "@/database/event.model";

export const getSimilarEventsBySlug = async (slug: string) => {
    try{
        await connectToDatabase();
        const event = await  Event.findOne({slug: slug})
        return await (Event.find({_id: {$ne: event._id}, tags: {$in: event.tags}}).lean()) as unknown as IEvent[];
    }
    catch (e) {
        return []
    }
}