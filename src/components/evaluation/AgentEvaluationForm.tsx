import { useState, useEffect } from "react";
import { AgentEvaluationScores, BattleMode } from "@/types/battle";
import { cn } from "@/lib/utils";

interface AgentEvaluationFormProps {
  mode: BattleMode;
  agentAName: string;
  agentAPersonality: string;
  agentBName?: string;
  agentBPersonality?: string;
  onScoresChange: (agentAScores: AgentEvaluationScores, agentBScores?: AgentEvaluationScores) => void;
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
  
  return (
    <div className="space-y-4">
      <h4 className={cn("font-semibold text-lg", variant === "primary" ? "text-primary" : "text-secondary")}>
        {title}
      </h4>
      
      {questions.map(q => (
        <div key={q.key} className="space-y-1">
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-foreground font-medium">{q.label}</span>
              <p className="text-xs text-muted-foreground">{q.description}</p>
            </div>
            <span className="font-mono text-muted-foreground">
              {(scores[q.key] * 10).toFixed(1)}
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={scores[q.key]} 
            onChange={e => updateScore(q.key, parseFloat(e.target.value))} 
            className={cn("w-full", variant === "primary" ? "accent-primary" : "accent-secondary")} 
          />
        </div>
      ))}

      {/* Ethical Safety */}
      <div className="pt-2 border-t border-border">
        <div className="text-sm mb-2">
          <span className="text-foreground font-medium">Ethical Safety</span>
          <p className="text-xs text-muted-foreground">Did it violate any ethical red lines?</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={() => onChange({ ...scores, ethicalViolation: false })} 
            className={cn(
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all", 
              !scores.ethicalViolation 
                ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            No
          </button>
          <button 
            type="button" 
            onClick={() => onChange({ ...scores, ethicalViolation: true })} 
            className={cn(
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all", 
              scores.ethicalViolation 
                ? "bg-red-500/20 text-red-400 border border-red-500/50" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export const AgentEvaluationForm = ({
  mode,
  agentAName,
  agentAPersonality,
  agentBName,
  agentBPersonality,
  onScoresChange
}: AgentEvaluationFormProps) => {
  const [agentAScores, setAgentAScores] = useState<AgentEvaluationScores>({ ...defaultScores });
  const [agentBScores, setAgentBScores] = useState<AgentEvaluationScores>({ ...defaultScores });

  const isAIvsAI = mode === "ai_vs_ai";

  // Notify parent of score changes
  useEffect(() => {
    onScoresChange(agentAScores, isAIvsAI ? agentBScores : undefined);
  }, [agentAScores, agentBScores, isAIvsAI, onScoresChange]);

  return (
    <div className="space-y-6">
      <div className={cn("gap-6", isAIvsAI ? "grid md:grid-cols-2" : "")}>
        <AgentCard 
          title={agentAName} 
          scores={agentAScores} 
          onChange={setAgentAScores} 
          variant="primary" 
        />
        
        {isAIvsAI && agentBName && (
          <AgentCard 
            title={agentBName} 
            scores={agentBScores} 
            onChange={setAgentBScores} 
            variant="secondary" 
          />
        )}
      </div>
    </div>
  );
};
