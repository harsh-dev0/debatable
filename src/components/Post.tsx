import { FC, useRef, useState } from "react"
import { formatTimeToNow } from "@/lib/utils"
import { Post, User, Vote } from "@prisma/client"
import Link from "next/link"
import { MessageSquare, MoreVertical } from "lucide-react"
import EditorOutput from "./EditorOutput"
import PostVoteClient from "./post-vote/PostVoteClient"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/Alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useOnClickOutside } from "@/hooks/use-on-click-outside" // Import your custom hook

type PartialVote = Pick<Vote, "type">

interface PostProps {
  post: Post & {
    author: User
    votes: Vote[]
  }
  votesAmt: number
  subdebatableName: string
  currentVote?: PartialVote
  commentAmt: number
  currentUserId?: string
}

const Post: FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subdebatableName,
  commentAmt,
  currentUserId,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null) // Ref for dropdown
  const [showDropdown, setShowDropdown] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const isAuthor = currentUserId === post.authorId

  const handleDelete = async () => {
    if (!isAuthor) return

    // Show "Deleting..." message initially
    toast({
      title: "Deleting...",
      description: "Your post is being deleted.",
      duration: 5000, // Keep it visible for 2 seconds or until completion
    })

    try {
      setIsDeleting(true)
      const response = await fetch(
        `/api/subdebatable/post/${post.id}/delete`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      // Show "Deleted" message after successful deletion
      toast({
        title: "Success",
        description: "Post has been deleted",
        duration: 3000, // Show for 3 seconds
      })

      // Redirect after deletion
      window.location.href = subdebatableName.startsWith("/")
        ? subdebatableName
        : `/${subdebatableName}`
    } catch (error) {
      // Show "Error" message if deletion fails
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
        duration: 3000, // Show for 3 seconds
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setShowDropdown(false)
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/${subdebatableName}/post/${post.id}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link Copied",
      description: "Post link copied to clipboard!",
    })
  }

  // Close dropdown when clicking outside
  useOnClickOutside(dropdownRef, () => setShowDropdown(false))

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        />
        <div className="w-0 flex-1">
          <div className="max-w-40 mt-1 text-xs text-gray-500 flex items-center justify-between">
            <div>
              {subdebatableName ? (
                <>
                  <a
                    className="underline text-zinc-900 text-sm underline-offset-2"
                    href={`${subdebatableName}`}
                  >
                    {subdebatableName}
                  </a>
                  <span className="px-1">•</span>
                </>
              ) : null}
              <span>Posted by {post.author.username}</span>{" "}
              {formatTimeToNow(new Date(post.createdAt))}
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={handleShare}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Share
                      </button>
                    </li>
                    {isAuthor && (
                      <li>
                        <button
                          onClick={() => setShowDeleteDialog(true)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </li>
                    )}
                    {isAuthor && (
                      <li>
                        <button
                          onClick={() =>
                            toast({
                              title: "Edit functionality coming soon!",
                            })
                          }
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <a href={`${subdebatableName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
        <Link
          href={`${subdebatableName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </Link>
      </div>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="spinner mr-2"></span> // Add a spinner element here
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Post
