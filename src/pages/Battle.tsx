import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, RefreshCw } from "lucide-react";
import { useBattleStore } from "@/store/battleStore";
import { ChatBubble } from "@/components/battle/ChatBubble";
import { ChatInput } from "@/components/battle/ChatInput";
import { BattleTimer } from "@/components/battle/BattleTimer";
import { MessageCounter } from "@/components/battle/MessageCounter";
import { EvaluationModal } from "@/components/evaluation/EvaluationModal";
import { DevPanel } from "@/components/evaluation/DevPanel";
import { PERSONALITIES, BATTLE_CONFIG, PERSONALITY_DESCRIPTIONS } from "@/config/battleConfig";
import { getLyzrAgent } from "@/config/lyzrAgents";
import { HumanFeedback, EvaluationResult, AgentEvaluation } from "@/types/battle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { extractAText, extractBText, calculateHumanOverall, scaleToHundred } from "@/lib/battleDataUtils";

const Battle = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const aiTurnInProgress = useRef(false); // Guard against double execution
  
  const { battle, evaluation, addMessage, setBattleStatus, setEvaluation, setHumanFeedback, resetBattle } = useBattleStore();
  
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [isTypingAI, setIsTypingAI] = useState(false); // Track when AI message is being typed
  const [typingCompleteMessageId, setTypingCompleteMessageId] = useState<string | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [devRequestPayload, setDevRequestPayload] = useState<object | null>(null);
  const [devResponseData, setDevResponseData] = useState<object | null>(null);
  const [lastThreadText, setLastThreadText] = useState<string>("");

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

  // Build thread_text from messages (A:/B: format)
  const buildThreadText = useCallback(() => {
    if (!battle) return "";
    
    return battle.messages.map((msg) => {
      const isA = msg.participantId === battle.participantA.id;
      const label = isA ? "A" : "B";
      return `${label}: ${msg.content}`;
    }).join("\n");
  }, [battle]);

  const generateEvaluation = useCallback(async (threadText?: string) => {
    if (!battle) return;
    
    const thread_text = threadText || buildThreadText();
    
    // Don't call API with empty thread_text
    if (!thread_text || thread_text.trim() === "") {
      console.warn("Cannot evaluate: no messages in battle");
      setEvalError("No messages to evaluate");
      return;
    }
    
    setIsEvaluating(true);
    setEvalError(null);
    setLastThreadText(thread_text);
    setLastThreadText(thread_text);
    
    const payload = { thread_text };
    setDevRequestPayload(payload);
    
    try {
      console.log("Calling RoastJudge API via edge function...");
      console.log("Payload:", JSON.stringify(payload, null, 2));
      
      const { data, error } = await supabase.functions.invoke('evaluate-battle', {
        body: payload
      });
      
      setDevResponseData(data || { error: error?.message });
      
      if (error) {
        console.error("Evaluation error:", error);
        throw new Error(error.message || "Failed to evaluate battle");
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      console.log("RoastJudge response:", data);
      
      // Map API response to EvaluationResult (scores are 0-100 floats)
      const winner = (data.winner === "A" || data.winner === "B" || data.winner === "TIE") 
        ? data.winner 
        : "TIE";
      
      let evalResult: EvaluationResult = {
        participantAScores: {
          humor: data.A_humor ?? 0,
          punch: data.A_punch ?? 0,
          originality: data.A_originality ?? 0,
          relevance: data.A_relevance ?? 0,
          overall: data.overall_A ?? 0,
        },
        participantBScores: {
          humor: data.B_humor ?? 0,
          punch: data.B_punch ?? 0,
          originality: data.B_originality ?? 0,
          relevance: data.B_relevance ?? 0,
          overall: data.overall_B ?? 0,
        },
        winner,
        margin: Math.abs(data.margin ?? 0),
        llmVerdict: `The RoastJudge has spoken! With an overall score of ${Math.round(data.overall_A)} vs ${Math.round(data.overall_B)}, Player ${winner} takes the crown${winner !== "TIE" ? `. Margin of victory: ${Math.abs(data.margin).toFixed(1)} points.` : "."}`,
        threadText: thread_text,
      };
      
      // Call LLM Judge for funniest line selection
      try {
        console.log("Calling LLM Judge for funniest line selection...");
        const { data: llmData, error: llmError } = await supabase.functions.invoke('llm-judge', {
          body: { thread_text, winner }
        });
        
        if (llmError) {
          console.error("LLM Judge error:", llmError);
        } else if (llmData) {
          console.log("LLM Judge response:", llmData);
          evalResult.llmJudgeVerdict = llmData;
        }
      } catch (llmErr) {
        console.error("Failed to call LLM Judge:", llmErr);
      }
      
      setEvaluation(evalResult);
      setShowEvaluationModal(true);
    } catch (err) {
      console.error("Evaluation failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setEvalError(errorMessage);
      toast.error("Evaluation failed. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  }, [battle, buildThreadText, setEvaluation]);

  const handleRetryEvaluation = () => {
    generateEvaluation(lastThreadText);
  };

  const handleTimeUp = useCallback(() => {
    if (battle?.status === "active") {
      setBattleStatus("evaluating");
      generateEvaluation();
    }
  }, [battle, setBattleStatus, generateEvaluation]);

  const callLyzrAPI = useCallback(async (participantId: string, personalityId: string, contextMessage?: string, humanMessage?: string) => {
    if (!battle) return;
    
    const { sessionUserId } = useBattleStore.getState();
    const agent = getLyzrAgent(personalityId, battle.intensity);
    
    if (!agent) {
      console.error(`No Lyzr agent configured for ${personalityId}_${battle.intensity}`);
      // Fallback to mock response
      const fallbackResponses = [
        "Oh, that's cute. Did you practice that in the mirror?",
        "I've seen better comebacks in a clearance bin.",
        "Is that the best you've got? Try again.",
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    // Priority: contextMessage > humanMessage > last message from state
    const messageToSend = contextMessage || humanMessage || (battle.messages.length > 0 
      ? battle.messages[battle.messages.length - 1].content 
      : "Start the roast battle!");
    
    try {
      const { data, error } = await supabase.functions.invoke('lyzr-chat', {
        body: {
          personality_id: personalityId,
          intensity_id: battle.intensity,
          user_id: sessionUserId,
          session_id: battle.id,
          message: messageToSend,
        }
      });
      
      if (error) {
        console.error("Lyzr API error:", error);
        throw error;
      }
      
      // Extract response text from Lyzr API response
      const responseText = data?.response || data?.message || data?.text || "Nice try, but I've got nothing for that one.";
      return responseText;
    } catch (err) {
      console.error("Failed to call Lyzr API:", err);
      toast.error("AI response failed, using fallback");
      return "Hmm, let me think of something better... Your last roast left me speechless!";
    }
  }, [battle]);

  const simulateAIResponse = useCallback(async (participantId: string, personalityId?: string, contextMessage?: string, humanMessage?: string) => {
    setIsWaitingForAI(true);
    
    try {
      const response = await callLyzrAPI(participantId, personalityId || "trump", contextMessage, humanMessage);
      addMessage(participantId, response);
      setIsTypingAI(true); // Start typing animation
    } catch (err) {
      console.error("AI response error:", err);
      addMessage(participantId, "I'm at a loss for words... you win this round!");
      setIsTypingAI(true);
    } finally {
      setIsWaitingForAI(false);
      // Note: Don't check battle end here - wait for typing to complete
    }
  }, [callLyzrAPI, addMessage]);

  // Handle typing completion - this triggers next actions
  const handleTypingComplete = useCallback((messageId: string) => {
    setIsTypingAI(false);
    setTypingCompleteMessageId(messageId);
  }, []);

  const handleSendMessage = (content: string) => {
    if (!battle || battle.status !== "active") return;
    
    addMessage(battle.participantA.id, content);
    
    // Check if this was the last message
    const aMessages = battle.messages.filter((m) => m.participantId === battle.participantA.id).length + 1;
    
    // Build context for AI on human's first message - emphasize the roast over the profile
    let contextMessage: string | undefined;
    if (battle.messages.length === 0 && battle.participantA.humanProfile) {
      const profile = battle.participantA.humanProfile;
      const vibesText = profile.vibes.length > 0 ? profile.vibes.join(", ") : "";
      const descText = profile.customDescription ? ` ${profile.customDescription}` : "";
      
      // Build a brief context but EMPHASIZE the actual roast they sent
      let profileContext = `Opponent: ${profile.nickname}`;
      if (vibesText) profileContext += ` (${vibesText})`;
      if (descText) profileContext += `.${descText}`;
      
      contextMessage = `${profileContext}\n\nThey just roasted you: "${content}"\n\nRespond with a brutal roast that directly addresses what they said!`;
    }
    
    if (aMessages < BATTLE_CONFIG.maxMessagesPerParticipant) {
      // Pass content explicitly as humanMessage for subsequent messages
      simulateAIResponse(battle.participantB.id, battle.participantB.personalityId, contextMessage, content);
    } else {
      // Let AI respond one more time if needed
      const bMessages = battle.messages.filter((m) => m.participantId === battle.participantB.id).length;
      if (bMessages < BATTLE_CONFIG.maxMessagesPerParticipant) {
        simulateAIResponse(battle.participantB.id, battle.participantB.personalityId, contextMessage, content);
      } else {
        setBattleStatus("evaluating");
        generateEvaluation();
      }
    }
  };

  // AI vs AI auto-battle - only proceeds when typing is complete
  useEffect(() => {
    if (!battle || battle.mode !== "ai_vs_ai" || battle.status !== "active") return;
    if (aiTurnInProgress.current || isWaitingForAI || isTypingAI) return; // Guard against double execution and wait for typing
    
    const totalMessages = battle.messages.length;
    const opponentAId = battle.participantA.personalityId || "";
    const opponentBId = battle.participantB.personalityId || "";
    
    // Check if battle should end
    const aMessages = battle.messages.filter((m) => m.participantId === battle.participantA.id).length;
    const bMessages = battle.messages.filter((m) => m.participantId === battle.participantB.id).length;
    
    if (aMessages >= BATTLE_CONFIG.maxMessagesPerParticipant && 
        bMessages >= BATTLE_CONFIG.maxMessagesPerParticipant) {
      // Battle complete - trigger evaluation
      setBattleStatus("evaluating");
      generateEvaluation();
      return;
    }
    
    if (totalMessages === 0) {
      // Participant A's FIRST message - inject opponent B's context
      aiTurnInProgress.current = true;
      const contextForA = `${PERSONALITY_DESCRIPTIONS[opponentBId] || ""}\n\nThe roast battle has begun. Fire your opening roast!`;
      setTimeout(() => {
        simulateAIResponse(battle.participantA.id, battle.participantA.personalityId, contextForA);
        aiTurnInProgress.current = false;
      }, 1000);
    } else if (totalMessages === 1 && typingCompleteMessageId) {
      // Participant B's FIRST message - inject opponent A's context + A's roast (only after A's typing is done)
      aiTurnInProgress.current = true;
      const aFirstRoast = battle.messages[0].content;
      const contextForB = `${PERSONALITY_DESCRIPTIONS[opponentAId] || ""}\n\nThey just roasted you with: "${aFirstRoast}"\n\nFire back!`;
      setTimeout(() => {
        simulateAIResponse(battle.participantB.id, battle.participantB.personalityId, contextForB);
        aiTurnInProgress.current = false;
      }, 1000);
    } else if (totalMessages > 1 && typingCompleteMessageId) {
      // Subsequent messages - pass the opponent's last message explicitly (only after previous typing is done)
      const lastMessage = battle.messages[battle.messages.length - 1];
      const nextParticipant = lastMessage.participantId === battle.participantA.id 
        ? battle.participantB 
        : battle.participantA;
      
      const nextMessages = battle.messages.filter((m) => m.participantId === nextParticipant.id).length;
      
      if (nextMessages < BATTLE_CONFIG.maxMessagesPerParticipant) {
        aiTurnInProgress.current = true;
        // Pass the opponent's roast explicitly as humanMessage
        const opponentRoast = lastMessage.content;
        setTimeout(() => {
          simulateAIResponse(nextParticipant.id, nextParticipant.personalityId, undefined, opponentRoast);
          aiTurnInProgress.current = false;
        }, 1000);
      }
    }
  }, [battle?.messages.length, battle?.mode, battle?.status, isWaitingForAI, isTypingAI, typingCompleteMessageId, simulateAIResponse, setBattleStatus, generateEvaluation]);

  // Check for battle end after typing completes (Human vs AI mode)
  useEffect(() => {
    if (!battle || battle.mode !== "human_vs_ai" || battle.status !== "active") return;
    if (isTypingAI || isWaitingForAI) return;
    
    if (checkBattleEnd()) {
      setBattleStatus("evaluating");
      generateEvaluation();
    }
  }, [battle, isTypingAI, isWaitingForAI, checkBattleEnd, setBattleStatus, generateEvaluation]);

  const saveBattleTrainingData = useCallback(async (feedback: HumanFeedback) => {
    if (!battle || !evaluation) return;
    
    const { sessionUserId } = useBattleStore.getState();
    const A_text = extractAText(battle.messages, battle.participantA.id);
    const B_text = extractBText(battle.messages, battle.participantA.id);
    
    const trainingData = {
      battle_id: battle.id,
      thread_text: evaluation.threadText || buildThreadText(),
      a_text: A_text,
      b_text: B_text,
      
      // Model scores (stored as-is, 0-100 scale)
      a_humor: evaluation.participantAScores.humor,
      a_punch: evaluation.participantAScores.punch,
      a_originality: evaluation.participantAScores.originality,
      a_relevance: evaluation.participantAScores.relevance,
      b_humor: evaluation.participantBScores.humor,
      b_punch: evaluation.participantBScores.punch,
      b_originality: evaluation.participantBScores.originality,
      b_relevance: evaluation.participantBScores.relevance,
      
      overall_a: evaluation.participantAScores.overall,
      overall_b: evaluation.participantBScores.overall,
      margin: evaluation.margin,
      winner: evaluation.winner,
      
      // Human feedback (convert 0-1 to 0-100 for consistency)
      human_a_humor: scaleToHundred(feedback.participantAScores.humor),
      human_a_punch: scaleToHundred(feedback.participantAScores.punch),
      human_a_originality: scaleToHundred(feedback.participantAScores.originality),
      human_a_relevance: scaleToHundred(feedback.participantAScores.relevance),
      human_b_humor: scaleToHundred(feedback.participantBScores.humor),
      human_b_punch: scaleToHundred(feedback.participantBScores.punch),
      human_b_originality: scaleToHundred(feedback.participantBScores.originality),
      human_b_relevance: scaleToHundred(feedback.participantBScores.relevance),
      human_overall_a: calculateHumanOverall(feedback.participantAScores),
      human_overall_b: calculateHumanOverall(feedback.participantBScores),
      human_feedback_text: feedback.freeText || null,
      
      // Metadata
      mode: battle.mode,
      agent_a_personality: battle.participantA.personalityId || null,
      agent_b_personality: battle.participantB.personalityId || null,
      intensity: battle.intensity as 'mild' | 'spicy',
      time_limit_seconds: battle.timeLimit,
      message_limit: BATTLE_CONFIG.maxMessagesPerParticipant,
      session_id: sessionUserId,
    };
    
    console.log("Saving training data:", trainingData);
    
    const { error } = await supabase
      .from('battle_training_data')
      .insert(trainingData);
      
    if (error) {
      console.error('Failed to save training data:', error);
      toast.error('Failed to save battle data');
    } else {
      console.log('Training data saved successfully');
      toast.success('Battle recorded for training!');
    }
  }, [battle, evaluation, buildThreadText]);

  const handleFeedbackSubmit = async (feedback: HumanFeedback) => {
    setHumanFeedback(feedback);
    await saveBattleTrainingData(feedback);
    console.log("Feedback submitted:", feedback);
  };

  const saveAgentEvaluation = async (evaluations: AgentEvaluation[]) => {
    if (!battle) return;
    
    const { sessionUserId } = useBattleStore.getState();
    
    for (const evalData of evaluations) {
      const agentEvalRecord = {
        battle_id: battle.id,
        agent_participant: evalData.participantId,
        agent_personality: evalData.personality,
        persona_match: evalData.scores.personaMatch * 100,
        relevance: evalData.scores.relevance * 100,
        fun_factor: evalData.scores.funFactor * 100,
        originality: evalData.scores.originality * 100,
        ethical_violation: evalData.scores.ethicalViolation,
        mode: battle.mode,
        intensity: battle.intensity as 'mild' | 'spicy',
        session_id: sessionUserId,
      };
      
      console.log("Saving agent evaluation:", agentEvalRecord);
      
      const { error } = await supabase
        .from('agent_evaluation')
        .insert(agentEvalRecord);
        
      if (error) {
        console.error('Failed to save agent evaluation:', error);
        toast.error('Failed to save agent evaluation');
      }
    }
    
    console.log('Agent evaluations saved successfully');
  };

  const handleAgentEvaluationSubmit = async (evaluations: AgentEvaluation[]) => {
    await saveAgentEvaluation(evaluations);
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
          
          <div className="w-20" />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 container max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-4">
        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {battle.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-muted-foreground">
                  {battle.mode === "ai_vs_ai" 
                    ? "The battle is about to begin..." 
                    : "Drop the first roast to start the battle!"}
                </p>
                {battle.mode === "human_vs_ai" && (
                  <p className="text-xs text-muted-foreground/70 text-center max-w-sm">
                    🔒 Your responses are stored to improve our AI. Avoid sharing personal information.
                  </p>
                )}
              </div>
            )}
            
            {battle.messages.map((message, index) => {
              const isParticipantA = message.participantId === participantA.id;
              const participant = isParticipantA ? participantA : participantB;
              const personality = PERSONALITIES.find((p) => p.id === participant.personalityId);
              const isLatestMessage = index === battle.messages.length - 1;
              const isAIMessage = battle.mode === "ai_vs_ai" || (battle.mode === "human_vs_ai" && !isParticipantA);
              
              return (
                <ChatBubble
                  key={message.id}
                  content={message.content}
                  isUser={isParticipantA && battle.mode === "human_vs_ai"}
                  participantName={personality?.name || participant.name}
                  timestamp={message.timestamp}
                  enableTyping={isAIMessage && isLatestMessage}
                  onTypingComplete={() => handleTypingComplete(message.id)}
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
            
            {isEvaluating && (
              <div className="flex flex-col items-center justify-center py-8 gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full gradient-fire flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <p className="text-muted-foreground font-medium">Judging the battle...</p>
              </div>
            )}

            {evalError && !isEvaluating && (
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  Evaluation failed: {evalError}
                </div>
                <button
                  onClick={handleRetryEvaluation}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Evaluation
                </button>
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

        {/* Sidebar */}
        <div className="lg:w-64 flex flex-row lg:flex-col gap-4">
          {/* Timer - only show for human vs AI */}
          {battle.mode === "human_vs_ai" && (
            <div className="flex-1 lg:flex-none p-4 rounded-xl border border-border bg-card">
              <BattleTimer
                initialSeconds={battle.timeLimit}
                isActive={battle.status === "active" && !isWaitingForAI && !isTypingAI}
                onTimeUp={handleTimeUp}
              />
            </div>
          )}
          
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
                  {evaluation.winner === "TIE" 
                    ? "It's a tie!" 
                    : evaluation.winner === "A" 
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

          {/* Dev Panel */}
          <DevPanel requestPayload={devRequestPayload} responseData={devResponseData} />
        </div>
      </div>

      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={showEvaluationModal}
        onClose={handleEvaluationClose}
        evaluation={evaluation}
        participantAName={battle.mode === "human_vs_ai" ? "You" : personalityA?.name || "AI A"}
        participantBName={personalityB?.name || "AI B"}
        participantAPersonality={battle.participantA.personalityId}
        participantBPersonality={battle.participantB.personalityId}
        mode={battle.mode}
        onAgentEvaluationSubmit={handleAgentEvaluationSubmit}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default Battle;
