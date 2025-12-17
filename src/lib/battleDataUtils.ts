import { ChatMessage } from "@/types/battle";

/**
 * Extract A_text: all A messages concatenated (matches _split_battle logic in RoastJudge)
 */
export function extractAText(messages: ChatMessage[], participantAId: string): string {
  return messages
    .filter((m) => m.participantId === participantAId)
    .map((m) => m.content)
    .join("\n");
}

/**
 * Extract B_text: all B messages concatenated
 */
export function extractBText(messages: ChatMessage[], participantAId: string): string {
  return messages
    .filter((m) => m.participantId !== participantAId)
    .map((m) => m.content)
    .join("\n");
}

/**
 * Calculate human overall score (average of subscores)
 * Input: 0-1 scale, Output: 0-100 scale
 */
export function calculateHumanOverall(scores: {
  humor: number;
  punch: number;
  originality: number;
  relevance: number;
}): number {
  const avg = (scores.humor + scores.punch + scores.originality + scores.relevance) / 4;
  return avg * 100;
}

/**
 * Scale human feedback score from 0-1 to 0-100
 */
export function scaleToHundred(value: number): number {
  return value * 100;
}
