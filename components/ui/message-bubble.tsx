import * as React from "react"
import { cn } from "@/lib/utils"

export interface MessageBubbleProps {
  content: string
  isUser: boolean
  className?: string
}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ content, isUser, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "max-w-[80%] py-2 px-4 rounded-lg mb-4",
          isUser
            ? "bg-primary text-primary-foreground ml-auto"
            : "bg-muted text-muted-foreground",
          className
        )}
      >
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    )
  }
)

MessageBubble.displayName = "MessageBubble"

export { MessageBubble }
