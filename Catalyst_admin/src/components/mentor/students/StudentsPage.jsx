// ============================================================
// STUDENTS PAGE — Full student roster for this mentor
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_STUDENTS } from '../../../data/mockData';

const searchIcon = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

function ProgressBar({ value }) {
  const color = value >= 80 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold w-[30px] text-right" style={{ color }}>{value}%</span>
    </div>
  );
}

export default function StudentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [sortBy, setSortBy]           = useState('name');

  const myStudents = MOCK_STUDENTS.filter((s) => s.mentorId === user?.id);
  const courses    = [...new Set(myStudents.map((s) => s.course))];

  const filtered = myStudents
    .filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || s.status === filterStatus;
      const matchCourse = filterCourse === 'all' || s.course === filterCourse;
      return matchSearch && matchStatus && matchCourse;
    })
    .sort((a, b) => {
      if (sortBy === 'name')     return a.name.localeCompare(b.name);
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'joined')   return new Date(b.joinedDate) - new Date(a.joinedDate);
      return 0;
    });

  return (
    <div className="p-6 flex flex-col gap-4 fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">My Students</h2>
          <p className="text-sm text-gray-500 mt-0.5">{myStudents.length} students assigned to you</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',        value: myStudents.length,                                                                color: '#0d9488', bg: '#f0fdfa' },
          { label: 'Active',       value: myStudents.filter(s => s.status === 'active').length,                             color: '#10b981', bg: '#d1fae5' },
          { label: 'Inactive',     value: myStudents.filter(s => s.status === 'inactive').length,                           color: '#ef4444', bg: '#fee2e2' },
          { label: 'Avg Progress', value: `${Math.round(myStudents.reduce((a, s) => a + s.progress, 0) / myStudents.length)}%`, color: '#7c3aed', bg: '#ede9fe' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl px-5 py-4 border border-black/5" style={{ background: c.bg }}>
            <p className="text-[22px] font-extrabold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs text-gray-500 font-medium">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex gap-3 items-center bg-white px-4 py-3 rounded-xl border border-gray-200">
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <span className="text-gray-400 flex">{searchIcon}</span>
          <input
            className="border-none bg-transparent outline-none text-[13px] text-gray-700 w-full"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2.5 items-center">
          {[
            { value: filterStatus, onChange: setFilterStatus, options: [['all','All Status'],['active','Active'],['inactive','Inactive']] },
            { value: filterCourse, onChange: setFilterCourse, options: [['all','All Courses'], ...courses.map(c => [c, c])] },
            { value: sortBy,       onChange: setSortBy,       options: [['name','Sort: Name'],['progress','Sort: Progress'],['joined','Sort: Joined']] },
          ].map((sel, i) => (
            <select
              key={i}
              className="px-3 py-2 rounded-lg border-[1.5px] border-gray-200 text-[13px] text-gray-700 bg-white outline-none"
              value={sel.value}
              onChange={(e) => sel.onChange(e.target.value)}
            >
              {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-[14px] border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-[0.4px] gap-3">
          <span className="flex-[2]">Student</span>
          <span className="flex-[2]">Course / Batch</span>
          <span className="flex-[2]">Progress</span>
          <span className="flex-1">Last Session</span>
          <span className="flex-1">Status</span>
          <span className="flex-1">Action</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No students match your filters</div>
        ) : (
          filtered.map((student) => (
            <div key={student.id} className="flex items-center px-5 py-3.5 border-b border-gray-100 gap-3 hover:bg-gray-50 transition-colors">
              <div className="flex-[2] flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full text-white font-bold text-[13px] flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${student.id.charCodeAt(1) * 25}, 60%, 50%)` }}
                >
                  {student.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-400">{student.email}</p>
                </div>
              </div>
              <div className="flex-[2]">
                <p className="text-[13px] text-gray-700 font-medium">{student.course}</p>
                <p className="text-[11px] text-gray-400">{student.batch}</p>
              </div>
              <div className="flex-[2]">
                <ProgressBar value={student.progress} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-gray-500">
                  {student.lastSession
                    ? new Date(student.lastSession).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                    : '—'}
                </p>
              </div>
              <div className="flex-1">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    background: student.status === 'active' ? '#d1fae5' : '#fee2e2',
                    color:      student.status === 'active' ? '#065f46' : '#991b1b',
                  }}
                >
                  {student.status}
                </span>
              </div>
              <div className="flex-1">
                <button
                  className="px-3 py-1.5 rounded-lg bg-mentor-lighter text-mentor-primary text-xs font-semibold border border-mentor-light"
                  onClick={() => navigate(`/mentor/students/${student.id}`)}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
