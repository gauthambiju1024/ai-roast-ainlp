import { useState } from "react";
import { AgentEvaluation, AgentEvaluationScores, BattleMode } from "@/types/battle";
import { cn } from "@/lib/utils";
interface AgentEvaluationFormProps {
  mode: BattleMode;
  agentAName: string;
  agentAPersonality: string;
  agentBName?: string;
  agentBPersonality?: string;
  onSubmit: (evaluations: AgentEvaluation[]) => void;
}
const questions = [{
  key: "personaMatch" as const,
  label: "Persona Match",
  description: "Did it sound like the character?"
}, {
  key: "relevance" as const,
  label: "Relevance",
  description: "Were the roasts tailored to the opponent?"
}, {
  key: "funFactor" as const,
  label: "Fun Factor",
  description: "Did it make you smile or laugh?"
}, {
  key: "originality" as const,
  label: "Originality",
  description: "Did the roasts feel fresh, clever, and non-repetitive?"
}];
const defaultScores: AgentEvaluationScores = {
  personaMatch: 0.5,
  relevance: 0.5,
  funFactor: 0.5,
  originality: 0.5,
  ethicalViolation: false
};
interface AgentCardProps {
  title: string;
  scores: AgentEvaluationScores;
  onChange: (scores: AgentEvaluationScores) => void;
  variant: "primary" | "secondary";
}
const AgentCard = ({
  title,
  scores,
  onChange,
  variant
}: AgentCardProps) => {
  const updateScore = (key: keyof Omit<AgentEvaluationScores, "ethicalViolation">, value: number) => {
    onChange({
      ...scores,
      [key]: value
    });
  };
  return <div className="space-y-4">
      <h4 className={cn("font-semibold text-lg", variant === "primary" ? "text-primary" : "text-secondary")}>
        {title}
      </h4>
      
      {questions.map(q => <div key={q.key} className="space-y-1">
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-foreground font-medium">{q.label}</span>
              <p className="text-xs text-muted-foreground">{q.description}</p>
            </div>
            <span className="font-mono text-muted-foreground">
              {(scores[q.key] * 10).toFixed(1)}
            </span>
          </div>
          <input type="range" min="0" max="1" step="0.1" value={scores[q.key]} onChange={e => updateScore(q.key, parseFloat(e.target.value))} className={cn("w-full", variant === "primary" ? "accent-primary" : "accent-secondary")} />
        </div>)}

      {/* Ethical Safety */}
      <div className="pt-2 border-t border-border">
        <div className="text-sm mb-2">
          <span className="text-foreground font-medium">Ethical Safety</span>
          <p className="text-xs text-muted-foreground">Did it violate any ethical red lines?</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onChange({
          ...scores,
          ethicalViolation: false
        })} className={cn("flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all", !scores.ethicalViolation ? "bg-green-500/20 text-green-400 border border-green-500/50" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
            No
          </button>
          <button type="button" onClick={() => onChange({
          ...scores,
          ethicalViolation: true
        })} className={cn("flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all", scores.ethicalViolation ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
            Yes
          </button>
        </div>
      </div>
    </div>;
};
export const AgentEvaluationForm = ({
  mode,
  agentAName,
  agentAPersonality,
  agentBName,
  agentBPersonality,
  onSubmit
}: AgentEvaluationFormProps) => {
  const [agentAScores, setAgentAScores] = useState<AgentEvaluationScores>({
    ...defaultScores
  });
  const [agentBScores, setAgentBScores] = useState<AgentEvaluationScores>({
    ...defaultScores
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const evaluations: AgentEvaluation[] = [];

    // In Human vs AI, only evaluate the AI (participant B)
    if (mode === "human_vs_ai") {
      evaluations.push({
        participantId: "B",
        personality: agentAPersonality,
        // In human_vs_ai, AI is participant B
        scores: agentAScores
      });
    } else {
      // AI vs AI - evaluate both
      evaluations.push({
        participantId: "A",
        personality: agentAPersonality,
        scores: agentAScores
      });
      if (agentBName && agentBPersonality) {
        evaluations.push({
          participantId: "B",
          personality: agentBPersonality,
          scores: agentBScores
        });
      }
    }
    onSubmit(evaluations);
  };
  const isAIvsAI = mode === "ai_vs_ai";
  return <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        
        <p className="text-sm text-muted-foreground">Help us improve our AI personalities</p>
      </div>

      <div className={cn("gap-6", isAIvsAI ? "grid md:grid-cols-2" : "")}>
        <AgentCard title={isAIvsAI ? agentAName : agentAName} scores={agentAScores} onChange={setAgentAScores} variant="primary" />
        
        {isAIvsAI && agentBName && <AgentCard title={agentBName} scores={agentBScores} onChange={setAgentBScores} variant="secondary" />}
      </div>

      <button type="submit" className="w-full py-3 px-4 rounded-xl font-semibold gradient-fire text-primary-foreground hover:opacity-90 transition-opacity">
        Continue to Roast Scores
      </button>
    </form>;
};