// ============================================================
// STUDENT DASHBOARD
// Overview page shown at /student/dashboard.
// Displays a welcome header, quick-stats summary (assignments
// completed, average score, pass rate, best topic), and a
// link to the full assignments list.
// Data is loaded from the student's assignment progress via API.
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { studentAssignmentService } from '../../../services/api';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

// Maps overall percentage to a display tier + colour
function getPerformanceTier(pct) {
  if (pct >= 85) return { label: 'Master',       color: '#2563eb' };
  if (pct >= 70) return { label: 'Elite',        color: '#0891b2' };
  if (pct >= 55) return { label: 'Expert',       color: '#7c3aed' };
  if (pct >= 40) return { label: 'Advanced',     color: '#d97706' };
  if (pct >= 25) return { label: 'Intermediate', color: '#ea580c' };
  return           { label: 'Novice',            color: '#ef4444' };
}

// ─────────────────────────────────────────────────────────────
// STUDENT DASHBOARD (default export)
// ─────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // ── Load assignment data for stats ────────────────────────
  useEffect(() => {
    const studentId = user?._id || user?.id;
    if (!studentId) { setLoading(false); return; }

    studentAssignmentService
      .getMyAssignments(studentId)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.assignments || []);

        // Derive stats from completed attempts
        const completed = list.filter((a) => a.myAttempt?.status === 'completed');
        const passed    = completed.filter((a) => a.myAttempt?.passed);
        const avgScore  = completed.length > 0
          ? Math.round(completed.reduce((s, a) => s + (a.myAttempt?.percentage || 0), 0) / completed.length)
          : 0;

        setStats({
          total:     list.length,
          completed: completed.length,
          passed:    passed.length,
          avgScore,
          tier:      getPerformanceTier(avgScore),
        });
      })
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false));
  }, [user]);

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-3 text-gray-400">
        <div className="w-8 h-8 rounded-full border-3 border-gray-200 border-t-teal-500 animate-spin" />
        <p className="text-sm">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50/60">
      {/* ── Page header ── */}
      <div className="px-6 py-6 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-xl font-extrabold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">Here's an overview of your progress.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* ── Error banner ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ── Quick stats ── */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '📝', value: stats.total,           label: 'Assignments',    color: '#4f46e5' },
              { icon: '✅', value: stats.completed,       label: 'Completed',      color: '#10b981' },
              { icon: '🎯', value: stats.passed,          label: 'Passed',         color: '#059669' },
              { icon: '📊', value: `${stats.avgScore}%`,  label: 'Average Score',  color: '#7c3aed' },
            ].map(({ icon, value, label, color }) => (
              <div key={label}
                   className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 border border-gray-200">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                     style={{ background: color + '18' }}>
                  {icon}
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Performance tier card ── */}
        {stats && stats.completed > 0 && (
          <div
            className="rounded-2xl p-5 text-white flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}
          >
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider opacity-70 mb-1">
                Your Performance Tier
              </p>
              <p className="text-2xl font-extrabold" style={{ color: stats.tier.color }}>
                {stats.tier.label}
              </p>
              <p className="text-sm opacity-75 mt-1">
                Based on {stats.completed} completed assignment{stats.completed !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-6xl opacity-20">🏆</div>
          </div>
        )}

        {/* ── CTA: View assignments ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-start gap-4">
          <div>
            <p className="text-base font-extrabold text-gray-900">My Assignments</p>
            <p className="text-sm text-gray-400 mt-0.5">
              View all your assignments, track progress, and access detailed reports for completed tests.
            </p>
          </div>
          <button
            onClick={() => navigate('/student/assignments')}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)' }}
          >
            Go to Assignments →
          </button>
        </div>
      </div>
    </div>
  );
}
