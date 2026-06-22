import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {events} from "@/lib/constants";
import {IEvent} from "@/database";
import {cacheLife} from "next/cache";


 // const Page = async ()=>{
 const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
 const Page = async ()=>{
     'use cache'
     cacheLife('hours')
   // const response=await fetch(`${BASE_URL}/api/events`);
   // const {events}=await response.json(); //destructure and get only events
   return(
      <section>
        <h1 className="text-center">The Hub for Every Dev <br/> Event You Can't Miss</h1>
        <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

        <ExploreBtn/>

          <div id="events" className="mt-20 space-y-7">
              <h3>Featured Events</h3>
              <ul className="events">
                  {events?.map((event: IEvent) => (
                      <li key={event.title} className="list-none">
                          <EventCard {...event} />
                      </li>
                  ))}
              </ul>

          </div>
      </section>
  )
}
export default Page;

//This passes all object properties as props to the component