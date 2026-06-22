'use server';

import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model"

export const getSimilarEventsBySlug=async(slug:string)=>{
    try{
        await connectDB();
        const event=await Event.findOne({slug:slug});
        return await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).lean(); //then id wont come ryt
    }catch{
        return [];
    }
}