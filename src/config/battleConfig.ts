// Configuration-driven personality and API key mapping
// All personalities, intensities, and API keys are managed here

export interface Personality {
  id: string;
  name: string;
  avatar: string;
  description: string;
  emoji: string;
}

export interface Intensity {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface TimeLimit {
  id: string;
  seconds: number;
  label: string;
  description: string;
}

export const PERSONALITIES: Personality[] = [
  {
    id: "trump",
    name: "Donald Trump",
    avatar: "🇺🇸",
    description: "Tremendous roasts, believe me",
    emoji: "🇺🇸",
  },
  {
    id: "gandhi",
    name: "Mahatma Gandhi",
    avatar: "🕊️",
    description: "Peaceful burns that hit different",
    emoji: "🕊️",
  },
  {
    id: "genz",
    name: "Gen-Z Persona",
    avatar: "💀",
    description: "No cap, these roasts are bussin",
    emoji: "💀",
  },
  {
    id: "messi",
    name: "Lionel Messi",
    avatar: "⚽",
    description: "Goals on the field, roasts in the chat",
    emoji: "⚽",
  },
  {
    id: "amitabh",
    name: "Amitabh Bachchan",
    avatar: "🎬",
    description: "Baritone burns from Bollywood",
    emoji: "🎬",
  },
  {
    id: "hawking",
    name: "Stephen Hawking",
    avatar: "🌌",
    description: "Quantum-level intellectual takedowns",
    emoji: "🌌",
  },
];

export const INTENSITIES: Intensity[] = [
  {
    id: "mild",
    name: "Mild",
    emoji: "🌶️",
    description: "Family-friendly burns",
  },
  {
    id: "spicy",
    name: "Spicy",
    emoji: "🌶️🌶️🌶️",
    description: "No mercy mode",
  },
];

export const TIME_LIMITS: TimeLimit[] = [
  {
    id: "hard",
    seconds: 30,
    label: "30 seconds",
    description: "Hard mode",
  },
  {
    id: "standard",
    seconds: 60,
    label: "60 seconds",
    description: "Standard",
  },
];

// API Key mapping - Each personality x intensity combination gets a unique key
// This should be populated with actual Lyzr API keys
export const API_KEY_MAP: Record<string, string> = {
  "trump_mild": "LYZR_TRUMP_MILD_KEY",
  "trump_spicy": "LYZR_TRUMP_SPICY_KEY",
  "gandhi_mild": "LYZR_GANDHI_MILD_KEY",
  "gandhi_spicy": "LYZR_GANDHI_SPICY_KEY",
  "genz_mild": "LYZR_GENZ_MILD_KEY",
  "genz_spicy": "LYZR_GENZ_SPICY_KEY",
  "messi_mild": "LYZR_MESSI_MILD_KEY",
  "messi_spicy": "LYZR_MESSI_SPICY_KEY",
  "amitabh_mild": "LYZR_AMITABH_MILD_KEY",
  "amitabh_spicy": "LYZR_AMITABH_SPICY_KEY",
  "hawking_mild": "LYZR_HAWKING_MILD_KEY",
  "hawking_spicy": "LYZR_HAWKING_SPICY_KEY",
};

export const getApiKey = (personalityId: string, intensityId: string): string => {
  const key = `${personalityId}_${intensityId}`;
  return API_KEY_MAP[key] || "";
};

export const BATTLE_CONFIG = {
  maxMessagesPerParticipant: 5,
  defaultTimeLimit: 60,
  minMessageLength: 1,
  maxMessageLength: 500,
};
