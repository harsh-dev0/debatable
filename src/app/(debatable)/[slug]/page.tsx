import MiniCreatePost from '@/components/MiniCreatePost'
import PostFeed from '@/components/PostFeed'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params:{
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
  const { slug } = params

  const session = await getAuthSession()

  const subdebatable = await db.subdebatable.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subdebatable: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    }
  })
  if (!subdebatable) return notFound()
  return (
  <>
    <h1 className="font-bold text-3xl md:text-4xl h-14">
    {subdebatable.name}
    </h1>
    <MiniCreatePost  session = {session}/>
    <PostFeed initialPosts={subdebatable.posts} subdebatableName={subdebatable.name}/>
  </>
  )
}

export default page