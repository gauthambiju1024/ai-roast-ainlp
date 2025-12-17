import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BattleTimerProps {
  initialSeconds: number;
  isActive: boolean;
  onTimeUp: () => void;
}

export const BattleTimer = ({ initialSeconds, isActive, onTimeUp }: BattleTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLow = secondsLeft <= 10;
  const progress = (secondsLeft / initialSeconds) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Time Left</span>
        <span
          className={cn(
            "font-mono text-2xl font-bold tabular-nums",
            isLow ? "text-destructive animate-pulse" : "text-foreground"
          )}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-linear",
            isLow ? "bg-destructive" : "gradient-fire"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
