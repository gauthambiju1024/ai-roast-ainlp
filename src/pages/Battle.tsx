import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { useBattleStore } from "@/store/battleStore";
import { ChatBubble } from "@/components/battle/ChatBubble";
import { ChatInput } from "@/components/battle/ChatInput";
import { BattleTimer } from "@/components/battle/BattleTimer";
import { MessageCounter } from "@/components/battle/MessageCounter";
import { EvaluationModal } from "@/components/evaluation/EvaluationModal";
import { PERSONALITIES, BATTLE_CONFIG } from "@/config/battleConfig";
import { HumanFeedback, EvaluationResult } from "@/types/battle";
import { cn } from "@/lib/utils";

const Battle = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { battle, evaluation, addMessage, setBattleStatus, setEvaluation, setHumanFeedback, resetBattle } = useBattleStore();
  
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  // Redirect if no battle
  useEffect(() => {
    if (!battle) {
      navigate("/");
    }
  }, [battle, navigate]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [battle?.messages]);

  // Check for battle end conditions
  const checkBattleEnd = useCallback(() => {
    if (!battle) return false;
    
    const aMessages = battle.messages.filter((m) => m.participantId === battle.participantA.id).length;
    const bMessages = battle.messages.filter((m) => m.participantId === battle.participantB.id).length;
    
    return aMessages >= BATTLE_CONFIG.maxMessagesPerParticipant && 
           bMessages >= BATTLE_CONFIG.maxMessagesPerParticipant;
  }, [battle]);

  const handleTimeUp = useCallback(() => {
    if (battle?.status === "active") {
      setBattleStatus("evaluating");
      // Trigger evaluation
      generateEvaluation();
    }
  }, [battle, setBattleStatus]);

  const generateEvaluation = () => {
    // Mock evaluation - in production this would call the ML Judge API and LLM
    const mockEvaluation: EvaluationResult = {
      participantAScores: {
        humor: 0.7 + Math.random() * 0.2,
        punch: 0.6 + Math.random() * 0.3,
        originality: 0.65 + Math.random() * 0.25,
        relevance: 0.7 + Math.random() * 0.2,
        overall: 0,
      },
      participantBScores: {
        humor: 0.65 + Math.random() * 0.25,
        punch: 0.7 + Math.random() * 0.2,
        originality: 0.6 + Math.random() * 0.3,
        relevance: 0.75 + Math.random() * 0.15,
        overall: 0,
      },
      winner: "A",
      margin: 0,
      llmVerdict: "In a battle of wits and wordplay, both contestants brought their A-game. However, the slight edge in delivery and timing gave the victory to the challenger. The roasts were crispy, the comebacks were snappy, and the audience was thoroughly entertained.",
    };

    // Calculate overall scores
    mockEvaluation.participantAScores.overall = 
      (mockEvaluation.participantAScores.humor + mockEvaluation.participantAScores.punch + 
       mockEvaluation.participantAScores.originality + mockEvaluation.participantAScores.relevance) / 4;
    
    mockEvaluation.participantBScores.overall = 
      (mockEvaluation.participantBScores.humor + mockEvaluation.participantBScores.punch + 
       mockEvaluation.participantBScores.originality + mockEvaluation.participantBScores.relevance) / 4;

    mockEvaluation.margin = Math.abs(mockEvaluation.participantAScores.overall - mockEvaluation.participantBScores.overall);
    mockEvaluation.winner = mockEvaluation.participantAScores.overall > mockEvaluation.participantBScores.overall ? "A" : "B";

    setEvaluation(mockEvaluation);
    setShowEvaluationModal(true);
  };

  const simulateAIResponse = useCallback((participantId: string, personalityId?: string) => {
    setIsWaitingForAI(true);
    
    // Mock AI response - in production this would call Lyzr API
    const mockResponses = [
      "Oh, that's cute. Did you practice that in the mirror, or did it just come naturally like your bad decisions?",
      "I've seen better comebacks in a clearance bin. Try again, champ.",
      "Is that the best you've got? My error messages have more personality.",
      "Fascinating. I'll add that to my collection of things not worth remembering.",
      "You call that a roast? I've had warmer ice cubes.",
    ];

    setTimeout(() => {
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      addMessage(participantId, response);
      setIsWaitingForAI(false);

      // Check if battle should end
      if (checkBattleEnd()) {
        setBattleStatus("evaluating");
        generateEvaluation();
      }
    }, 1500 + Math.random() * 1000);
  }, [addMessage, checkBattleEnd, setBattleStatus]);

  const handleSendMessage = (content: string) => {
    if (!battle || battle.status !== "active") return;
    
    addMessage(battle.participantA.id, content);
    
    // Check if this was the last message
    const aMessages = battle.messages.filter((m) => m.participantId === battle.participantA.id).length + 1;
    
    if (aMessages < BATTLE_CONFIG.maxMessagesPerParticipant) {
      simulateAIResponse(battle.participantB.id, battle.participantB.personalityId);
    } else {
      // Let AI respond one more time if needed
      const bMessages = battle.messages.filter((m) => m.participantId === battle.participantB.id).length;
      if (bMessages < BATTLE_CONFIG.maxMessagesPerParticipant) {
        simulateAIResponse(battle.participantB.id, battle.participantB.personalityId);
      } else {
        setBattleStatus("evaluating");
        generateEvaluation();
      }
    }
  };

  // AI vs AI auto-battle
  useEffect(() => {
    if (!battle || battle.mode !== "ai_vs_ai" || battle.status !== "active") return;
    
    const totalMessages = battle.messages.length;
    
    if (totalMessages === 0) {
      // Start the battle
      setTimeout(() => {
        simulateAIResponse(battle.participantA.id, battle.participantA.personalityId);
      }, 1000);
    } else if (!isWaitingForAI && !checkBattleEnd()) {
      // Alternate between A and B
      const lastMessage = battle.messages[battle.messages.length - 1];
      const nextParticipant = lastMessage.participantId === battle.participantA.id 
        ? battle.participantB 
        : battle.participantA;
      
      const nextMessages = battle.messages.filter((m) => m.participantId === nextParticipant.id).length;
      
      if (nextMessages < BATTLE_CONFIG.maxMessagesPerParticipant) {
        setTimeout(() => {
          simulateAIResponse(nextParticipant.id, nextParticipant.personalityId);
        }, 2000);
      }
    }
  }, [battle, isWaitingForAI, simulateAIResponse, checkBattleEnd]);

  const handleFeedbackSubmit = (feedback: HumanFeedback) => {
    setHumanFeedback(feedback);
    // In production, this would save to Supabase
    console.log("Feedback submitted:", feedback);
  };

  const handleEvaluationClose = () => {
    setShowEvaluationModal(false);
    setBattleStatus("complete");
  };

  const handleNewChat = () => {
    resetBattle();
    navigate("/");
  };

  if (!battle) return null;

  const participantA = battle.participantA;
  const participantB = battle.participantB;
  const personalityA = PERSONALITIES.find((p) => p.id === participantA.personalityId);
  const personalityB = PERSONALITIES.find((p) => p.id === participantB.personalityId);

  const aMessageCount = battle.messages.filter((m) => m.participantId === participantA.id).length;
  const bMessageCount = battle.messages.filter((m) => m.participantId === participantB.id).length;

  const isInputDisabled = 
    battle.mode === "ai_vs_ai" || 
    isWaitingForAI || 
    battle.status !== "active" ||
    aMessageCount >= BATTLE_CONFIG.maxMessagesPerParticipant;

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Battle</span>
          </button>
          
          <h1 className="font-bold text-foreground">
            {battle.mode === "human_vs_ai" ? (
              <>You vs <span className="text-gradient-fire">{personalityB?.name}</span></>
            ) : (
              <><span className="text-primary">{personalityA?.name}</span> vs <span className="text-secondary">{personalityB?.name}</span></>
            )}
          </h1>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 container max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-4">
        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {battle.messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  {battle.mode === "ai_vs_ai" 
                    ? "The battle is about to begin..." 
                    : "Drop the first roast to start the battle!"}
                </p>
              </div>
            )}
            
            {battle.messages.map((message) => {
              const isParticipantA = message.participantId === participantA.id;
              const participant = isParticipantA ? participantA : participantB;
              const personality = PERSONALITIES.find((p) => p.id === participant.personalityId);
              
              return (
                <ChatBubble
                  key={message.id}
                  content={message.content}
                  isUser={isParticipantA && battle.mode === "human_vs_ai"}
                  participantName={personality?.name || participant.name}
                  timestamp={message.timestamp}
                />
              );
            })}
            
            {isWaitingForAI && (
              <div className="chat-bubble-ai self-start animate-pulse">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          {battle.mode === "human_vs_ai" && (
            <div className="p-4 border-t border-border">
              <ChatInput
                onSend={handleSendMessage}
                disabled={isInputDisabled}
                placeholder={
                  battle.status !== "active" 
                    ? "Battle ended" 
                    : isWaitingForAI 
                      ? "Waiting for opponent..." 
                      : "Drop your roast..."
                }
              />
            </div>
          )}
        </div>

        {/* Sidebar - Timer & Counter */}
        <div className="lg:w-64 flex flex-row lg:flex-col gap-4">
          <div className="flex-1 lg:flex-none p-4 rounded-xl border border-border bg-card">
            <BattleTimer
              initialSeconds={battle.timeLimit}
              isActive={battle.status === "active"}
              onTimeUp={handleTimeUp}
            />
          </div>
          
          <div className="flex-1 lg:flex-none p-4 rounded-xl border border-border bg-card">
            <MessageCounter
              participantACount={aMessageCount}
              participantBCount={bMessageCount}
              participantAName={battle.mode === "human_vs_ai" ? "You" : personalityA?.name || "AI A"}
              participantBName={personalityB?.name || "AI B"}
            />
          </div>

          {/* Post-battle actions */}
          {battle.status === "complete" && evaluation && (
            <div className="lg:flex-1 p-4 rounded-xl border border-border bg-card space-y-3">
              <h3 className="font-semibold text-foreground">Battle Complete</h3>
              <p className="text-sm text-muted-foreground">
                Winner: <span className="text-primary font-medium">
                  {evaluation.winner === "A" 
                    ? (battle.mode === "human_vs_ai" ? "You" : personalityA?.name)
                    : personalityB?.name}
                </span>
              </p>
              <button
                onClick={() => setShowEvaluationModal(true)}
                className="w-full py-2 px-4 rounded-lg text-sm font-medium gradient-fire text-primary-foreground"
              >
                View Results
              </button>
              <button
                onClick={handleNewChat}
                className="w-full py-2 px-4 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
              >
                New Battle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={showEvaluationModal}
        onClose={handleEvaluationClose}
        evaluation={evaluation}
        participantAName={battle.mode === "human_vs_ai" ? "You" : personalityA?.name || "AI A"}
        participantBName={personalityB?.name || "AI B"}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default Battle;
