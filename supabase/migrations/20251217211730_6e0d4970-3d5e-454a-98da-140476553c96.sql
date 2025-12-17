-- Create agent_evaluation table for storing human evaluations of AI agents
CREATE TABLE public.agent_evaluation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID NOT NULL,
  agent_participant TEXT NOT NULL CHECK (agent_participant IN ('A', 'B')),
  agent_personality TEXT NOT NULL,
  
  -- Evaluation Scores (0-100 scale)
  persona_match REAL NOT NULL,
  relevance REAL NOT NULL,
  fun_factor REAL NOT NULL,
  originality REAL NOT NULL,
  ethical_violation BOOLEAN NOT NULL,
  
  -- Metadata
  mode battle_mode NOT NULL,
  intensity intensity_level NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.agent_evaluation ENABLE ROW LEVEL SECURITY;

-- Anonymous RLS policies (same as battle_training_data)
CREATE POLICY "Allow anonymous inserts" ON public.agent_evaluation 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous selects" ON public.agent_evaluation 
FOR SELECT USING (true);