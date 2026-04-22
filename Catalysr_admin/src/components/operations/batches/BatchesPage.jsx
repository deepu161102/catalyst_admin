// ============================================================
// BATCHES PAGE (Operations) — Batch management
// The glue entity connecting students + mentors + courses
// ============================================================

import { useState } from 'react';
import { MOCK_BATCHES, MOCK_MENTORS, MOCK_STUDENTS } from '../../../data/mockData';

const inputClass = 'w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-gray-200 text-[13px] outline-none bg-white';

/* ── Create Batch Modal ──────────────────────────────────── */
function CreateBatchModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: '', course: '', mentorId: '', startDate: '', endDate: '', totalSessions: 60 });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div className="bg-white rounded-[18px] w-[460px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-base font-bold text-gray-900">Create New Batch</h3>
          <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-sm" onClick={onClose}>✕</button>
        </div>
        <div className="p-6 flex flex-col gap-3.5">
          {[
            { key: 'name',          label: 'Batch Name *',    type: 'text',         placeholder: 'e.g. Full Stack Batch 03' },
            { key: 'course',        label: 'Course *',         type: 'select',       options: ['Full Stack Development', 'Data Science', 'UI/UX Design', 'DevOps'] },
            { key: 'mentorId',      label: 'Assign Mentor *',  type: 'mentorSelect' },
            { key: 'startDate',     label: 'Start Date',       type: 'date' },
            { key: 'endDate',       label: 'End Date',         type: 'date' },
            { key: 'totalSessions', label: 'Total Sessions',   type: 'number' },
          ].map(({ key, label, type, placeholder, options }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">{label}</label>
              {type === 'select' ? (
                <select className={inputClass} value={form[key]} onChange={(e) => set(key, e.target.value)}>
                  <option value="">Select...</option>
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : type === 'mentorSelect' ? (
                <select className={inputClass} value={form.mentorId} onChange={(e) => set('mentorId', e.target.value)}>
                  <option value="">Select mentor...</option>
                  {MOCK_MENTORS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              ) : (
                <input className={inputClass} type={type} placeholder={placeholder} value={form[key]} onChange={(e) => set(key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-3.5 border-t border-gray-100 flex gap-2.5 justify-end">
          <button className="px-5 py-2 rounded-[10px] bg-gray-100 text-gray-700 font-semibold text-[13px]" onClick={onClose}>Cancel</button>
          <button
            className="px-5 py-2 rounded-[10px] bg-ops-primary text-white font-semibold text-[13px]"
            onClick={() => form.name && form.course && form.mentorId && onSave(form)}
          >
            Create Batch
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function BatchesPage() {
  const [batches, setBatches]       = useState(MOCK_BATCHES);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch]         = useState('');

  const filtered = batches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.course.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (form) => {
    const newBatch = {
      id: `BATCH-${Date.now()}`,
      ...form,
      totalSessions: Number(form.totalSessions),
      completedSessions: 0,
      studentIds: [],
      status: 'active',
    };
    setBatches((p) => [...p, newBatch]);
    setShowCreate(false);
  };

  return (
    <div className="p-6 flex flex-col gap-4 fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Batch Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Batches connect students with mentors and courses</p>
        </div>
        <button
          className="px-5 py-2.5 rounded-[10px] bg-ops-primary text-white font-semibold text-sm shadow-[0_4px_12px_rgba(124,58,237,0.3)]"
          onClick={() => setShowCreate(true)}
        >
          + Create Batch
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Batches',  value: batches.length,                                                                                                                  color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Active',         value: batches.filter(b => b.status === 'active').length,                                                                               color: '#10b981', bg: '#d1fae5' },
          { label: 'Total Students', value: batches.reduce((a, b) => a + b.studentIds.length, 0),                                                                            color: '#0d9488', bg: '#f0fdfa' },
          { label: 'Avg Completion', value: `${Math.round(batches.reduce((a, b) => a + (b.completedSessions / b.totalSessions) * 100, 0) / batches.length)}%`,              color: '#f59e0b', bg: '#fef3c7' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl px-5 py-4 border border-black/[0.04]" style={{ background: c.bg }}>
            <p className="text-[22px] font-extrabold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        className="px-4 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-[13px] outline-none bg-white text-gray-700"
        placeholder="Search batches by name or course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Batch cards */}
      <div className="grid grid-cols-3 gap-3.5">
        {filtered.map((batch) => {
          const mentor  = MOCK_MENTORS.find((m) => m.id === batch.mentorId);
          const pct     = Math.round((batch.completedSessions / batch.totalSessions) * 100);

          return (
            <div key={batch.id} className="bg-white rounded-[14px] p-[18px] border border-gray-200 shadow-panel flex flex-col gap-0">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[15px] font-bold text-gray-900">{batch.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{batch.course}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">{batch.status}</span>
              </div>

              {/* Mentor */}
              {mentor && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-ops-lighter rounded-lg">
                  <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-ops-primary to-purple-400 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {mentor.avatar}
                  </div>
                  <span className="text-[13px] text-gray-700 font-medium">{mentor.name}</span>
                </div>
              )}

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-gray-500">Session Progress</span>
                  <span className="text-xs font-bold text-ops-primary">{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-ops-primary to-purple-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{batch.completedSessions} / {batch.totalSessions} sessions completed</p>
              </div>

              {/* Footer stats */}
              <div className="flex border-t border-gray-100 pt-3">
                {[
                  { label: 'Students', value: batch.studentIds.length },
                  { label: 'Start',    value: new Date(batch.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
                  { label: 'End',      value: new Date(batch.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
                ].map((st) => (
                  <div key={st.label} className="flex-1 text-center">
                    <p className="text-[13px] font-bold text-gray-700">{st.value}</p>
                    <p className="text-[11px] text-gray-400">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && <CreateBatchModal onSave={handleCreate} onClose={() => setShowCreate(false)} />}
    </div>
  );
}
