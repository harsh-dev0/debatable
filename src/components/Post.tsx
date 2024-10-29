'use client'

import { formatTimeToNow } from '@/lib/utils'
import { FC } from 'react'
import { Post, User, Vote } from '@prisma/client'

type PartialVote = Pick<Vote, 'type'>
interface PostProps {
    post: Post & {
        author: User
        votes: Vote[]
    }
    votesAmt: number
    subdebatableName: string
    currentVote?: PartialVote
    commentAmt: number
}

const Post: FC<PostProps> = ({
    post,
    votesAmt: _votesAmt,
    currentVote: _currentVote,
    subdebatableName,
    commentAmt,
}) => {
    return (
        <div className='rounded-md bg-white shadow'>
            <div className='px-6 py-4 flex justify-between'>
                {/* Todo Postvotes */}
                <div className="w-0 flex-1">
                    <div className="max-w-40 mt-1 text-xs text-gray-500">
                        {subdebatableName ? (
                            <>
                                <a
                                    className='underline text-zinc-900 text-sm underline-offset-2'
                                    href={`${subdebatableName}`}>
                                    {subdebatableName}
                                </a>
                                <span className='px-1'>•</span>
                            </>
                        ) : null}
                        <span>Posted by {post.author.username}</span>{' '}
                        {formatTimeToNow(new Date(post.createdAt))}
                    </div>
                    <a href={`${subdebatableName}/post/${post.id}`}>
                        <h1 className='text-lg font-semibold py-2 leading-6 text-gray-900'>
                            {post.title}
                        </h1>
                    </a>
                </div>
            </div>
        </div>

    )
}

export default Post