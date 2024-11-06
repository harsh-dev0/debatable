"use client"

import { Input } from "@/components/ui/Input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { CreateSubdebatablePayload } from "@/lib/validators/subdebatable"
import { toast } from "@/hooks/use-toast"
import { Description } from "@radix-ui/react-toast"
import { useCustomToast } from "@/hooks/use-custom-toast"

const Page = () => {
  const [input, setInput] = useState<string>("")
  const router = useRouter()
  const { loginToast } = useCustomToast()
  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubdebatablePayload = {
        name: input,
      }
      const { data } = await axios.post("/api/subdebatable", payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subdebatable alreaady exists!!!",
            description:
              "Oh! No! A debatable group already exists with that name. Try a differnt name",
            variant: "destructive",
          })
        }
        if (err.response?.status === 422) {
          return toast({
            title: "Invalid Subdebatable Name",
            description:
              "Please choose a name between 3 and 21 characters.",
            variant: "destructive",
          })
        }
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      toast({
        title: "Oops!!! Unable to Create the Group",
        description:
          "Sorry!! We could not create a debatable group, please try again later.",
        variant: "destructive",
      })
    },
    onSuccess: (data) => {
      router.push(`/${data}`)
    },
  })

  return (
    <>
      <div className="container flex items-center h-full max-w-3xl mx-auto">
        <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Create a Community</h1>
          </div>

          <hr className="bg-zinc-500 h-px"></hr>

          <div>
            <p className="text-lg font-medium">Name</p>
            <p className="text-xs pb-2">
              Debatable subgroups with a capitalization cannot be changed
              in future. Be wise.
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

          <div className="flex justify-end gap-4">
            <Button variant="subtle" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              disabled={input.length === 0}
              onClick={() => createCommunity()}
            >
              Create Community
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
