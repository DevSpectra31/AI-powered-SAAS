import {NextRequest,NextResponse} from "next/server"
import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})
export async function GET(request : NextRequest){
    try {
        const videos=await prisma.video.findMany({
            orderBy : {createdAt : "desc" }
        })
        return NextResponse.json(videos)
    } catch (error : any) {
        return NextResponse.json({error : "Error fetching videoes"},
            {status:500}
        )
    } finally{
        await prisma.$disconnect()
    }
}
