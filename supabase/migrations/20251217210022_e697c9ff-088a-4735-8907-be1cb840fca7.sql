-- Enable RLS on battle_training_data
ALTER TABLE battle_training_data ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (training data collection doesn't require auth)
CREATE POLICY "Allow anonymous inserts" ON battle_training_data
  FOR INSERT WITH CHECK (true);

-- Allow anonymous selects for data export
CREATE POLICY "Allow anonymous selects" ON battle_training_data
  FOR SELECT USING (true);