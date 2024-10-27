import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subdebatableSubscriptionValidator } from "@/lib/validators/subdebatable";
import { z } from "zod";

export async function POST(req: Request) {

    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }
        const body = await req.json();
        const { subdebatableId } = subdebatableSubscriptionValidator.parse(body);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subdebatableId,
                userId: session.user.id
            }
        })

        if (subscriptionExists) {
            return new Response('You are alreaady Subscribed to this very debatable community.',
                {
                    status: 400,
                }
            )
        }
        await db.subscription.create({
            data: {
                subdebatableId,
                userId: session.user.id,
            }
        })

        return new Response(subdebatableId)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request data passed', { status: 422 })
        }
        return new Response('Could not subscribe', { status: 500 })
    }

}