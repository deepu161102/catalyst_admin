// ============================================================
// OPS STUDENTS PAGE — All students across the platform
// Operations-level view with batch/mentor filters
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_STUDENTS, MOCK_MENTORS } from '../../../data/mockData';

const inputClass = 'px-3 py-2 rounded-lg border-[1.5px] border-gray-200 text-[13px] outline-none bg-white text-gray-700';

export default function OpsStudentsPage() {
  const navigate = useNavigate();
  const [search, setSearch]             = useState('');
  const [filterMentor, setFilterMentor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');

  const courses = [...new Set(MOCK_STUDENTS.map((s) => s.course))];

  const filtered = MOCK_STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchMentor = filterMentor === 'all' || s.mentorId === filterMentor;
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchCourse = filterCourse === 'all' || s.course === filterCourse;
    return matchSearch && matchMentor && matchStatus && matchCourse;
  });

  return (
    <div className="p-6 flex flex-col gap-4 fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">All Students</h2>
          <p className="text-sm text-gray-500 mt-0.5">{MOCK_STUDENTS.length} total students across the platform</p>
        </div>
        <button
          className="px-5 py-2.5 rounded-[10px] bg-ops-primary text-white font-semibold text-sm shadow-[0_4px_12px_rgba(124,58,237,0.3)]"
          onClick={() => navigate('/operations/students/add')}
        >
          + Add Student
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',        value: MOCK_STUDENTS.length,                                                                                   color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Active',       value: MOCK_STUDENTS.filter(s => s.status === 'active').length,                                                color: '#10b981', bg: '#d1fae5' },
          { label: 'Inactive',     value: MOCK_STUDENTS.filter(s => s.status === 'inactive').length,                                              color: '#ef4444', bg: '#fee2e2' },
          { label: 'Avg Progress', value: `${Math.round(MOCK_STUDENTS.reduce((a, s) => a + s.progress, 0) / MOCK_STUDENTS.length)}%`,             color: '#f59e0b', bg: '#fef3c7' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl px-5 py-4 border border-black/[0.04]" style={{ background: c.bg }}>
            <p className="text-[22px] font-extrabold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2.5 bg-white px-4 py-3 rounded-xl border border-gray-200">
        <input
          className={`${inputClass} flex-1`}
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={inputClass} value={filterMentor} onChange={(e) => setFilterMentor(e.target.value)}>
          <option value="all">All Mentors</option>
          {MOCK_MENTORS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select className={inputClass} value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
          <option value="all">All Courses</option>
          {courses.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className={inputClass} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[14px] border border-gray-200 overflow-hidden">
        <div className="flex px-5 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-[0.4px] gap-3">
          <span className="flex-[2]">Student</span>
          <span className="flex-[2]">Course / Batch</span>
          <span className="flex-[2]">Mentor</span>
          <span className="flex-1">Progress</span>
          <span className="flex-1">Status</span>
        </div>
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No students match your filters</div>
        ) : filtered.map((s) => {
          const mentor = MOCK_MENTORS.find((m) => m.id === s.mentorId);
          const pc     = s.progress >= 80 ? '#10b981' : s.progress >= 50 ? '#f59e0b' : '#ef4444';
          return (
            <div key={s.id} className="flex items-center px-5 py-3 border-b border-gray-100 gap-3">
              <div className="flex-[2] flex items-center gap-2.5">
                <div
                  className="w-[34px] h-[34px] rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${s.id.charCodeAt(1) * 25}, 60%, 50%)` }}
                >
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
              <div className="flex-[2] flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ops-primary to-purple-400 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  {mentor?.avatar}
                </div>
                <span className="text-[13px] text-gray-700">{mentor?.name || '—'}</span>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold" style={{ color: pc }}>{s.progress}%</p>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: pc }} />
                </div>
              </div>
              <div className="flex-1">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ background: s.status === 'active' ? '#d1fae5' : '#fee2e2', color: s.status === 'active' ? '#065f46' : '#991b1b' }}
                >
                  {s.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
