'use client'

import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/Button";

const page = () => {
    const [input, setInput] = useState<string>('');
    const router = useRouter();

    return (
        <>
            <div className='container flex items-center h-full max-w-3xl mx-auto'>
                <div className='relative bg-white w-full h-fit p-4 rounded-lg space-y-6'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-xl font-semibold'>Create a Community</h1>
                    </div>

                    <hr className="bg-zinc-500 h-px"></hr>

                    <div>

                        <p className="text-lg font-medium">Name</p>
                        <p className="text-xs pb-2">
                            Debatable subgroups with a capitalization cannot be changed in future.
                            Be wise.
                        </p>
                        <div className="relative">

                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="pl-6" 
                                placeholder="Name the topic/community you want to others to debate on"
                                />
                        </div>

                    </div>

                    <div className='flex justify-end gap-4'>
          <Button
            
            variant='subtle'
            onClick={() => router.back()}>
            Cancel
          </Button>
          <Button>
            Create Community
          </Button>
        </div>

                </div>
            </div>
        </>
    )

}

export default page