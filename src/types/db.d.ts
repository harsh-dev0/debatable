import type { Post, Subdebatable, User, Vote, Comment } from '@prisma/client'

export type ExtendedPost = Post & {
  subdebatable: Subdebatable
  votes: Vote[]
  author: User
  comments: Comment[]
}