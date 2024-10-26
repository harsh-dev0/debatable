import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subdebatableValidator } from "@/lib/validators/subdebatable";
import { z } from "zod";

export async function POST(req: Request){
    try {
        const session = await getAuthSession()

        if(!session?.user){
            return new Response('Unauthorized', {status: 401})
        }

        const body = await req.json()
        const {name} =  subdebatableValidator.parse(body)

        const subdebatableExists = await db.subdebatable.findFirst({
            where: {
                name,
            },
        })

        if(subdebatableExists){
            return new Response('A debatable group already exists', { status: 409})
        }
        const subdebatable = await db.subdebatable.create({
            data:{
                name,
                creatorId: session.user.id,
            },
        })
        await db.subscription.create({
            data : {
                userId: session.user.id,
                subdebatableId: subdebatable.id
            }
        })

        return  new Response(subdebatable.name)
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response(error.message, {status: 422})
        }
        return new Response('Sorry :( We could not create a debatable group, try again later ', {status: 500})
    }
}