import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const postId = params.postId

    // First check if post exists and user is author
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        authorId: true,
      },
    })

    if (!post) {
      return new NextResponse('Post not found', { status: 404 })
    }

    if (post.authorId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Delete in order to maintain referential integrity
    // First delete votes
    await db.vote.deleteMany({
      where: {
        postId,
      },
    })

    // Then delete comments
    await db.comment.deleteMany({
      where: {
        postId,
      },
    })

    // Finally delete the post
    await db.post.delete({
      where: {
        id: postId,
      },
    })

    return new NextResponse('OK')
  } catch (error) {
    console.error('Error deleting post:', error)
    return new NextResponse(
      'Internal Server Error',
      { status: 500 }
    )
  }
}