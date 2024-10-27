'use client'

import { FC, startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscribeToSubdebatablePayload } from '@/lib/validators/subdebatable'
import axios, { AxiosError } from 'axios'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SubscribeLeaveToggleProps {
    subdebatableId: string,
    subdebatableName: string,
    isSubscribed: boolean,
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
    subdebatableId,
    subdebatableName,
    isSubscribed,
}) => {
    const { loginToast } = useCustomToast();
    const router = useRouter()
    const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubdebatablePayload = {
                subdebatableId,
            }

            const { data } = await axios.post('/api/subdebatable/subscribe', payload)
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'There was a problem',
                description: 'Something Went Wrong, Please Try Again Later',
                variant: 'destructive',
            })

        },

        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })
            return toast({
                title: `You have joined ${subdebatableName}`,
                description: 'Time to have some debatable opinions, compadre!',
            })
        }
    })
    const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubdebatablePayload = {
                subdebatableId,
            }

            const { data } = await axios.post('/api/subdebatable/unsubscribe', payload)
            return data as string
        },
        onError: (err: AxiosError) => {
            toast({
                title: 'Error',
                description: err.response?.data as string,
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            startTransition(() => {
                // Refresh the current route and fetch new data from the server without
                // losing client-side browser or React state.
                router.refresh()
            })
            toast({
                title: `You are now unsubscribed from ${subdebatableName}`,
                description: "Until next time, compadre! We'll keep the debate seat warm for you!",
            })
        },
    })
    return isSubscribed ?
        (
            <Button
                isLoading={isUnsubLoading}
                onClick={() => unsubscribe()}
                className='w-full mt-1 mb-4'>
                Leave Community
            </Button>

        ) : (
            <Button
                isLoading={isSubLoading}
                onClick={() => subscribe()}
                className='w-full mt-1 mb-4'
            >
                Join the club to voice debatable opinions
            </Button>
        )
}

export default SubscribeLeaveToggle