// ============================================================
// OPERATIONS DASHBOARD — Platform-wide overview
// ============================================================

import { useNavigate } from 'react-router-dom';
import { MOCK_STUDENTS, MOCK_BATCHES, MOCK_SESSIONS } from '../../../data/mockData';
import { useData } from '../../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ title, value, subtitle, icon, color, onClick }) {
  return (
    <button
      className="bg-white rounded-[14px] p-5 border border-gray-200 shadow-card text-left transition-shadow hover:shadow-md"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[13px] text-gray-500 font-medium mb-1.5">{title}</p>
          <p className="text-[32px] font-extrabold leading-none" style={{ color }}>{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18' }}>
          <span className="text-[22px]">{icon}</span>
        </div>
      </div>
    </button>
  );
}

export default function OpsDashboard() {
  const navigate = useNavigate();
  const { mentors } = useData();

  const totalStudents = MOCK_STUDENTS.length;
  const totalMentors  = mentors.length;
  const totalBatches  = MOCK_BATCHES.length;
  const activeBatches = MOCK_BATCHES.filter(b => b.status === 'active').length;

  const studentsPerMentor = mentors.map((m) => ({
    name: m.name.split(' ')[0],
    students: m.students.length,
    sessions: m.sessionsCompleted,
  }));

  return (
    <div className="p-6 flex flex-col gap-5 fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-ops-primary to-purple-400 rounded-2xl px-7 py-5 flex items-center justify-between shadow-banner-ops">
        <div>
          <h2 className="text-xl font-bold text-white m-0">Platform Overview</h2>
          <p className="text-sm text-white/80 mt-1">Monitor all mentors, students, and batches from here.</p>
        </div>
        <button
          className="px-5 py-2.5 rounded-[10px] bg-white/20 text-white font-semibold text-sm border border-white/30 hover:bg-white/30 transition-colors"
          onClick={() => navigate('/operations/students/add')}
        >
          + Add Student
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Students" value={totalStudents}
          subtitle={`${MOCK_STUDENTS.filter(s => s.status === 'active').length} active`}
          icon="🎓" color="#7c3aed"
          onClick={() => navigate('/operations/students')}
        />
        <StatCard
          title="Mentors" value={totalMentors}
          subtitle="Platform instructors" icon="👨‍🏫" color="#0d9488"
          onClick={() => navigate('/operations/mentors')}
        />
        <StatCard
          title="Active Batches" value={activeBatches}
          subtitle={`${totalBatches} total`} icon="📦" color="#f59e0b"
          onClick={() => navigate('/operations/batches')}
        />
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mentors list */}
        <div className="bg-white rounded-[14px] border border-gray-200 shadow-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-gray-900">All Mentors</h3>
            <button className="text-[13px] text-ops-primary font-semibold" onClick={() => navigate('/operations/mentors')}>
              View all →
            </button>
          </div>
          {mentors.map((m) => (
            <button
              key={m.id}
              className="flex items-center gap-3 px-5 py-3 w-full text-left hover:bg-gray-50 transition-colors border-b border-gray-50"
              onClick={() => navigate(`/operations/mentors/${m.id}`)}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ops-primary to-purple-400 text-white font-bold text-[13px] flex items-center justify-center shrink-0">
                {m.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-400">{m.specialization}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold text-ops-primary">{m.students.length} students</p>
                <p className="text-[11px] text-gray-400">⭐ {m.rating}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-[14px] border border-gray-200 shadow-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-gray-900">Mentor Performance</h3>
            <span className="text-xs text-gray-400">Students & Sessions</span>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={studentsPerMentor} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="students" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Students" />
                <Bar dataKey="sessions" fill="#0d9488" radius={[4, 4, 0, 0]} name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Batches */}
      <div className="bg-white rounded-[14px] border border-gray-200 shadow-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-gray-900">Active Batches</h3>
          <button className="text-[13px] text-ops-primary font-semibold" onClick={() => navigate('/operations/batches')}>
            View all →
          </button>
        </div>
        <div className="pb-2">
          {MOCK_BATCHES.filter(b => b.status === 'active').map((batch) => {
            const mentor = mentors.find(m => m.id === batch.mentorId);
            const pct = Math.round((batch.completedSessions / batch.totalSessions) * 100);
            return (
              <div key={batch.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                <div className="flex-[2]">
                  <p className="text-sm font-semibold text-gray-900">{batch.name}</p>
                  <p className="text-xs text-gray-400">{batch.course} · {mentor?.name}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[13px] text-gray-700">{batch.studentIds.length} students</p>
                </div>
                <div className="flex-[2]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-ops-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-ops-primary w-8">{pct}%</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{batch.completedSessions}/{batch.totalSessions} sessions</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
