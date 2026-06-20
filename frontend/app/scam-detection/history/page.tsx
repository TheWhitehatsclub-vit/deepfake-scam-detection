'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import './history.css';

interface HistoryRecord {
  id: string;
  url: string;
  trust_score: number;
  overall_status: string;
  created_at: string;
}

const riskLabel = (status: string) => {
  if (status === 'danger') return 'High Risk';
  if (status === 'warning') return 'Medium Risk';
  return 'Safe';
};

const riskClass = (status: string) => (status === 'safe' ? 'safe' : 'high');

const timeAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const PAGE_SIZE = 4;

export default function ScanHistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data, error, count } = await supabase
        .from('scam_website_history')
        .select('id, url, trust_score, overall_status, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (!error && data) {
        setRecords(data);
        setTotalCount(count ?? 0);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <>
      <div className="crumb-bar">
        <div className="container">
          <div className="crumb">
            <Link href="/scam-detection" className="back-link">
              <i className="ti ti-arrow-left" /> Back to Analyzer
            </Link>
          </div>
        </div>
      </div>

      <section className="history-header">
        <div className="container">
          <h1 className="h-title">Scan History</h1>
          <p className="header-sub">View your previously analyzed websites.</p>
        </div>
      </section>

      <section className="history-section">
        <div className="container">
          <div className="history-card">
            {loading ? (
              <p>Loading...</p>
            ) : records.length === 0 ? (
              <p>No scans yet. <Link href="/scam-detection">Run your first scan.</Link></p>
            ) : (
              <>
                <div className="history-table">
                  <div className="history-header">
                    <span>Website</span>
                    <span>Trust Score</span>
                    <span>Risk Level</span>
                    <span>Analyzed At</span>
                  </div>
                  {records.map((record) => (
                    <div key={record.id} className="history-row">
                      <span className="history-website">{record.url}</span>
                      <span className="history-score">{record.trust_score}/100</span>
                      <span className={`history-risk ${riskClass(record.overall_status)}`}>
                        {riskLabel(record.overall_status)}
                      </span>
                      <span className="history-date">{timeAgo(record.created_at)}</span>
                    </div>
                  ))}
                </div>

                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Previous
                  </button>
                  <div className="pagination-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`pagination-page ${p === page ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    className="pagination-btn"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}