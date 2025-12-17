import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  content: string;
  isUser: boolean;
  participantName: string;
  timestamp: Date;
}

export const ChatBubble = ({ content, isUser, participantName, timestamp }: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[80%] animate-in",
        isUser ? "self-end items-end" : "self-start items-start"
      )}
    >
      <span className="text-xs text-muted-foreground px-1">{participantName}</span>
      <div className={cn(isUser ? "chat-bubble-user" : "chat-bubble-ai")}>
        <p className="text-foreground whitespace-pre-wrap">{content}</p>
      </div>
      <span className="text-[10px] text-muted-foreground/60 px-1">
        {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
};
