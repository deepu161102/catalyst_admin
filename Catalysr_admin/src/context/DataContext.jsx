// ============================================================
// DATA CONTEXT — In-memory state for mutable entities
// Mentors list and notifications are managed here so state
// is shared between layout dropdowns and full pages.
// ============================================================

import { createContext, useContext, useState } from 'react';
import { MOCK_MENTORS, MOCK_NOTIFICATIONS, MOCK_OPS_NOTIFICATIONS } from '../data/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [mentors, setMentors] = useState(MOCK_MENTORS);

  // ── Mentor notifications ──────────────────────────────────
  const [mentorNotifications, setMentorNotifications] = useState(MOCK_NOTIFICATIONS);

  const markMentorNotifRead = (id) =>
    setMentorNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));

  const markAllMentorNotifsRead = () =>
    setMentorNotifications(p => p.map(n => ({ ...n, read: true })));

  const deleteMentorNotif = (id) =>
    setMentorNotifications(p => p.filter(n => n.id !== id));

  // ── Operations notifications ──────────────────────────────
  const [opsNotifications, setOpsNotifications] = useState(MOCK_OPS_NOTIFICATIONS);

  const markOpsNotifRead = (id) =>
    setOpsNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));

  const markAllOpsNotifsRead = () =>
    setOpsNotifications(p => p.map(n => ({ ...n, read: true })));

  const deleteOpsNotif = (id) =>
    setOpsNotifications(p => p.filter(n => n.id !== id));

  // ── Mentors ───────────────────────────────────────────────
  const addMentor = (mentor) => setMentors((prev) => [...prev, mentor]);

  return (
    <DataContext.Provider value={{
      mentors, addMentor,
      mentorNotifications, markMentorNotifRead, markAllMentorNotifsRead, deleteMentorNotif,
      opsNotifications,    markOpsNotifRead,    markAllOpsNotifsRead,    deleteOpsNotif,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
