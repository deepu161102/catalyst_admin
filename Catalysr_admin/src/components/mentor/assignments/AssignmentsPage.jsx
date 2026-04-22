// ============================================================
// ASSIGNMENTS & FEEDBACK PAGE
// ============================================================

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_ASSIGNMENTS, MOCK_STUDENTS } from '../../../data/mockData';

const gradeColor = { A: '#10b981', B: '#0d9488', C: '#f59e0b', D: '#ef4444' };

function StatusBadge({ status }) {
  const map = {
    submitted: { bg: '#d1fae5', color: '#065f46' },
    pending:   { bg: '#fef3c7', color: '#92400e' },
    overdue:   { bg: '#fee2e2', color: '#991b1b' },
    reviewed:  { bg: '#dbeafe', color: '#1e40af' },
  };
  const s = map[status] || map.pending;
  return (
    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

const inputClass = 'px-3 py-2 rounded-[10px] border-[1.5px] border-gray-200 text-[13px] text-gray-900 outline-none w-full';

function AssignModal({ students, onSave, onClose }) {
  const [form, setForm] = useState({ studentId: '', title: '', description: '', dueDate: '' });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div className="bg-white rounded-[18px] w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <h3 className="text-base font-bold text-gray-900">Assign New Task</h3>
          <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-sm" onClick={onClose}>✕</button>
        </div>
        <div className="p-6 flex flex-col gap-3.5">
          {[
            { label: 'Student *', el: <select className={inputClass} value={form.studentId} onChange={(e) => set('studentId', e.target.value)} required>
                <option value="">Select student...</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select> },
            { label: 'Assignment Title *', el: <input className={inputClass} type="text" placeholder="e.g. Build a REST API" value={form.title} onChange={(e) => set('title', e.target.value)} /> },
            { label: 'Description', el: <textarea className={`${inputClass} resize-y min-h-[80px]`} placeholder="Describe the assignment requirements..." value={form.description} onChange={(e) => set('description', e.target.value)} /> },
            { label: 'Due Date *', el: <input className={inputClass} type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} /> },
          ].map(({ label, el }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">{label}</label>
              {el}
            </div>
          ))}
        </div>
        <div className="px-6 py-3.5 border-t border-gray-100 flex gap-2.5 justify-end">
          <button className="px-5 py-2 rounded-[10px] bg-gray-100 text-gray-700 font-semibold text-[13px]" onClick={onClose}>Cancel</button>
          <button className="px-5 py-2 rounded-[10px] bg-mentor-primary text-white font-semibold text-[13px]" onClick={() => form.studentId && form.title && form.dueDate && onSave(form)}>
            Assign Task
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackModal({ assignment, onSave, onClose }) {
  const [feedback, setFeedback] = useState(assignment.feedback || '');
  const [grade, setGrade]       = useState(assignment.grade   || '');
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div className="bg-white rounded-[18px] w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <h3 className="text-base font-bold text-gray-900">Give Feedback</h3>
          <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-sm" onClick={onClose}>✕</button>
        </div>
        <div className="p-6 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Assignment</label>
            <p className="text-sm font-semibold text-gray-700">{assignment.title}</p>
            <p className="text-[13px] text-gray-500">by {assignment.studentName}</p>
          </div>
          {assignment.submission && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Submission Link</label>
              <a href={assignment.submission} target="_blank" rel="noreferrer" className="text-mentor-primary text-[13px]">{assignment.submission}</a>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Grade</label>
            <div className="flex gap-2">
              {['A', 'B', 'C', 'D'].map((g) => (
                <button
                  key={g}
                  className="w-10 h-10 rounded-[10px] font-bold text-base transition-all"
                  style={{
                    border: `2px solid ${grade === g ? gradeColor[g] : '#e5e7eb'}`,
                    background: grade === g ? (gradeColor[g] + '20') : '#fff',
                    color: gradeColor[g],
                  }}
                  onClick={() => setGrade(g)}
                >{g}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Feedback Comments</label>
            <textarea className={`${inputClass} resize-y min-h-[100px]`} placeholder="Write your feedback here..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          </div>
        </div>
        <div className="px-6 py-3.5 border-t border-gray-100 flex gap-2.5 justify-end">
          <button className="px-5 py-2 rounded-[10px] bg-gray-100 text-gray-700 font-semibold text-[13px]" onClick={onClose}>Cancel</button>
          <button className="px-5 py-2 rounded-[10px] bg-mentor-primary text-white font-semibold text-[13px]" onClick={() => onSave({ feedback, grade })}>Save Feedback</button>
        </div>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS.filter((a) => a.mentorId === user?.id));
  const [showAssign, setShowAssign]   = useState(false);
  const [feedbackFor, setFeedbackFor] = useState(null);
  const [tab, setTab]                 = useState('all');

  const myStudents = MOCK_STUDENTS.filter((s) => s.mentorId === user?.id);

  const handleAssign = (form) => {
    setAssignments((p) => [...p, {
      id: `asgn-${Date.now()}`, mentorId: user?.id,
      studentName: myStudents.find((s) => s.id === form.studentId)?.name || '',
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'pending', submission: null, feedback: '', grade: null, ...form,
    }]);
    setShowAssign(false);
  };

  const handleFeedback = ({ feedback, grade }) => {
    setAssignments((p) => p.map((a) => a.id === feedbackFor.id ? { ...a, feedback, grade, status: 'reviewed' } : a));
    setFeedbackFor(null);
  };

  const counts = { all: assignments.length, pending: 0, submitted: 0, overdue: 0, reviewed: 0 };
  assignments.forEach((a) => { if (counts[a.status] !== undefined) counts[a.status]++; });
  const filtered = tab === 'all' ? assignments : assignments.filter((a) => a.status === tab);

  return (
    <div className="p-6 flex flex-col gap-4 fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Assignments & Feedback</h2>
          <p className="text-sm text-gray-500 mt-0.5">Assign tasks, review submissions, and give feedback</p>
        </div>
        <button className="px-5 py-2 rounded-[10px] bg-mentor-primary text-white font-semibold text-sm shadow-[0_4px_12px_rgba(13,148,136,0.3)]" onClick={() => setShowAssign(true)}>
          + Assign Task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
        {[
          { key: 'all',       label: `All (${counts.all})` },
          { key: 'pending',   label: `Pending (${counts.pending})` },
          { key: 'submitted', label: `Submitted (${counts.submitted})` },
          { key: 'overdue',   label: `Overdue (${counts.overdue})` },
          { key: 'reviewed',  label: `Reviewed (${counts.reviewed})` },
        ].map((t) => (
          <button
            key={t.key}
            className={`flex-1 py-2 px-1.5 rounded-[10px] text-xs whitespace-nowrap transition-all ${
              tab === t.key ? 'bg-white text-mentor-primary font-bold shadow-sm' : 'text-gray-500 font-medium'
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400">No assignments in this category</div>
        ) : filtered.map((a) => (
          <div key={a.id} className="bg-white rounded-xl px-5 py-4 border border-gray-200 flex gap-4 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h4 className="text-[15px] font-bold text-gray-900">{a.title}</h4>
                <StatusBadge status={a.status} />
                {a.grade && (
                  <span className="px-2 py-0.5 rounded-lg font-bold text-[13px]" style={{ background: (gradeColor[a.grade] || '#6b7280') + '20', color: gradeColor[a.grade] || '#6b7280' }}>
                    Grade: {a.grade}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-gray-500 mt-1">
                Assigned to: <strong className="text-gray-700">{a.studentName}</strong>
                &nbsp;·&nbsp;Due: {new Date(a.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              {a.description && <p className="text-[13px] text-gray-500 mt-1.5">{a.description}</p>}
              {a.submission && (
                <p className="text-xs mt-1.5">
                  Submission: <a href={a.submission} target="_blank" rel="noreferrer" className="text-mentor-primary font-semibold">{a.submission}</a>
                </p>
              )}
              {a.feedback && (
                <div className="mt-2 px-3.5 py-2.5 bg-mentor-lighter rounded-lg border border-mentor-light">
                  <p className="text-xs font-bold text-mentor-primary mb-1">Your Feedback:</p>
                  <p className="text-[13px] text-gray-700">{a.feedback}</p>
                </div>
              )}
            </div>
            {a.status === 'submitted' && (
              <button
                className="px-4 py-2 rounded-[10px] bg-ops-primary text-white text-[13px] font-semibold shrink-0"
                onClick={() => setFeedbackFor(a)}
              >
                Review & Grade
              </button>
            )}
          </div>
        ))}
      </div>

      {showAssign && <AssignModal students={myStudents} onSave={handleAssign} onClose={() => setShowAssign(false)} />}
      {feedbackFor && <FeedbackModal assignment={feedbackFor} onSave={handleFeedback} onClose={() => setFeedbackFor(null)} />}
    </div>
  );
}
