    import { v2 as cloudinary, UploadStream } from 'cloudinary';
    import { NextRequest,NextResponse } from 'next/server';
    import {auth} from "@clerk/nextjs/server"
    import { error } from 'console';
    import { buffer } from 'stream/consumers';
    import { resolve } from 'path';
    import { rejects } from 'assert';
    import { Result } from 'pg';
    import { publicDecrypt } from 'crypto'
    import { PrismaClient } from "@/generated/prisma/client"
    import { PrismaPg } from "@prisma/adapter-pg"
    const prisma = new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
    })
        // Configuration
        cloudinary.config({ 
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
        });
        interface CloudinaryUploadResult{
            public_id : string;
            bytes:number,
            duration ?:number,
            [key: string] :any
        }
        // Upload an image
        export async function POST(request : NextRequest){
            const {userId}=await auth()
            if(!userId){
                return NextResponse.json({error : "Unauthorized"},{status : 401})
            }
            //check for for cloudinary creditionals

        try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title=formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;
    if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                 resource_type:"video",
                 folder: "video-uploads",
                 size_limit:"1000MB",
                 transformation:[
                    {quality:"auto",
                        fetch_fromat:"mp4"
                    }
                 ]
                 },
            (error, result) => {
            if (error) return reject(error);
            resolve(result as CloudinaryUploadResult);
            }
        );

        uploadStream.end(buffer); // ✅ correct method
        }
    );
    const video = await prisma.video.create({
        data:{
            title, 
            description,
            publicId : uploadResult.public_id,
            originalSize : uploadResult.public_id,
            compressedSize:String(uploadResult.bytes),
            duration:uploadResult.duration || 0
        }
    })
    console.log(video)
    return NextResponse.json(
        {
            video,
        },
        {
            status:200,
        }
    )

    } catch (error : any ) {
    return NextResponse.json({ error: error.message }, { status: 500 });
    }
    finally{
        await prisma.$disconnect()
    }
        }