import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model'
import {v2 as cloudinary} from 'cloudinary';

//accept req of a type nextrequest(object)with headers body all that and we can access them using req.. likewise
export async function POST(req: NextRequest) {
    try{
        await connectDB();
        const formData=await req.formData();
        let event;
        try{
            event=Object.fromEntries(formData.entries());
        }catch (e){
            return NextResponse.json({message:'Invalid JSON data format'},{status:400})
        }

        const file=formData.get('image')as File;
        if(!file){
             return NextResponse.json({message:'Image file is requied'},{status:400})
         }
        let tags=JSON.parse(formData.get('tags')as string);
        let agenda=JSON.parse(formData.get('agenda')as string);
         const arrayBuffer=await file.arrayBuffer();
         const buffer=Buffer.from(arrayBuffer); //to get access to blob data

         const uploadResult=await new Promise((resolve,reject)=>{
             cloudinary.uploader.upload_stream({resource_type:'image', folder:'DevEvent'},(error,result)=>{
                 if(error){
                     return reject(error);
                 }
                 resolve(result);
             }).end(buffer);
         });
         event.image=(uploadResult as {secure_url:string}).secure_url;

        const createdEvent=await Event.create({
            ...event,
            tags:tags,
            agenda:agenda,
        });
        return NextResponse.json({message:'Event created',event:createdEvent},{status:201});

    }catch(e){
        console.error(e);
        return NextResponse.json({message:'Event Creation Failed',error:e instanceof Error?e.message:'Unknown'},{status:500}); //sends a repsonse back with a body and check if e an an error comes from the error object and if so shows the error message
    }
}

export async function GET(){
    try{
        await connectDB();
        const events = await Event.find().sort({createdAt:-1}); //diretcly gets from DB and returned value is validated againsit schema in the model
        return NextResponse.json({message:'Event fetched successfully',events},{status:200});
    }catch(e){
        return NextResponse.json({message:'Event fetching failed',error:e},{status:500});
    }
}


