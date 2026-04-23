// ============================================================
// BATCH DETAIL PAGE — Shows enrolled students with
// add / remove / shift-to-batch edit capabilities
// ============================================================

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../../context/DataContext';

/* ── helpers ─────────────────────────────────────────────── */
const inputClass =
  'w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-gray-200 text-[13px] outline-none bg-white';

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Add Student Modal ───────────────────────────────────── */
function AddStudentModal({ batchId, onClose }) {
  const { students, batches, addStudentToBatch } = useData();
  const [selected, setSelected] = useState('');

  // Students not already in this batch
  const currentBatch   = batches.find((b) => b.id === batchId);
  const available      = students.filter((s) => !currentBatch?.studentIds.includes(s.id));

  const handleAdd = () => {
    if (!selected) return;
    addStudentToBatch(selected, batchId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div className="bg-white rounded-[18px] w-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-base font-bold text-gray-900">Add Student to Batch</h3>
          <button
            className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-sm"
            onClick={onClose}
          >✕</button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {available.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">All students are already enrolled in this batch.</p>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Select Student *</label>
                <select
                  className={inputClass}
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="">Choose a student...</option>
                  {available.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.course} {s.batch ? `(currently in ${s.batch})` : '(unassigned)'}
                    </option>
                  ))}
                </select>
              </div>

              {selected && (() => {
                const s = students.find((st) => st.id === selected);
                return s ? (
                  <div className="bg-purple-50 rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ops-primary to-purple-400 text-white font-bold text-[12px] flex items-center justify-center shrink-0">
                      {s.avatar}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">{s.name}</p>
                      <p className="text-[11px] text-gray-500">{s.email} · {s.course}</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </>
          )}
        </div>

        <div className="px-6 py-3.5 border-t border-gray-100 flex gap-2.5 justify-end">
          <button
            className="px-5 py-2 rounded-[10px] bg-gray-100 text-gray-700 font-semibold text-[13px]"
            onClick={onClose}
          >Cancel</button>
          {available.length > 0 && (
            <button
              className="px-5 py-2 rounded-[10px] bg-ops-primary text-white font-semibold text-[13px] disabled:opacity-40"
              onClick={handleAdd}
              disabled={!selected}
            >Add to Batch</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Shift Student Modal ─────────────────────────────────── */
function ShiftStudentModal({ student, fromBatchId, onClose }) {
  const { batches, shiftStudent } = useData();
  const [targetBatchId, setTargetBatchId] = useState('');

  // Other batches (exclude current) with same or any course
  const otherBatches = batches.filter((b) => b.id !== fromBatchId);

  const handleShift = () => {
    if (!targetBatchId) return;
    shiftStudent(student.id, fromBatchId, targetBatchId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div className="bg-white rounded-[18px] w-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-base font-bold text-gray-900">Shift Student to Another Batch</h3>
          <button
            className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-sm"
            onClick={onClose}
          >✕</button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* Student info */}
          <div className="bg-orange-50 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white font-bold text-[12px] flex items-center justify-center shrink-0">
              {student.avatar}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">{student.name}</p>
              <p className="text-[11px] text-gray-500">{student.email}</p>
            </div>
          </div>

          {otherBatches.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-2">No other batches available.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Move to Batch *</label>
              <select
                className={inputClass}
                value={targetBatchId}
                onChange={(e) => setTargetBatchId(e.target.value)}
              >
                <option value="">Select target batch...</option>
                {otherBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — {b.course} ({b.studentIds.length} students)
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="text-[11px] text-gray-400">
            The student will be removed from the current batch and added to the selected batch.
          </p>
        </div>

        <div className="px-6 py-3.5 border-t border-gray-100 flex gap-2.5 justify-end">
          <button
            className="px-5 py-2 rounded-[10px] bg-gray-100 text-gray-700 font-semibold text-[13px]"
            onClick={onClose}
          >Cancel</button>
          {otherBatches.length > 0 && (
            <button
              className="px-5 py-2 rounded-[10px] bg-orange-500 text-white font-semibold text-[13px] disabled:opacity-40"
              onClick={handleShift}
              disabled={!targetBatchId}
            >Shift Student</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Remove Confirmation ─────────────────────────────────── */
function RemoveConfirmModal({ student, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div className="bg-white rounded-[18px] w-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-base font-bold text-gray-900">Remove Student</h3>
          <button
            className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-sm"
            onClick={onClose}
          >✕</button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600">
            Are you sure you want to remove <span className="font-semibold text-gray-900">{student.name}</span> from this batch?
            They will become unassigned but their profile will not be deleted.
          </p>
        </div>
        <div className="px-6 py-3.5 border-t border-gray-100 flex gap-2.5 justify-end">
          <button
            className="px-5 py-2 rounded-[10px] bg-gray-100 text-gray-700 font-semibold text-[13px]"
            onClick={onClose}
          >Cancel</button>
          <button
            className="px-5 py-2 rounded-[10px] bg-red-500 text-white font-semibold text-[13px]"
            onClick={onConfirm}
          >Remove</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function BatchDetailPage() {
  const { id }                              = useParams();
  const navigate                            = useNavigate();
  const { batches, students, mentors, removeStudentFromBatch } = useData();

  const [editMode, setEditMode]             = useState(false);
  const [showAdd, setShowAdd]               = useState(false);
  const [shiftTarget, setShiftTarget]       = useState(null); // student to shift
  const [removeTarget, setRemoveTarget]     = useState(null); // student to remove

  const batch   = batches.find((b) => b.id === id);

  if (!batch) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 p-10">
        <p className="text-5xl">🔍</p>
        <p className="text-lg font-bold text-gray-700">Batch not found</p>
        <button
          className="mt-2 px-5 py-2 rounded-[10px] bg-ops-primary text-white font-semibold text-sm"
          onClick={() => navigate('/operations/batches')}
        >Back to Batches</button>
      </div>
    );
  }

  const mentor          = mentors.find((m) => m.id === batch.mentorId);
  const enrolledStudents = students.filter((s) => batch.studentIds.includes(s.id));
  const pct             = Math.round((batch.completedSessions / batch.totalSessions) * 100);

  const handleRemoveConfirm = () => {
    removeStudentFromBatch(removeTarget.id, batch.id);
    setRemoveTarget(null);
  };

  return (
    <div className="p-6 flex flex-col gap-5 fade-in">

      {/* ── Back + Header ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
          onClick={() => navigate('/operations/batches')}
        >←</button>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-gray-900">{batch.name}</h2>
          <p className="text-sm text-gray-500">{batch.course}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${batch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {batch.status}
        </span>
        <button
          className={`px-5 py-2 rounded-[10px] font-semibold text-sm transition-colors ${
            editMode
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-ops-primary text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)] hover:bg-purple-700'
          }`}
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? 'Done Editing' : 'Edit Batch'}
        </button>
      </div>

      {/* ── Batch Info Cards ───────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Enrolled Students', value: enrolledStudents.length, color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Session Progress',  value: `${pct}%`,               color: '#10b981', bg: '#d1fae5' },
          { label: 'Start Date',        value: fmt(batch.startDate),    color: '#0d9488', bg: '#f0fdfa' },
          { label: 'End Date',          value: fmt(batch.endDate),      color: '#f59e0b', bg: '#fef3c7' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl px-5 py-4 border border-black/[0.04]" style={{ background: c.bg }}>
            <p className="text-[20px] font-extrabold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* ── Mentor + Progress Row ──────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mentor card */}
        <div className="bg-white rounded-[14px] p-5 border border-gray-200 shadow-panel">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Assigned Mentor</p>
          {mentor ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-ops-primary to-purple-400 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {mentor.avatar}
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900">{mentor.name}</p>
                <p className="text-[12px] text-gray-500">{mentor.specialization}</p>
                <p className="text-[11px] text-gray-400">{mentor.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No mentor assigned</p>
          )}
        </div>

        {/* Session progress card */}
        <div className="bg-white rounded-[14px] p-5 border border-gray-200 shadow-panel">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Session Progress</p>
          <div className="flex justify-between mb-2">
            <span className="text-[13px] text-gray-600">{batch.completedSessions} of {batch.totalSessions} sessions</span>
            <span className="text-[13px] font-bold text-ops-primary">{pct}%</span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ops-primary to-purple-400 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Batch ID: {batch.id}</p>
        </div>
      </div>

      {/* ── Enrolled Students ─────────────────────────────── */}
      <div className="bg-white rounded-[14px] border border-gray-200 shadow-panel overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-[15px] font-bold text-gray-900">Enrolled Students</h3>
            <p className="text-xs text-gray-400 mt-0.5">{enrolledStudents.length} student{enrolledStudents.length !== 1 ? 's' : ''} in this batch</p>
          </div>
          {editMode && (
            <button
              className="px-4 py-2 rounded-[10px] bg-ops-primary text-white font-semibold text-[13px] shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
              onClick={() => setShowAdd(true)}
            >+ Add Student</button>
          )}
        </div>

        {enrolledStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-gray-400 gap-2">
            <p className="text-3xl">👥</p>
            <p className="text-sm font-semibold text-gray-500">No students enrolled yet</p>
            {editMode && (
              <p className="text-xs text-gray-400">Click "+ Add Student" to enroll someone</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {enrolledStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ops-primary/80 to-purple-400 text-white font-bold text-[12px] flex items-center justify-center shrink-0">
                  {student.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-gray-900">{student.name}</p>
                  <p className="text-[12px] text-gray-400 truncate">{student.email} · {student.phone}</p>
                </div>

                {/* Progress */}
                <div className="w-32 hidden sm:block">
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-gray-400">Progress</span>
                    <span className="text-[11px] font-bold text-ops-primary">{student.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-ops-primary to-purple-400 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>

                {/* Status badge */}
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
                }`}>
                  {student.status}
                </span>

                {/* Edit actions */}
                {editMode && (
                  <div className="flex gap-2 ml-2 shrink-0">
                    <button
                      className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 font-semibold text-[12px] hover:bg-orange-100 transition-colors border border-orange-200"
                      onClick={() => setShiftTarget(student)}
                    >Shift</button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-semibold text-[12px] hover:bg-red-100 transition-colors border border-red-200"
                      onClick={() => setRemoveTarget(student)}
                    >Remove</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────── */}
      {showAdd && (
        <AddStudentModal batchId={batch.id} onClose={() => setShowAdd(false)} />
      )}
      {shiftTarget && (
        <ShiftStudentModal
          student={shiftTarget}
          fromBatchId={batch.id}
          onClose={() => setShiftTarget(null)}
        />
      )}
      {removeTarget && (
        <RemoveConfirmModal
          student={removeTarget}
          onConfirm={handleRemoveConfirm}
          onClose={() => setRemoveTarget(null)}
        />
      )}
    </div>
  );
}
