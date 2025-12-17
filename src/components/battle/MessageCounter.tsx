import { BATTLE_CONFIG } from "@/config/battleConfig";
import { cn } from "@/lib/utils";

interface MessageCounterProps {
  participantACount: number;
  participantBCount: number;
  participantAName: string;
  participantBName: string;
}

export const MessageCounter = ({
  participantACount,
  participantBCount,
  participantAName,
  participantBName,
}: MessageCounterProps) => {
  const maxMessages = BATTLE_CONFIG.maxMessagesPerParticipant;

  return (
    <div className="space-y-3">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">Messages</span>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground truncate max-w-[100px]">{participantAName}</span>
          <div className="flex gap-1">
            {Array.from({ length: maxMessages }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i < participantACount ? "gradient-fire" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground truncate max-w-[100px]">{participantBName}</span>
          <div className="flex gap-1">
            {Array.from({ length: maxMessages }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i < participantBCount ? "bg-secondary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
