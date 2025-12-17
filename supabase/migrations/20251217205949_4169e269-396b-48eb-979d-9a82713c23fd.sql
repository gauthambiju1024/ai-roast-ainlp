-- Enums for type safety
CREATE TYPE battle_mode AS ENUM ('human_vs_ai', 'ai_vs_ai');
CREATE TYPE battle_winner AS ENUM ('A', 'B', 'TIE');
CREATE TYPE intensity_level AS ENUM ('mild', 'spicy');

-- Core training data table
CREATE TABLE battle_training_data (
  battle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core Text Inputs (for model retraining)
  thread_text TEXT NOT NULL,
  A_text TEXT NOT NULL,
  B_text TEXT NOT NULL,
  
  -- Model-Generated Subscores (from RoastJudge API, 0-100 scale)
  A_humor REAL,
  A_punch REAL,
  A_originality REAL,
  A_relevance REAL,
  B_humor REAL,
  B_punch REAL,
  B_originality REAL,
  B_relevance REAL,
  
  -- Model-Derived Aggregates
  overall_A REAL,
  overall_B REAL,
  margin REAL,
  winner battle_winner,
  
  -- Human Feedback (Training Gold - ground truth labels, 0-100 scale)
  human_A_humor REAL,
  human_A_punch REAL,
  human_A_originality REAL,
  human_A_relevance REAL,
  human_B_humor REAL,
  human_B_punch REAL,
  human_B_originality REAL,
  human_B_relevance REAL,
  human_overall_A REAL,
  human_overall_B REAL,
  
  -- Qualitative Feedback
  human_feedback_text TEXT,
  
  -- Battle Metadata (for analysis, NOT training)
  mode battle_mode NOT NULL,
  agent_A_personality TEXT,
  agent_B_personality TEXT,
  intensity intensity_level NOT NULL,
  time_limit_seconds INTEGER NOT NULL,
  message_limit INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_battle_training_mode ON battle_training_data(mode);
CREATE INDEX idx_battle_training_created ON battle_training_data(created_at);