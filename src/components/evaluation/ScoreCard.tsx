import { cn } from "@/lib/utils";
import { RoastScores } from "@/types/battle";

interface ScoreCardProps {
  participantName: string;
  scores: RoastScores;
  isWinner: boolean;
  variant: "primary" | "secondary";
}

const scoreLabels = [
  { key: "humor", label: "Humor" },
  { key: "punch", label: "Punch" },
  { key: "originality", label: "Originality" },
  { key: "relevance", label: "Relevance" },
] as const;

export const ScoreCard = ({ participantName, scores, isWinner, variant }: ScoreCardProps) => {
  return (
    <div
      className={cn(
        "p-5 rounded-xl border-2 transition-all",
        isWinner
          ? variant === "primary"
            ? "border-primary bg-primary/10 glow-primary"
            : "border-secondary bg-secondary/10"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground">{participantName}</h3>
        {isWinner && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full gradient-fire text-primary-foreground">
            WINNER
          </span>
        )}
      </div>

      <div className="space-y-3">
        {scoreLabels.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">
                {((scores[key] || 0) * 10).toFixed(1)}
              </span>
            </div>
            <div className="score-bar">
              <div
                className={cn(
                  "score-bar-fill",
                  variant === "secondary" && "bg-secondary"
                )}
                style={{ width: `${(scores[key] || 0) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">Overall</span>
          <span className="text-2xl font-bold text-foreground">
            {((scores.overall || 0) * 10).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
