// Lyzr Agent ID mapping for each personality × intensity combination
// Agent IDs are mapped to the correct API key group

export interface LyzrAgent {
  agentId: string;
  apiKeyGroup: 1 | 2 | 3; // 1 = LYZR_API_KEY_1, 2 = LYZR_API_KEY_2, 3 = LYZR_API_KEY_MILD
}

// Spicy agents - use LYZR_API_KEY_1 (Amitabh, GenZ) or LYZR_API_KEY_2 (others)
// Mild agents - all use LYZR_API_KEY_MILD
export const LYZR_AGENTS: Record<string, LyzrAgent> = {
  // === SPICY AGENTS ===
  // API Key Group 1: Amitabh, GenZ
  "amitabh_spicy": {
    agentId: "6942d2c5707dd1e4d8ed444d",
    apiKeyGroup: 1,
  },
  "genz_spicy": {
    agentId: "6942cfe24f5531c6f3c726d6",
    apiKeyGroup: 1,
  },
  
  // API Key Group 2: Hawking, Messi, Trump, Gandhi
  "hawking_spicy": {
    agentId: "6942b02c9a5e5f6c59d90671",
    apiKeyGroup: 2,
  },
  "messi_spicy": {
    agentId: "694143493cc5fbe223afb86f",
    apiKeyGroup: 2,
  },
  "trump_spicy": {
    agentId: "6942ca5b707dd1e4d8ed3cb3",
    apiKeyGroup: 2,
  },
  "gandhi_spicy": {
    agentId: "6942c9d94f5531c6f3c72111",
    apiKeyGroup: 2,
  },

  // === MILD AGENTS === (all use LYZR_API_KEY_MILD)
  "trump_mild": {
    agentId: "6940eacf3cc5fbe223af8eee",
    apiKeyGroup: 3,
  },
  "gandhi_mild": {
    agentId: "6941ae713cc5fbe223afe592",
    apiKeyGroup: 3,
  },
  "genz_mild": {
    agentId: "6941b0edf82f2b2d3f7829a9",
    apiKeyGroup: 3,
  },
  "messi_mild": {
    agentId: "6941b3f84f5531c6f3c6fdcd",
    apiKeyGroup: 3,
  },
  "amitabh_mild": {
    agentId: "6941b7da4f5531c6f3c6fde5",
    apiKeyGroup: 3,
  },
  "hawking_mild": {
    agentId: "6941b9594f5531c6f3c6fe07",
    apiKeyGroup: 3,
  },
};

export const getLyzrAgent = (personalityId: string, intensityId: string): LyzrAgent | null => {
  const key = `${personalityId}_${intensityId}`;
  return LYZR_AGENTS[key] || null;
};

export const LYZR_API_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
