export type BattleMode = "human_vs_ai" | "ai_vs_ai";

export interface BattleParticipant {
  id: string;
  name: string;
  type: "human" | "ai";
  personalityId?: string;
}

export interface ChatMessage {
  id: string;
  participantId: string;
  content: string;
  timestamp: Date;
}

export interface BattleState {
  id: string;
  mode: BattleMode;
  participantA: BattleParticipant;
  participantB: BattleParticipant;
  intensity: string;
  timeLimit: number;
  messages: ChatMessage[];
  status: "setup" | "active" | "evaluating" | "complete";
  startTime?: Date;
  endTime?: Date;
}

export interface RoastScores {
  humor: number;
  punch: number;
  originality: number;
  relevance: number;
  overall: number;
}

export interface EvaluationResult {
  participantAScores: RoastScores;
  participantBScores: RoastScores;
  winner: "A" | "B" | "TIE";
  margin: number;
  llmVerdict?: string;
  threadText?: string; // For transcript display
}

export interface HumanFeedback {
  participantAScores: Omit<RoastScores, "overall">;
  participantBScores: Omit<RoastScores, "overall">;
  freeText?: string;
}

export interface BattleRecord {
  battle_id: string;
  thread_text: string;
  A_text: string;
  B_text: string;
  human_A_humor?: number;
  human_A_punch?: number;
  human_A_originality?: number;
  human_A_relevance?: number;
  human_B_humor?: number;
  human_B_punch?: number;
  human_B_originality?: number;
  human_B_relevance?: number;
  derived_overall_A?: number;
  derived_overall_B?: number;
  winner?: string;
  margin?: number;
  mode: BattleMode;
  personalities: string[];
  intensity: string;
  time_limit: number;
  created_at: Date;
}
