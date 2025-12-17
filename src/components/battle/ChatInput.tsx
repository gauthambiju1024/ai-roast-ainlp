import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { BATTLE_CONFIG } from "@/config/battleConfig";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export const ChatInput = ({ onSend, disabled, placeholder = "Drop your roast..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const charCount = message.length;
  const isOverLimit = charCount > BATTLE_CONFIG.maxMessageLength;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={cn(
        "flex items-center gap-2 p-2 rounded-xl border-2 transition-all",
        disabled ? "border-border bg-muted/50" : "border-border bg-card focus-within:border-primary"
      )}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={BATTLE_CONFIG.maxMessageLength}
          className={cn(
            "flex-1 bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground",
            "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim() || isOverLimit}
          className={cn(
            "p-2.5 rounded-lg transition-all",
            "gradient-fire text-primary-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:scale-105 active:scale-95"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      {message.length > 0 && (
        <span className={cn(
          "absolute right-16 top-1/2 -translate-y-1/2 text-xs",
          isOverLimit ? "text-destructive" : "text-muted-foreground"
        )}>
          {charCount}/{BATTLE_CONFIG.maxMessageLength}
        </span>
      )}
    </form>
  );
};
