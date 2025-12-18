import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScoreCard } from "./ScoreCard";
import { FeedbackForm } from "./FeedbackForm";
import { TranscriptViewer } from "./TranscriptViewer";
import { AgentEvaluationForm } from "./AgentEvaluationForm";
import { EvaluationResult, HumanFeedback, AgentEvaluation, BattleMode } from "@/types/battle";
import { MessageSquare, Brain, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: EvaluationResult | null;
  participantAName: string;
  participantBName: string;
  participantAPersonality?: string;
  participantBPersonality?: string;
  mode: BattleMode;
  onAgentEvaluationSubmit: (evaluations: AgentEvaluation[]) => void;
  onFeedbackSubmit: (feedback: HumanFeedback) => void;
}

type TabType = "scores" | "agent" | "llm" | "feedback";

export const EvaluationModal = ({
  isOpen,
  onClose,
  evaluation,
  participantAName,
  participantBName,
  participantAPersonality,
  participantBPersonality,
  mode,
  onAgentEvaluationSubmit,
  onFeedbackSubmit,
}: EvaluationModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("scores");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [agentFeedbackSubmitted, setAgentFeedbackSubmitted] = useState(false);

  const handleAgentFeedbackSubmit = (evaluations: AgentEvaluation[]) => {
    onAgentEvaluationSubmit(evaluations);
    setAgentFeedbackSubmitted(true);
    setActiveTab("feedback");
  };

  const handleFeedbackSubmit = (feedback: HumanFeedback) => {
    onFeedbackSubmit(feedback);
    setFeedbackSubmitted(true);
  };

  const tabs = [
    { id: "scores" as const, label: "Scores", icon: Brain },
    { id: "agent" as const, label: "Agent Rating", icon: Bot },
    { id: "llm" as const, label: "AI Judge", icon: MessageSquare },
    { id: "feedback" as const, label: "Your Vote", icon: User },
  ];

  // In Human vs AI, use participant B (AI) name for agent evaluation
  const agentANameForEval = mode === "human_vs_ai" ? participantBName : participantAName;
  const agentAPersonalityForEval = mode === "human_vs_ai" ? participantBPersonality : participantAPersonality;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="text-gradient-fire">Battle Complete!</span>
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            See the scores, AI verdict, and submit your vote
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === "scores" && evaluation && (
            <div className="grid md:grid-cols-2 gap-4">
              <ScoreCard
                participantName={participantAName}
                scores={evaluation.participantAScores}
                isWinner={evaluation.winner === "A"}
                variant="primary"
              />
              <ScoreCard
                participantName={participantBName}
                scores={evaluation.participantBScores}
                isWinner={evaluation.winner === "B"}
                variant="secondary"
              />
              {evaluation.winner !== "TIE" && (
                <div className="md:col-span-2 text-center py-4">
                  <p className="text-muted-foreground">
                    Margin of victory:{" "}
                    <span className="font-bold text-foreground">{Math.round(evaluation.margin)} points</span>
                  </p>
                </div>
              )}
              {evaluation.threadText && (
                <div className="md:col-span-2">
                  <TranscriptViewer threadText={evaluation.threadText} />
                </div>
              )}
            </div>
          )}

          {activeTab === "agent" &&
            (agentFeedbackSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Agent Rating Submitted!</h3>
                <p className="text-muted-foreground text-center">Now rate the roast quality in "Your Vote" tab.</p>
              </div>
            ) : (
              <AgentEvaluationForm
                mode={mode}
                agentAName={agentANameForEval}
                agentAPersonality={agentAPersonalityForEval || ""}
                agentBName={mode === "ai_vs_ai" ? participantBName : undefined}
                agentBPersonality={mode === "ai_vs_ai" ? participantBPersonality : undefined}
                onSubmit={handleAgentFeedbackSubmit}
              />
            ))}

          {activeTab === "llm" && (
            <div className="p-6 rounded-xl border border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">AI Judge Verdict</span>
              </div>
              <p className="text-foreground leading-relaxed">
                {evaluation?.llmVerdict ||
                  "The AI judge is deliberating... This verdict will be generated by the LLM evaluation system."}
              </p>
            </div>
          )}

          {activeTab === "feedback" &&
            (feedbackSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full gradient-fire flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 text-lg">Thanks for your feedback!</h3>
                <p className="text-muted-foreground text-center mb-6">Your input helps us train better roast judges.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  View Battle Results
                </button>
              </div>
            ) : (
              <FeedbackForm
                participantAName={participantAName}
                participantBName={participantBName}
                onSubmit={handleFeedbackSubmit}
              />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
