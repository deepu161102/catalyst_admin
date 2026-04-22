// ============================================================
// MENTOR DETAIL PAGE (Operations)
// ============================================================

import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_STUDENTS, MOCK_BATCHES } from '../../../data/mockData';
import { useData } from '../../../context/DataContext';

const backIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;

export default function MentorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mentors } = useData();

  const mentor   = mentors.find((m) => m.id === id);
  const students = MOCK_STUDENTS.filter((s) => s.mentorId === id);
  const batches  = MOCK_BATCHES.filter((b) => b.mentorId === id);

  if (!mentor) {
    return (
      <div className="p-10 text-center text-gray-400">
        Mentor not found.{' '}
        <button className="text-ops-primary font-semibold" onClick={() => navigate('/operations/mentors')}>Go back</button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-4 fade-in">
      <button className="flex items-center gap-1.5 text-ops-primary font-semibold text-sm" onClick={() => navigate('/operations/mentors')}>
        {backIcon} Back to Mentors
      </button>

      {/* Hero */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 flex items-center gap-5">
        <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-ops-primary to-purple-400 text-white font-extrabold text-[26px] flex items-center justify-center shrink-0">
          {mentor.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-extrabold text-gray-900">{mentor.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold">{mentor.status}</span>
          </div>
          <p className="text-gray-500 mt-1">{mentor.email} · {mentor.phone}</p>
          <p className="text-gray-700 font-medium mt-1.5">{mentor.specialization}</p>
          <p className="text-xs text-gray-400 mt-1">Joined {new Date(mentor.joinedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</p>
        </div>
        <div className="text-center">
          <p className="text-[36px] font-extrabold text-amber-500">⭐ {mentor.rating}</p>
          <p className="text-xs text-gray-400">Average Rating</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Students',    value: students.length, color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Batches',     value: batches.length,  color: '#0d9488', bg: '#f0fdfa' },
          { label: 'Sessions Done', value: mentor.sessionsCompleted, color: '#10b981', bg: '#d1fae5' },
          { label: 'Avg Progress', value: students.length ? `${Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length)}%` : '—', color: '#f59e0b', bg: '#fef3c7' },
        ].map((st) => (
          <div key={st.label} className="rounded-xl px-5 py-4 border border-black/[0.04] text-center" style={{ background: st.bg }}>
            <p className="text-[26px] font-extrabold" style={{ color: st.color }}>{st.value}</p>
            <p className="text-xs text-gray-500">{st.label}</p>
          </div>
        ))}
      </div>

      {/* Students table */}
      <div className="bg-white rounded-[14px] border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-gray-900">Assigned Students ({students.length})</h3>
          <button className="px-3.5 py-1.5 rounded-lg bg-ops-primary text-white text-xs font-semibold" onClick={() => navigate('/operations/students/add')}>
            + Add Student
          </button>
        </div>
        {students.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No students assigned to this mentor yet</div>
        ) : (
          <div>
            <div className="flex px-5 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-[0.4px] gap-3">
              <span className="flex-[2]">Student</span>
              <span className="flex-[2]">Course</span>
              <span className="flex-1">Progress</span>
              <span className="flex-1">Status</span>
            </div>
            {students.map((s) => {
              const pc = s.progress >= 80 ? '#10b981' : s.progress >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <div key={s.id} className="flex items-center px-5 py-3 border-b border-gray-100 gap-3">
                  <div className="flex-[2] flex items-center gap-2.5">
                    <div className="w-[34px] h-[34px] rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0"
                         style={{ background: `hsl(${s.id.charCodeAt(1) * 25}, 60%, 50%)` }}>
                      {s.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </div>
                  </div>
                  <div className="flex-[2]">
                    <p className="text-[13px] text-gray-700">{s.course}</p>
                    <p className="text-[11px] text-gray-400">{s.batch}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold" style={{ color: pc }}>{s.progress}%</p>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: pc }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{ background: s.status === 'active' ? '#d1fae5' : '#fee2e2', color: s.status === 'active' ? '#065f46' : '#991b1b' }}>
                      {s.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Batches */}
      <div className="bg-white rounded-[14px] border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-[15px] font-bold text-gray-900">Batches ({batches.length})</h3>
        </div>
        {batches.map((b) => {
          const pct = Math.round((b.completedSessions / b.totalSessions) * 100);
          return (
            <div key={b.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
              <div className="flex-[2]">
                <p className="text-sm font-semibold text-gray-900">{b.name}</p>
                <p className="text-xs text-gray-400">{b.course}</p>
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-gray-700">{b.studentIds.length} students</p>
              </div>
              <div className="flex-[2] flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-ops-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-bold text-ops-primary w-9">{pct}%</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">{b.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
