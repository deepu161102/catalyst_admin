// ============================================================
// MENTORS LIST PAGE (Operations)
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_STUDENTS } from '../../../data/mockData';
import { useData } from '../../../context/DataContext';

export default function MentorsListPage() {
  const navigate = useNavigate();
  const { mentors } = useData();
  const [search, setSearch] = useState('');

  const filtered = mentors.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 flex flex-col gap-4 fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Mentors</h2>
          <p className="text-sm text-gray-500 mt-0.5">{mentors.length} mentors on the platform</p>
        </div>
        <button
          className="px-5 py-2 rounded-[10px] bg-ops-primary text-white font-semibold text-sm shadow-[0_4px_12px_rgba(124,58,237,0.3)]"
          onClick={() => navigate('/operations/mentors/add')}
        >
          + Add Mentor
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Mentors',        value: mentors.length,                                      color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Active',               value: mentors.filter(m => m.status === 'active').length,   color: '#10b981', bg: '#d1fae5' },
          { label: 'Total Students',       value: MOCK_STUDENTS.length,                                color: '#0d9488', bg: '#f0fdfa' },
          { label: 'Avg Students/Mentor',  value: Math.round(MOCK_STUDENTS.length / mentors.length),   color: '#f59e0b', bg: '#fef3c7' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl px-5 py-4 border border-black/[0.04]" style={{ background: c.bg }}>
            <p className="text-[22px] font-extrabold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-1">
        <input
          className="w-full py-2.5 border-none outline-none text-sm text-gray-700"
          placeholder="Search mentors by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Mentor cards grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((mentor) => (
          <button
            key={mentor.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 text-left hover:shadow-md transition-shadow shadow-panel flex flex-col gap-3 cursor-pointer"
            onClick={() => navigate(`/operations/mentors/${mentor.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-ops-primary to-purple-400 text-white font-bold text-[15px] flex items-center justify-center shrink-0">
                {mentor.avatar}
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-gray-900">{mentor.name}</p>
                <p className="text-xs text-gray-400">{mentor.specialization}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">
                {mentor.status}
              </span>
            </div>

            <div className="flex border-t border-gray-100 pt-3">
              {[
                { label: 'Students', value: mentor.students.length, color: '#7c3aed' },
                { label: 'Sessions', value: mentor.sessionsCompleted, color: '#0d9488' },
                { label: 'Rating',   value: `⭐ ${mentor.rating}`, color: '#f59e0b' },
              ].map((stat) => (
                <div key={stat.label} className="flex-1 text-center">
                  <p className="text-xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[11px] text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-2.5">
              <span className="text-[13px] text-ops-primary font-semibold">View Students →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
