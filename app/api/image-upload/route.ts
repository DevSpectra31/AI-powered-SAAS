import { v2 as cloudinary } from 'cloudinary';
import { NextRequest,NextResponse } from 'next/server';
import {auth} from "@clerk/nextjs/server"
import { error } from 'console';


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
    });
    interface cloudinaryUploadResult{
        public_id : string;
        [key: string] :any
    }
    // Upload an image
     export async function POST(request : NextRequest){
        const {userId}=await auth()
        if(!userId){
            return NextResponse.json({error : "Unauthorized"},{status : 401})
        }
        try {
            const formData=await request.formData();
            const file = formData.get("file") as File | null
            if(!file){
                return NextResponse.json({error : "File not found"},{status:400})
            }
            await file.arrayBuffer
        } catch (error) {
            
        }
     }