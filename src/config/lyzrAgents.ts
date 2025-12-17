// Lyzr Agent ID mapping for each personality × intensity combination
// Agent IDs are mapped to the correct API key group

export interface LyzrAgent {
  agentId: string;
  apiKeyGroup: 1 | 2; // 1 = LYZR_API_KEY_1, 2 = LYZR_API_KEY_2
}

// Spicy agents only for now
export const LYZR_AGENTS: Record<string, LyzrAgent> = {
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
};

export const getLyzrAgent = (personalityId: string, intensityId: string): LyzrAgent | null => {
  const key = `${personalityId}_${intensityId}`;
  return LYZR_AGENTS[key] || null;
};

export const LYZR_API_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
