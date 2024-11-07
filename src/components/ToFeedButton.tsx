"use client"

import { ChevronLeft } from "lucide-react"
import { usePathname } from "next/navigation"
import { buttonVariants } from "./ui/Button"

const ToFeedButton = () => {
  const pathname = usePathname()

  // Get the correct path to navigate based on current pathname
  const subdebatablePath = getSubdebatablePath(pathname)

  return (
    <a
      href={subdebatablePath}
      className={buttonVariants({ variant: "ghost" })}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      {subdebatablePath === "/" ? "Back home" : "Back to community"}
    </a>
  )
}

const getSubdebatablePath = (pathname: string) => {
  const splitPath = pathname.split("/")
  console.log(splitPath)

  // Case 1: Check for community page like /mycom
  if (splitPath.length === 2) {
    return "/" // Go back home

    // Case 2: Check for post page like /mycom/post/[postId]
  } else if (splitPath.length > 2 && splitPath[2] === "post") {
    return `/${splitPath[1]}` // Go to /mycom (community page)

    // Default case: if format doesn't match expected
  } else {
    return "/"
  }
}

export default ToFeedButton
