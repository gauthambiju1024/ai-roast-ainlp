import { create } from 'zustand';
import { BattleState, BattleMode, ChatMessage, EvaluationResult, HumanFeedback } from '@/types/battle';
import { v4 as uuidv4 } from 'uuid';

interface BattleStore {
  // Current battle state
  battle: BattleState | null;
  evaluation: EvaluationResult | null;
  humanFeedback: HumanFeedback | null;
  
  // Session management
  sessionUserId: string;
  
  // Actions
  initBattle: (config: {
    mode: BattleMode;
    participantAPersonality?: string;
    participantBPersonality: string;
    intensity: string;
    timeLimit: number;
  }) => void;
  
  addMessage: (participantId: string, content: string) => void;
  setBattleStatus: (status: BattleState['status']) => void;
  setEvaluation: (result: EvaluationResult) => void;
  setHumanFeedback: (feedback: HumanFeedback) => void;
  resetBattle: () => void;
  generateNewSession: () => void;
}

const generateSessionId = () => uuidv4();

export const useBattleStore = create<BattleStore>((set, get) => ({
  battle: null,
  evaluation: null,
  humanFeedback: null,
  sessionUserId: generateSessionId(),
  
  initBattle: (config) => {
    const newSessionId = generateSessionId();
    
    set({
      sessionUserId: newSessionId,
      evaluation: null,
      humanFeedback: null,
      battle: {
        id: uuidv4(),
        mode: config.mode,
        participantA: config.mode === 'human_vs_ai' 
          ? { id: 'human', name: 'You', type: 'human' }
          : { id: 'ai_a', name: config.participantAPersonality || 'AI A', type: 'ai', personalityId: config.participantAPersonality },
        participantB: {
          id: 'ai_b',
          name: config.participantBPersonality,
          type: 'ai',
          personalityId: config.participantBPersonality,
        },
        intensity: config.intensity,
        timeLimit: config.timeLimit,
        messages: [],
        status: 'active',
        startTime: new Date(),
      },
    });
  },
  
  addMessage: (participantId, content) => {
    set((state) => {
      if (!state.battle) return state;
      
      const newMessage: ChatMessage = {
        id: uuidv4(),
        participantId,
        content,
        timestamp: new Date(),
      };
      
      return {
        battle: {
          ...state.battle,
          messages: [...state.battle.messages, newMessage],
        },
      };
    });
  },
  
  setBattleStatus: (status) => {
    set((state) => {
      if (!state.battle) return state;
      
      return {
        battle: {
          ...state.battle,
          status,
          endTime: status === 'complete' ? new Date() : state.battle.endTime,
        },
      };
    });
  },
  
  setEvaluation: (result) => {
    set({ evaluation: result });
  },
  
  setHumanFeedback: (feedback) => {
    set({ humanFeedback: feedback });
  },
  
  resetBattle: () => {
    set({
      battle: null,
      evaluation: null,
      humanFeedback: null,
      sessionUserId: generateSessionId(),
    });
  },
  
  generateNewSession: () => {
    set({ sessionUserId: generateSessionId() });
  },
}));
