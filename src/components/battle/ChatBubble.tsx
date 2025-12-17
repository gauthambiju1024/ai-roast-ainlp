import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ChatBubbleProps {
  content: string;
  isUser: boolean;
  participantName: string;
  timestamp: Date;
  enableTyping?: boolean;
  onTypingComplete?: () => void;
}

export const ChatBubble = ({ 
  content, 
  isUser, 
  participantName, 
  timestamp, 
  enableTyping = false,
  onTypingComplete 
}: ChatBubbleProps) => {
  const [displayedContent, setDisplayedContent] = useState(isUser || !enableTyping ? content : "");
  const [isTyping, setIsTyping] = useState(!isUser && enableTyping);

  useEffect(() => {
    // If it's a user message or typing is disabled, show full content immediately
    if (isUser || !enableTyping) {
      setDisplayedContent(content);
      setIsTyping(false);
      return;
    }

    // Reset for new AI message
    setDisplayedContent("");
    setIsTyping(true);

    let currentIndex = 0;
    const typingSpeed = 20; // ms per character

    const typingInterval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        onTypingComplete?.();
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [content, isUser, enableTyping, onTypingComplete]);

  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[80%] animate-in",
        isUser ? "self-end items-end" : "self-start items-start"
      )}
    >
      <span className="text-xs text-muted-foreground px-1">{participantName}</span>
      <div className={cn(isUser ? "chat-bubble-user" : "chat-bubble-ai")}>
        <p className="text-foreground whitespace-pre-wrap">
          {displayedContent}
          {isTyping && <span className="animate-pulse">▌</span>}
        </p>
      </div>
      <span className="text-[10px] text-muted-foreground/60 px-1">
        {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
};
