// ============================================================
// ADD STUDENT PAGE (Operations) — Create student + assign batch
// Form-based workflow with mentor + batch assignment
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MENTORS, MOCK_BATCHES } from '../../../data/mockData';

const backIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;

const inputClass = 'w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-gray-200 text-[13px] text-gray-900 outline-none bg-white focus:border-ops-primary transition-colors';

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-gray-700">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export default function AddStudentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', course: '', mentorId: '', batchId: '',
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors]   = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const availableBatches = MOCK_BATCHES.filter((b) => !form.mentorId || b.mentorId === form.mentorId);

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name     = 'Name is required';
    if (!form.email.trim())  e.email    = 'Email is required';
    if (!form.course.trim()) e.course   = 'Course is required';
    if (!form.mentorId)      e.mentorId = 'Please select a mentor';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSuccess(true);
    setTimeout(() => navigate('/operations/students'), 2000);
  };

  if (success) {
    return (
      <div className="p-16 flex flex-col items-center gap-4 text-center">
        <div className="text-[64px]">🎉</div>
        <h2 className="text-[22px] font-extrabold text-gray-900">Student Added Successfully!</h2>
        <p className="text-gray-500">Redirecting you back to the students list...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-4 fade-in">
      <button className="flex items-center gap-1.5 text-ops-primary font-semibold text-sm" onClick={() => navigate('/operations/students')}>
        {backIcon} Back to Students
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-w-[760px]">
        <div className="px-7 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-gray-900">Add New Student</h2>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to create a student account and assign them to a batch.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-6">
          {/* Personal Information */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-[13px] font-bold text-ops-primary uppercase tracking-[0.5px]">Personal Information</h3>
            <div className="grid grid-cols-2 gap-3.5">
              <Field label="Full Name *" error={errors.name}>
                <input className={inputClass} type="text" placeholder="e.g. Riya Kapoor" value={form.name} onChange={(e) => set('name', e.target.value)} />
              </Field>
              <Field label="Email Address *" error={errors.email}>
                <input className={inputClass} type="email" placeholder="student@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
              </Field>
              <Field label="Phone Number" error={errors.phone}>
                <input className={inputClass} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </Field>
              <Field label="Course *" error={errors.course}>
                <select className={inputClass} value={form.course} onChange={(e) => set('course', e.target.value)}>
                  <option value="">Select course...</option>
                  {['Full Stack Development', 'Data Science', 'UI/UX Design', 'DevOps', 'Mobile Development'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Enrollment Details */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-[13px] font-bold text-ops-primary uppercase tracking-[0.5px]">Enrollment Details</h3>
            <div className="grid grid-cols-2 gap-3.5">
              <Field label="Assign Mentor *" error={errors.mentorId}>
                <select className={inputClass} value={form.mentorId} onChange={(e) => { set('mentorId', e.target.value); set('batchId', ''); }}>
                  <option value="">Select mentor...</option>
                  {MOCK_MENTORS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.specialization})</option>
                  ))}
                </select>
              </Field>
              <Field label="Assign to Batch" error={errors.batchId}>
                <select className={inputClass} value={form.batchId} onChange={(e) => set('batchId', e.target.value)} disabled={!form.mentorId}>
                  <option value="">Select batch...</option>
                  {availableBatches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.course})</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Mentor preview */}
          {form.mentorId && (() => {
            const m = MOCK_MENTORS.find((x) => x.id === form.mentorId);
            return m ? (
              <div className="flex items-center gap-3 px-4 py-3.5 bg-ops-lighter rounded-xl border border-ops-light">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ops-primary to-purple-400 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {m.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.specialization} · ⭐ {m.rating} · {m.students.length} students</p>
                </div>
              </div>
            ) : null;
          })()}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm" onClick={() => navigate('/operations/students')}>
              Cancel
            </button>
            <button type="submit" className="px-7 py-2.5 rounded-xl bg-ops-primary text-white font-bold text-sm shadow-[0_4px_14px_rgba(124,58,237,0.35)]">
              Create Student Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
