import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScoreCard } from "./ScoreCard";
import { FeedbackForm } from "./FeedbackForm";
import { TranscriptViewer } from "./TranscriptViewer";
import { AgentEvaluationForm } from "./AgentEvaluationForm";
import { EvaluationResult, HumanFeedback, AgentEvaluation, AgentEvaluationScores, BattleMode } from "@/types/battle";
import { Trophy, User, Sparkles, Quote, Lightbulb } from "lucide-react";
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
  onFeedbackSubmit
}: EvaluationModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("results");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  // Store current scores from both forms
  const [agentAScores, setAgentAScores] = useState<AgentEvaluationScores | null>(null);
  const [agentBScores, setAgentBScores] = useState<AgentEvaluationScores | null>(null);
  const [humanFeedback, setHumanFeedback] = useState<HumanFeedback | null>(null);

  const handleAgentScoresChange = useCallback((aScores: AgentEvaluationScores, bScores?: AgentEvaluationScores) => {
    setAgentAScores(aScores);
    setAgentBScores(bScores || null);
  }, []);

  const handleFeedbackScoresChange = useCallback((scores: HumanFeedback) => {
    setHumanFeedback(scores);
  }, []);

  const handleSubmitAll = () => {
    // Submit agent evaluations
    if (agentAScores) {
      const evaluations: AgentEvaluation[] = [];
      
      // In Human vs AI, only evaluate the AI (participant B)
      if (mode === "human_vs_ai") {
        evaluations.push({
          participantId: "B",
          personality: participantBPersonality || "",
          scores: agentAScores
        });
      } else {
        // AI vs AI - evaluate both
        evaluations.push({
          participantId: "A",
          personality: participantAPersonality || "",
          scores: agentAScores
        });
        if (agentBScores && participantBPersonality) {
          evaluations.push({
            participantId: "B",
            personality: participantBPersonality,
            scores: agentBScores
          });
        }
      }
      onAgentEvaluationSubmit(evaluations);
    }

    // Submit human feedback
    if (humanFeedback) {
      onFeedbackSubmit(humanFeedback);
    }

    setFeedbackSubmitted(true);
  };

  const tabs = [
    { id: "results" as const, label: "Results", icon: Trophy },
    { id: "evaluation" as const, label: "Evaluation", icon: User },
  ];

  // In Human vs AI, use participant B (AI) name for agent evaluation
  const agentANameForEval = mode === "human_vs_ai" ? participantBName : participantAName;
  const agentAPersonalityForEval = mode === "human_vs_ai" ? participantBPersonality : participantAPersonality;

  // Get speaker name from speaker ID
  const getSpeakerName = (speaker: "A" | "B") => {
    return speaker === "A" ? participantAName : participantBName;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="text-gradient-fire">Battle Complete!</span>
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            See the scores, AI verdict, and submit your evaluation
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
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Transcript - shared across tabs, below tabs */}
        {evaluation?.threadText && (
          <div className="mb-6">
            <TranscriptViewer threadText={evaluation.threadText} />
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {/* Results Tab */}
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

              {/* Margin of victory */}
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
              <div className="p-5 rounded-xl border border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">AI Judge Verdict</span>
                </div>

                {evaluation.llmJudgeVerdict ? (
                  <div className="space-y-4">
                    {/* Winner's Best Line (if not TIE) */}
                    {evaluation.winner !== "TIE" && evaluation.llmJudgeVerdict.winner_funniest_line && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span>Winner's Best Line</span>
                        </div>
                        <div className="pl-6">
                          <div className="flex items-start gap-2">
                            <Quote className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-foreground italic leading-relaxed">
                              "{evaluation.llmJudgeVerdict.winner_funniest_line.line}"
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 pl-6">
                            — {getSpeakerName(evaluation.llmJudgeVerdict.winner_funniest_line.speaker)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Funniest Line Overall (if TIE) */}
                    {evaluation.winner === "TIE" && evaluation.llmJudgeVerdict.overall_funniest_line && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span>Funniest Line Overall</span>
                        </div>
                        <div className="pl-6">
                          <div className="flex items-start gap-2">
                            <Quote className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-foreground italic leading-relaxed">
                              "{evaluation.llmJudgeVerdict.overall_funniest_line.line}"
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 pl-6">
                            — {getSpeakerName(evaluation.llmJudgeVerdict.overall_funniest_line.speaker)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Justification */}
                    {evaluation.llmJudgeVerdict.justification && (
                      <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          <span className="font-medium text-foreground">Why it works:</span>{" "}
                          {evaluation.llmJudgeVerdict.justification}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {evaluation.llmVerdict || "The AI judge is deliberating..."}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Evaluation Tab */}
          {activeTab === "evaluation" && (
            <div className="space-y-6">
              {feedbackSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-border bg-muted/30">
                  <div className="w-12 h-12 rounded-full gradient-fire flex items-center justify-center mb-3">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Evaluation Submitted!</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Thank you for your feedback. It helps us improve our AI personalities.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    Close Results
                  </button>
                </div>
              ) : (
                <>
                  {/* Help text */}
                  <p className="text-sm text-muted-foreground text-center">
                    Help us improve our AI personalities & help train our model to evaluate better
                  </p>

                  {/* Agent Rating Section - no subheading */}
                  <AgentEvaluationForm
                    mode={mode}
                    agentAName={agentANameForEval}
                    agentAPersonality={agentAPersonalityForEval || ""}
                    agentBName={mode === "ai_vs_ai" ? participantBName : undefined}
                    agentBPersonality={mode === "ai_vs_ai" ? participantBPersonality : undefined}
                    onScoresChange={handleAgentScoresChange}
                  />

                  {/* Feedback Section - no subheading */}
                  <FeedbackForm
                    participantAName={participantAName}
                    participantBName={participantBName}
                    onScoresChange={handleFeedbackScoresChange}
                  />

                  {/* Single Submit Button */}
                  <button 
                    type="button"
                    onClick={handleSubmitAll}
                    className="w-full py-3 px-4 rounded-xl font-semibold gradient-fire text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Submit Evaluation
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
