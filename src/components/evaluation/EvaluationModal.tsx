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

type TabType = "results" | "evaluation";

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
  const [activeTab, setActiveTab] = useState<TabType>("results");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [agentFeedbackSubmitted, setAgentFeedbackSubmitted] = useState(false);

  const handleAgentFeedbackSubmit = (evaluations: AgentEvaluation[]) => {
    onAgentEvaluationSubmit(evaluations);
    setAgentFeedbackSubmitted(true);
  };

  const handleFeedbackSubmit = (feedback: HumanFeedback) => {
    onFeedbackSubmit(feedback);
    setFeedbackSubmitted(true);
  };

  const tabs = [
    { id: "results" as const, label: "Results", icon: Brain },
    { id: "evaluation" as const, label: "Evaluation", icon: User },
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
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === "results" && evaluation && (
            <div className="space-y-6">
              {/* Score Cards */}
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
              </div>
              
              {evaluation.winner !== "TIE" && (
                <div className="text-center py-2">
                  <p className="text-muted-foreground">
                    Margin of victory:{" "}
                    <span className="font-bold text-foreground">
                      {Math.round(evaluation.margin)} points
                    </span>
                  </p>
                </div>
              )}

              {/* AI Judge Verdict */}
              <div className="p-6 rounded-xl border border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">AI Judge Verdict</span>
                </div>
                <p className="text-foreground leading-relaxed">
                  {evaluation?.llmVerdict || "The AI judge is deliberating... This verdict will be generated by the LLM evaluation system."}
                </p>
              </div>

              {/* Transcript */}
              {evaluation.threadText && (
                <TranscriptViewer threadText={evaluation.threadText} />
              )}
            </div>
          )}

          {activeTab === "evaluation" && (
            <div className="space-y-6">
              {/* Agent Rating Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Agent Rating
                </h3>
                {agentFeedbackSubmitted ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-green-400 font-medium">Agent rating submitted!</p>
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
                )}
              </div>

              {/* Your Vote Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Vote
                </h3>
                {feedbackSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 rounded-full gradient-fire flex items-center justify-center mb-3">
                      <User className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Thanks for your feedback!</h4>
                    <p className="text-muted-foreground text-center text-sm mb-4">
                      Your input helps us train better roast judges.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <FeedbackForm
                    participantAName={participantAName}
                    participantBName={participantBName}
                    onSubmit={handleFeedbackSubmit}
                  />
                )}
              </div>

              {/* Transcript */}
              {evaluation?.threadText && (
                <TranscriptViewer threadText={evaluation.threadText} />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
