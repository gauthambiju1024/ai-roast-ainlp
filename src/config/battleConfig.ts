// Configuration-driven personality and API key mapping
// All personalities, intensities, and API keys are managed here

export interface Personality {
  id: string;
  name: string;
  avatar: string;
  description: string;
  emoji: string;
  avatarImage?: string;
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

import avatarTrump from "@/assets/avatar-trump.png";
import avatarGandhi from "@/assets/avatar-gandhi.png";
import avatarGenz from "@/assets/avatar-genz.png";
import avatarMessi from "@/assets/avatar-messi.png";
import avatarAmitabh from "@/assets/avatar-amitabh.png";
import avatarHawking from "@/assets/avatar-hawking.png";

export const PERSONALITIES: Personality[] = [
  {
    id: "trump",
    name: "Donald Trump",
    avatar: "🇺🇸",
    description: "Tremendous roasts, believe me",
    emoji: "🇺🇸",
    avatarImage: avatarTrump,
  },
  {
    id: "gandhi",
    name: "Mahatma Gandhi",
    avatar: "🕊️",
    description: "Peaceful burns that hit different",
    emoji: "🕊️",
    avatarImage: avatarGandhi,
  },
  {
    id: "genz",
    name: "Gen-Z Persona",
    avatar: "💀",
    description: "No cap, these roasts are bussin",
    emoji: "💀",
    avatarImage: avatarGenz,
  },
  {
    id: "messi",
    name: "Lionel Messi",
    avatar: "⚽",
    description: "Goals on the field, roasts in the chat",
    emoji: "⚽",
    avatarImage: avatarMessi,
  },
  {
    id: "amitabh",
    name: "Amitabh Bachchan",
    avatar: "🎬",
    description: "Baritone burns from Bollywood",
    emoji: "🎬",
    avatarImage: avatarAmitabh,
  },
  {
    id: "hawking",
    name: "Stephen Hawking",
    avatar: "🌌",
    description: "Quantum-level intellectual takedowns",
    emoji: "🌌",
    avatarImage: avatarHawking,
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
    id: "standard",
    seconds: 60,
    label: "60 seconds",
    description: "Standard",
  },
  {
    id: "relaxed",
    seconds: 90,
    label: "90 seconds",
    description: "Relaxed",
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

// Personality descriptions for AI vs AI context injection
export const PERSONALITY_DESCRIPTIONS: Record<string, string> = {
  trump: "You're up against Donald Trump — U.S. President, billionaire real-estate mogul, and reality-TV personality. Known for bold rhetoric, relentless self-promotion, and turning confidence into spectacle.",
  gandhi: "You're facing Mahatma Gandhi — leader of India's independence movement and global symbol of nonviolent resistance. Recognized for moral authority, disciplined simplicity, and quiet but enduring influence.",
  genz: "You're battling a Gen Z persona — shaped by social media, meme culture, and internet-native communication. Known for sarcasm, irony, and blunt commentary delivered with casual detachment.",
  messi: "You're up against Lionel Messi — World Cup winner, multiple-time Ballon d'Or recipient, and football legend. Renowned for consistency, humility, and dominance through skill rather than words.",
  amitabh: "You're facing Amitabh Bachchan — one of Indian cinema's most influential actors with a career spanning decades. Known for commanding screen presence, deep voice, and iconic dramatic performances.",
  hawking: "You're battling Stephen Hawking — theoretical physicist and bestselling author in cosmology. Famous for explaining complex ideas with clarity, dry humor, and intellectual precision.",
};

export const BATTLE_CONFIG = {
  maxMessagesPerParticipant: 3,
  defaultTimeLimit: 60,
  minMessageLength: 1,
  maxMessageLength: 500,
};

// Human vibe presets for roast context
export interface HumanVibe {
  id: string;
  label: string;
  emoji: string;
}

export const HUMAN_VIBES: HumanVibe[] = [
  { id: "tech_bro", label: "Tech Bro", emoji: "💻" },
  { id: "gym_rat", label: "Gym Rat", emoji: "💪" },
  { id: "gamer", label: "Gamer", emoji: "🎮" },
  { id: "foodie", label: "Foodie", emoji: "🍕" },
  { id: "overthinker", label: "Overthinker", emoji: "🤔" },
  { id: "night_owl", label: "Night Owl", emoji: "🦉" },
  { id: "introvert", label: "Introvert", emoji: "🏠" },
  { id: "main_character", label: "Main Character", emoji: "✨" },
  { id: "procrastinator", label: "Procrastinator", emoji: "⏰" },
  { id: "coffee_addict", label: "Coffee Addict", emoji: "☕" },
  { id: "sports_fan", label: "Sports Fan", emoji: "⚽" },
  { id: "film_buff", label: "Film Buff", emoji: "🎬" },
  { id: "music_lover", label: "Music Lover", emoji: "🎵" },
  { id: "bookworm", label: "Bookworm", emoji: "📚" },
  { id: "pet_parent", label: "Pet Parent", emoji: "🐕" },
  { id: "travel_junkie", label: "Travel Junkie", emoji: "✈️" },
  { id: "crypto_bro", label: "Crypto Bro", emoji: "🪙" },
  { id: "fitness_influencer", label: "Fitness Influencer", emoji: "🏋️" },
  { id: "startup_founder", label: "Startup Founder", emoji: "🚀" },
  { id: "corporate_slave", label: "Corporate Slave", emoji: "👔" },
  { id: "student", label: "Student", emoji: "🎓" },
  { id: "artist", label: "Artist", emoji: "🎨" },
  { id: "social_media_addict", label: "Social Media Addict", emoji: "📱" },
  { id: "meme_lord", label: "Meme Lord", emoji: "😂" },
];
