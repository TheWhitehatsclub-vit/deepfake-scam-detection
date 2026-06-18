-- Create analysis_history table
CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  authenticity_score INTEGER NOT NULL,
  confidence_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  metadata_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on upload_date for faster queries
CREATE INDEX IF NOT EXISTS idx_analysis_history_upload_date ON analysis_history(upload_date DESC);

-- Create index on filename for search
CREATE INDEX IF NOT EXISTS idx_analysis_history_filename ON analysis_history(filename);

-- Enable Row Level Security (optional, for production)
-- ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (adjust as needed for your security requirements)
-- CREATE POLICY "Public read access" ON analysis_history FOR SELECT USING (true);
-- CREATE POLICY "Public insert access" ON analysis_history FOR INSERT WITH CHECK (true);
