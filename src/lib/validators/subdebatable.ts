import { z } from 'zod'

export const subdebatableValidator = z.object({
    name: z.string().min(3).max(21),
})

export const subdebatableSubscriptionValidator = z.object({
    name: z.string(),
})

export type CreateSubdebatablePayload = z.infer<typeof subdebatableValidator>
export type SubscribeToSubdebatablePayload = z.infer<typeof subdebatableSubscriptionValidator>