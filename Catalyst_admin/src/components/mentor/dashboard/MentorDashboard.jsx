// ============================================================
// MENTOR DASHBOARD — Landing page after mentor login
// ============================================================

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_STUDENTS, MOCK_SESSIONS, MOCK_SLOTS } from '../../../data/mockData';

function StatCard({ title, value, subtitle, icon, color, onClick, trend }) {
  return (
    <button
      className="bg-white rounded-[14px] p-5 border border-gray-200 shadow-card text-left transition-shadow hover:shadow-md"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-gray-500 font-medium mb-1.5">{title}</p>
          <p className="text-[32px] font-extrabold leading-none" style={{ color }}>{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + '18' }}
        >
          <span className="text-[22px]" style={{ color }}>{icon}</span>
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 text-xs flex items-center">
          <span className="font-semibold" style={{ color: trend >= 0 ? '#10b981' : '#ef4444' }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-gray-400 ml-1">vs last month</span>
        </div>
      )}
    </button>
  );
}

function StudentRow({ student, onClick }) {
  const progressColor = student.progress >= 80 ? '#10b981' : student.progress >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <button
      className="flex items-center gap-3 px-5 py-2.5 w-full text-left transition-colors hover:bg-gray-50 border-b border-gray-50"
      onClick={onClick}
    >
      <div
        className="w-9 h-9 rounded-full text-white font-bold text-[13px] flex items-center justify-center shrink-0"
        style={{ background: `hsl(${student.id.charCodeAt(1) * 20}, 60%, 50%)` }}
      >
        {student.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{student.name}</p>
        <p className="text-xs text-gray-400">{student.course}</p>
      </div>
      <div className="text-right min-w-[80px]">
        <p className="text-[13px] font-semibold" style={{ color: progressColor }}>{student.progress}%</p>
        <div className="w-20">
          <div className="w-full h-1 bg-gray-200 rounded-sm overflow-hidden mt-0.5">
            <div className="h-full rounded-sm" style={{ width: `${student.progress}%`, background: progressColor }} />
          </div>
        </div>
      </div>
      <span
        className="px-2 py-0.5 rounded-full text-[11px] font-semibold ml-3"
        style={{
          background: student.status === 'active' ? '#d1fae5' : '#fee2e2',
          color: student.status === 'active' ? '#065f46' : '#991b1b',
        }}
      >
        {student.status}
      </span>
    </button>
  );
}

function SessionRow({ session }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50">
      <div className="w-[52px] text-center shrink-0">
        <p className="text-xs font-bold text-mentor-primary">
          {new Date(session.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
        </p>
        <p className="text-[11px] text-gray-400">{session.time}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{session.studentName}</p>
        <p className="text-xs text-gray-500">{session.topic}</p>
      </div>
      <a
        href={session.meetLink}
        target="_blank"
        rel="noreferrer"
        className="px-3.5 py-1.5 rounded-lg bg-mentor-primary text-white text-xs font-semibold shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        Join
      </a>
    </div>
  );
}

export default function MentorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const myStudents  = MOCK_STUDENTS.filter((s) => s.mentorId === user?.id);
  const allSessions = MOCK_SESSIONS.filter((s) => s.mentorId === user?.id);
  const upcoming    = allSessions.filter((s) => s.status === 'upcoming');
  const completed   = allSessions.filter((s) => s.status === 'completed');
  const mySlots     = MOCK_SLOTS.filter((s) => s.mentorId === user?.id);
  const available   = mySlots.filter((s) => s.status === 'available');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 flex flex-col gap-5 fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-mentor-primary to-cyan-600 rounded-2xl px-7 py-5 flex items-center justify-between shadow-banner-mentor">
        <div>
          <h2 className="text-xl font-bold text-white m-0">{greeting}, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-sm text-white/80 mt-1">Here's what's happening with your students today.</p>
        </div>
        <button
          className="px-5 py-2.5 rounded-[10px] bg-white/20 text-white font-semibold text-sm border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-colors"
          onClick={() => navigate('/mentor/slots')}
        >
          + Create Slot
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Students" value={myStudents.length}
          subtitle={`${myStudents.filter(s => s.status === 'active').length} active`}
          icon="👥" color="#10b981"
          onClick={() => navigate('/mentor/students')} trend={8}
        />
        <StatCard
          title="Upcoming Sessions" value={upcoming.length}
          subtitle="This week" icon="📅" color="#0d9488"
          onClick={() => navigate('/mentor/sessions')} trend={15}
        />
        <StatCard
          title="Completed Sessions" value={completed.length}
          subtitle="All time" icon="✅" color="#7c3aed"
          onClick={() => navigate('/mentor/sessions')} trend={22}
        />
        <StatCard
          title="Available Slots" value={available.length}
          subtitle="Open for booking" icon="🕐" color="#f59e0b"
          onClick={() => navigate('/mentor/slots')}
        />
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-2 gap-4">
        {/* My Students */}
        <div className="bg-white rounded-[14px] border border-gray-200 shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-gray-900">My Students</h3>
            <button className="text-[13px] text-mentor-primary font-semibold" onClick={() => navigate('/mentor/students')}>
              View all →
            </button>
          </div>
          <div className="py-2">
            {myStudents.slice(0, 5).map((s) => (
              <StudentRow key={s.id} student={s} onClick={() => navigate(`/mentor/students/${s.id}`)} />
            ))}
          </div>
        </div>

        {/* Upcoming Sessions + Quick Access */}
        <div className="bg-white rounded-[14px] border border-gray-200 shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-gray-900">Upcoming Sessions</h3>
            <button className="text-[13px] text-mentor-primary font-semibold" onClick={() => navigate('/mentor/sessions')}>
              View all →
            </button>
          </div>
          <div className="py-2">
            {upcoming.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">No upcoming sessions scheduled</div>
            ) : (
              upcoming.map((s) => <SessionRow key={s.id} session={s} />)
            )}
          </div>

          {/* Quick module shortcuts */}
          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.5px] mb-2.5">Quick Access</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Analytics',     icon: '📈', path: '/mentor/analytics' },
                { label: 'Assignments',   icon: '📝', path: '/mentor/assignments' },
                { label: 'Messages',      icon: '💬', path: '/mentor/communication' },
                { label: 'Notifications', icon: '🔔', path: '/mentor/notifications' },
              ].map((q) => (
                <button
                  key={q.path}
                  className="px-2 py-3 rounded-[10px] bg-gray-50 border border-gray-200 flex flex-col items-center gap-1.5 hover:bg-gray-100 transition-colors"
                  onClick={() => navigate(q.path)}
                >
                  <span className="text-xl">{q.icon}</span>
                  <span className="text-xs text-gray-700 font-medium">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
