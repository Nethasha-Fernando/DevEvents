import { connection } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import EventCard from "./EventCard";
import { IEvent } from "@/database";

const EventsList = async () => {
    await connection();

    await connectDB();

    const eventsList = await Event.find().lean();

    return (
        <ul className="events">
            {eventsList?.map((event: IEvent) => (
                <li key={event.title} className="list-none">
                    <EventCard {...event} />
                </li>
            ))}
        </ul>
    );
};

export default EventsList;
``