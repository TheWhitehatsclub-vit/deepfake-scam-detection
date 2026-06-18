import { supabase, AnalysisHistoryRecord } from './supabase';

/**
 * Save an analysis record to Supabase
 */
export async function saveAnalysisRecord(record: Omit<AnalysisHistoryRecord, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
  console.log('saveAnalysisRecord called with:', record);
  try {
    const { error } = await supabase
      .from('analysis_history')
      .insert({
        filename: record.filename,
        upload_date: record.upload_date,
        authenticity_score: record.authenticity_score,
        confidence_score: record.confidence_score,
        risk_level: record.risk_level,
        metadata_summary: record.metadata_summary,
      });

    if (error) {
      console.error('Error saving analysis record:', error);
      return { success: false, error: error.message };
    }

    console.log('Successfully saved analysis record to Supabase');
    return { success: true };
  } catch (error) {
    console.error('Error saving analysis record:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Fetch analysis history from Supabase
 */
export async function fetchAnalysisHistory(limit: number = 10): Promise<{ data: AnalysisHistoryRecord[]; error?: string }> {
  console.log('fetchAnalysisHistory called with limit:', limit);
  try {
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .order('upload_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching analysis history:', error);
      return { data: [], error: error.message };
    }

    console.log('Successfully fetched analysis history:', data?.length || 0, 'records');
    return { data: data || [] };
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Convert analysis result to history record format
 */
export function analysisResultToHistoryRecord(
  fileName: string,
  authenticityScore: number,
  confidenceScore: number,
  riskLevel: 'low' | 'medium' | 'high',
  metadataSummary: string
): Omit<AnalysisHistoryRecord, 'id' | 'created_at'> {
  return {
    filename: fileName,
    upload_date: new Date().toISOString(),
    authenticity_score: authenticityScore,
    confidence_score: confidenceScore,
    risk_level: riskLevel,
    metadata_summary: metadataSummary,
  };
}
