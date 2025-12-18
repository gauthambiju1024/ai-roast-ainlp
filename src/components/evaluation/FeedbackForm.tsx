import { useState } from "react";
import { HumanFeedback } from "@/types/battle";
import { cn } from "@/lib/utils";
interface FeedbackFormProps {
  participantAName: string;
  participantBName: string;
  onSubmit: (feedback: HumanFeedback) => void;
}
const categories = ["humor", "punch", "originality", "relevance"] as const;
export const FeedbackForm = ({
  participantAName,
  participantBName,
  onSubmit
}: FeedbackFormProps) => {
  const [scores, setScores] = useState<HumanFeedback>({
    participantAScores: {
      humor: 0.5,
      punch: 0.5,
      originality: 0.5,
      relevance: 0.5
    },
    participantBScores: {
      humor: 0.5,
      punch: 0.5,
      originality: 0.5,
      relevance: 0.5
    },
    freeText: ""
  });
  const updateScore = (participant: "A" | "B", category: typeof categories[number], value: number) => {
    setScores(prev => ({
      ...prev,
      [`participant${participant}Scores`]: {
        ...prev[`participant${participant}Scores`],
        [category]: value
      }
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(scores);
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-foreground mb-1">Your Feedback</h3>
        <p className="text-sm text-muted-foreground">Help train judge to evaluate better </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Participant A */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">{participantAName}</h4>
          {categories.map(cat => {})}
        </div>

        {/* Participant B */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">{participantBName}</h4>
          {categories.map(cat => <div key={`b-${cat}`} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground capitalize">{cat}</span>
                <span className="font-mono">{(scores.participantBScores[cat] * 10).toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.1" value={scores.participantBScores[cat]} onChange={e => updateScore("B", cat, parseFloat(e.target.value))} className="w-full accent-secondary" />
            </div>)}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Additional comments (optional)</label>
        <textarea value={scores.freeText} onChange={e => setScores(prev => ({
        ...prev,
        freeText: e.target.value
      }))} placeholder="Any thoughts on this battle?" className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" rows={3} />
      </div>

      <button type="submit" className="w-full py-3 px-4 rounded-xl font-semibold gradient-fire text-primary-foreground hover:opacity-90 transition-opacity">
        Submit Feedback
      </button>
    </form>;
};