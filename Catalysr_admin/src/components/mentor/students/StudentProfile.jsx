// ============================================================
// STUDENT PROFILE — Deep-dive view per student
// ============================================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_STUDENTS, MOCK_SESSIONS, MOCK_ASSIGNMENTS } from '../../../data/mockData';

const backIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;

const TABS = ['Overview', 'Sessions', 'Assignments', 'Notes'];

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [newNote, setNewNote]     = useState('');
  const [notes, setNotes]         = useState([]);

  const student = MOCK_STUDENTS.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="p-10 text-center text-gray-400">
        Student not found.{' '}
        <button className="text-mentor-primary font-semibold" onClick={() => navigate('/mentor/students')}>
          Go back
        </button>
      </div>
    );
  }

  const sessions     = MOCK_SESSIONS.filter((s) => s.studentId === id);
  const assignments  = MOCK_ASSIGNMENTS.filter((a) => a.studentId === id);
  const allNotes     = [...student.notes, ...notes];
  const progressColor = student.progress >= 80 ? '#10b981' : student.progress >= 50 ? '#f59e0b' : '#ef4444';

  const addNote = () => {
    if (newNote.trim()) { setNotes([...notes, newNote.trim()]); setNewNote(''); }
  };

  return (
    <div className="p-6 flex flex-col gap-4 fade-in">
      {/* Back */}
      <button className="flex items-center gap-1.5 text-mentor-primary font-semibold text-sm" onClick={() => navigate('/mentor/students')}>
        {backIcon} Back to Students
      </button>

      {/* Hero */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 flex items-center gap-5">
        <div
          className="w-[72px] h-[72px] rounded-full text-white font-extrabold text-[26px] flex items-center justify-center shrink-0"
          style={{ background: `hsl(${student.id.charCodeAt(1) * 25}, 60%, 50%)` }}
        >
          {student.avatar}
        </div>
        <div className="flex-1">
          <h2 className="text-[22px] font-extrabold text-gray-900">{student.name}</h2>
          <p className="text-gray-500 mt-1">{student.email} · {student.phone}</p>
          <div className="flex gap-2.5 mt-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-mentor-lighter text-mentor-primary text-xs font-semibold border border-mentor-light">
              {student.course}
            </span>
            <span className="px-3 py-1 rounded-full bg-mentor-lighter text-mentor-primary text-xs font-semibold border border-mentor-light">
              {student.batch}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: student.status === 'active' ? '#d1fae5' : '#fee2e2',
                color:      student.status === 'active' ? '#065f46' : '#991b1b',
              }}
            >
              {student.status}
            </span>
          </div>
        </div>

        {/* Progress ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="7" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke={progressColor} strokeWidth="7"
              strokeDasharray={`${(2 * Math.PI * 34 * student.progress) / 100} ${2 * Math.PI * 34}`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="absolute flex flex-col items-center leading-snug">
            <span className="text-lg font-extrabold" style={{ color: progressColor }}>{student.progress}%</span>
            <span className="text-[10px] text-gray-400">Progress</span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Sessions Completed', value: sessions.filter(s => s.status === 'completed').length, color: '#0d9488' },
          { label: 'Upcoming Sessions',  value: sessions.filter(s => s.status === 'upcoming').length,  color: '#7c3aed' },
          { label: 'Assignments Given',  value: assignments.length,                                     color: '#f59e0b' },
          { label: 'Assignments Done',   value: assignments.filter(a => a.status === 'submitted').length, color: '#10b981' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl px-5 py-4 border border-gray-200 text-center">
            <p className="text-2xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 rounded-[10px] text-[13px] transition-all ${
              activeTab === tab
                ? 'bg-white text-mentor-primary font-bold shadow-sm'
                : 'text-gray-500 font-medium'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-[14px] border border-gray-200 overflow-hidden min-h-[200px]">
        {/* Overview */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-2">
            {[
              { title: 'Personal Info', rows: [
                { label: 'Full Name', value: student.name },
                { label: 'Email', value: student.email },
                { label: 'Phone', value: student.phone },
                { label: 'Joined', value: new Date(student.joinedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
              ]},
              { title: 'Enrollment Details', rows: [
                { label: 'Course', value: student.course },
                { label: 'Batch', value: student.batch },
                { label: 'Status', value: student.status },
                { label: 'Last Session', value: student.lastSession ? new Date(student.lastSession).toLocaleDateString() : 'N/A' },
              ]},
            ].map((card) => (
              <div key={card.title} className="p-6 border-r border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-4">{card.title}</h4>
                {card.rows.map((row) => (
                  <div key={row.label} className="flex justify-between py-2.5 border-b border-gray-50">
                    <span className="text-[13px] text-gray-500">{row.label}</span>
                    <span className="text-[13px] font-semibold text-gray-900">{row.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Sessions */}
        {activeTab === 'Sessions' && (
          <div className="py-2">
            {sessions.length === 0 ? (
              <div className="p-10 text-center text-gray-400">No sessions yet</div>
            ) : sessions.map((sess) => (
              <div key={sess.id} className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{sess.topic}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {new Date(sess.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })} · {sess.time} · {sess.duration}min
                  </p>
                </div>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    background: sess.status === 'completed' ? '#d1fae5' : '#dbeafe',
                    color:      sess.status === 'completed' ? '#065f46' : '#1e40af',
                  }}
                >
                  {sess.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Assignments */}
        {activeTab === 'Assignments' && (
          <div className="py-2">
            {assignments.length === 0 ? (
              <div className="p-10 text-center text-gray-400">No assignments yet</div>
            ) : assignments.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                  {a.feedback && <p className="text-mentor-primary text-xs mt-1">Feedback: {a.feedback}</p>}
                </div>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    background: a.status === 'submitted' ? '#d1fae5' : a.status === 'overdue' ? '#fee2e2' : '#fef3c7',
                    color:      a.status === 'submitted' ? '#065f46' : a.status === 'overdue' ? '#991b1b' : '#92400e',
                  }}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {activeTab === 'Notes' && (
          <div>
            <div className="p-5 border-b border-gray-100 flex gap-3 items-end">
              <textarea
                className="flex-1 px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-gray-200 resize-y text-sm outline-none text-gray-700"
                placeholder="Add a note about this student..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <button
                className="px-5 py-2.5 rounded-[10px] bg-mentor-primary text-white font-semibold text-[13px] shrink-0"
                onClick={addNote}
              >
                Add Note
              </button>
            </div>
            <div className="py-2">
              {allNotes.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No notes yet. Add your first note above.</div>
              ) : (
                allNotes.map((note, i) => (
                  <div key={i} className="flex gap-3 px-6 py-3.5 border-b border-gray-100 items-start">
                    <span className="text-base shrink-0">📌</span>
                    <p className="text-gray-700 text-sm flex-1">{note}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
