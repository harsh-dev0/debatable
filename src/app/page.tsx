import CustomFeed from '@/components/homepage/CustomFeed'
import GeneralFeed from '@/components/homepage/GeneralFeed'
import { buttonVariants } from "@/components/ui/Button"
import { getAuthSession } from "@/lib/auth"
import { HomeIcon } from "lucide-react"
import Link from "next/link"
export default async function Home() {

    const session = await getAuthSession()
    
  return (
  <>
  <h1 className="font-bold text-3xl md:text-4xl">Your Feed</h1>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
    {/* feed */}
    {/* @ts-expect-error server component */}
    {session ? <CustomFeed /> : <GeneralFeed />}
    {/* debatable info */}
    <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
          <div className='bg-zinc-200 px-6 py-4'>
            <p className='font-semibold py-3 flex items-center gap-1.5'>
              <HomeIcon className='h-4 w-4' />
              Home
            </p>
          </div>
          <dl className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <p className='text-zinc-500'>
                Your Personal Debatable Feed. Check your favourite topics and take part in your expertise to debate.
              </p>
            </div>
            <Link
              className={buttonVariants({
                className: 'w-full mt-4 mb-6',
              })}
              href={`/create`}>
              Create Community
            </Link>
          </dl>
        </div>
  </div>
  </>
)
}
