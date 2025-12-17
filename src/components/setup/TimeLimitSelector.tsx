import { cn } from "@/lib/utils";
import { TIME_LIMITS } from "@/config/battleConfig";
import { Clock } from "lucide-react";

interface TimeLimitSelectorProps {
  selectedTimeLimit: string;
  onSelect: (timeLimit: string) => void;
}

export const TimeLimitSelector = ({
  selectedTimeLimit,
  onSelect,
}: TimeLimitSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">Time Limit</label>
      <div className="flex gap-3">
        {TIME_LIMITS.map((time) => (
          <button
            key={time.id}
            onClick={() => onSelect(time.id)}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-300",
              "flex items-center justify-center gap-2",
              selectedTimeLimit === time.id
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/50"
            )}
          >
            <Clock className="w-4 h-4" />
            <div className="text-left">
              <span className="font-medium">{time.label}</span>
              <span className="text-xs ml-1 opacity-70">({time.description})</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
