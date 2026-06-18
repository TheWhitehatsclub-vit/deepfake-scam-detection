import { createClient } from '@supabase/supabase-js';

// These should be set in your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AnalysisHistoryRecord {
  id?: string;
  filename: string;
  upload_date: string;
  authenticity_score: number;
  confidence_score: number;
  risk_level: 'low' | 'medium' | 'high';
  metadata_summary: string;
  report_id?: string;
  pdf_path?: string;
  heatmap_path?: string;
  full_metadata?: any;
  created_at?: string;
}
