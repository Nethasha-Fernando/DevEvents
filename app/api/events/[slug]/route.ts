import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

/**
 * GET /api/events/[slug]
 * Fetch events details by slug
 */

type RouteParams = {
    params:Promise<{
        slug: string;
    }>
};

export async function GET(
    req: NextRequest,
    {params}: RouteParams //params should be of type params
):Promise<NextResponse> {
    try {
        await connectDB();

        // Extract and validate slug
        const { slug } = await params; //get the slug from the param

        if (!slug || typeof slug !== "string" || slug.trim() === "") {
            return NextResponse.json(
                { message: "Invalid or missing slug parameter" },
                { status: 400 }
            );
        }

        const sanitizedSlug=slug.trim().toLowerCase();

        // Query database
        const event = await Event.findOne({ slug: sanitizedSlug }).lean(); //without returning the full mongodb doc a plain js is returned

        // Handle not found
        if (!event) {
            return NextResponse.json(
                { message: `Event with slug '${sanitizedSlug}' not found.` },
                { status: 404 }
            );
        }

        // Success response
        return NextResponse.json(
            {
                message: "Event fetched successfully",
                event,
            },
            { status: 200 }
        );
    } catch (error) {
        if (process.env.NODE_ENV === "production") {
            console.error('Error fetching events by slug', error);
        }

        if (error instanceof Error) { //checks if error belongs to the built in error class
            if(error.message.includes('MONGODB_URI')){
                return NextResponse.json(
                    {message:'Database configuration error'},
                    {status:500}
                );
            }
            return NextResponse.json(
                {message:'Failed to fetch events', error:error.message},
                {status:500}
            );
        }

        return NextResponse.json(
            {message: 'An unexpected error occurred'},
            {status:500}
        );


    }
}