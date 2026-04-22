// ============================================================
// MOCK DATA — Simulates backend responses for all entities
// In production, replace with real API calls
// ============================================================

export const MOCK_USERS = [
  {
    id: 'mentor-1',
    name: 'Arjun Sharma',
    email: 'mentor@catalyst.com',
    password: 'password',
    role: 'mentor',
    avatar: 'AS',
    specialization: 'Full Stack Development',
    rating: 4.8,
    joinedDate: '2024-01-15',
  },
  {
    id: 'ops-1',
    name: 'Priya Menon',
    email: 'ops@catalyst.com',
    password: 'password',
    role: 'operations',
    avatar: 'PM',
  },
];

// ── Students ─────────────────────────────────────────────────
export const MOCK_STUDENTS = [
  { id: 's1', name: 'Riya Kapoor', email: 'riya@example.com', phone: '+91 98765 43210', course: 'Full Stack Development', batch: 'FSB-2024-01', mentorId: 'mentor-1', progress: 72, joinedDate: '2024-02-10', status: 'active', avatar: 'RK', notes: ['Great progress on React fundamentals', 'Needs to focus on Node.js'], lastSession: '2025-04-02' },
  { id: 's2', name: 'Karan Singh', email: 'karan@example.com', phone: '+91 87654 32109', course: 'Full Stack Development', batch: 'FSB-2024-01', mentorId: 'mentor-1', progress: 58, joinedDate: '2024-02-10', status: 'active', avatar: 'KS', notes: ['Struggling with async JavaScript', 'Good understanding of HTML/CSS'], lastSession: '2025-04-01' },
  { id: 's3', name: 'Sneha Patel', email: 'sneha@example.com', phone: '+91 76543 21098', course: 'Full Stack Development', batch: 'FSB-2024-02', mentorId: 'mentor-1', progress: 91, joinedDate: '2024-03-15', status: 'active', avatar: 'SP', notes: ['Exceptional learner', 'Ready for advanced topics'], lastSession: '2025-04-03' },
  { id: 's4', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 65432 10987', course: 'Data Science', batch: 'DSB-2024-01', mentorId: 'mentor-1', progress: 45, joinedDate: '2024-04-01', status: 'inactive', avatar: 'AK', notes: ['Missed last 3 sessions', 'Follow up required'], lastSession: '2025-03-15' },
  { id: 's5', name: 'Pooja Nair', email: 'pooja@example.com', phone: '+91 54321 09876', course: 'Full Stack Development', batch: 'FSB-2024-02', mentorId: 'mentor-1', progress: 83, joinedDate: '2024-03-15', status: 'active', avatar: 'PN', notes: ['Strong in backend development'], lastSession: '2025-04-04' },
  { id: 's6', name: 'Dev Mehta', email: 'dev@example.com', phone: '+91 43210 98765', course: 'Data Science', batch: 'DSB-2024-01', mentorId: 'mentor-2', progress: 67, joinedDate: '2024-04-01', status: 'active', avatar: 'DM', notes: [], lastSession: '2025-04-02' },
  { id: 's7', name: 'Ananya Roy', email: 'ananya@example.com', phone: '+91 32109 87654', course: 'UI/UX Design', batch: 'UXB-2024-01', mentorId: 'mentor-2', progress: 78, joinedDate: '2024-05-01', status: 'active', avatar: 'AR', notes: [], lastSession: '2025-04-01' },
];

// ── Mentors (for operations view) ───────────────────────────
export const MOCK_MENTORS = [
  { id: 'mentor-1', name: 'Arjun Sharma', email: 'arjun@catalyst.com', phone: '+91 98765 00001', specialization: 'Full Stack Development', rating: 4.8, students: ['s1', 's2', 's3', 's4', 's5'], joinedDate: '2024-01-15', status: 'active', avatar: 'AS', sessionsCompleted: 48 },
  { id: 'mentor-2', name: 'Divya Krishnan', email: 'divya@catalyst.com', phone: '+91 98765 00002', specialization: 'Data Science & ML', rating: 4.9, students: ['s6', 's7'], joinedDate: '2024-02-01', status: 'active', avatar: 'DK', sessionsCompleted: 35 },
  { id: 'mentor-3', name: 'Rohan Verma', email: 'rohan@catalyst.com', phone: '+91 98765 00003', specialization: 'UI/UX Design', rating: 4.6, students: [], joinedDate: '2024-03-10', status: 'active', avatar: 'RV', sessionsCompleted: 22 },
];

// ── Batches ──────────────────────────────────────────────────
export const MOCK_BATCHES = [
  { id: 'FSB-2024-01', name: 'Full Stack Batch 01', course: 'Full Stack Development', mentorId: 'mentor-1', studentIds: ['s1', 's2'], startDate: '2024-02-10', endDate: '2024-08-10', status: 'active', totalSessions: 60, completedSessions: 48 },
  { id: 'FSB-2024-02', name: 'Full Stack Batch 02', course: 'Full Stack Development', mentorId: 'mentor-1', studentIds: ['s3', 's5'], startDate: '2024-03-15', endDate: '2024-09-15', status: 'active', totalSessions: 60, completedSessions: 38 },
  { id: 'DSB-2024-01', name: 'Data Science Batch 01', course: 'Data Science', mentorId: 'mentor-1', studentIds: ['s4'], startDate: '2024-04-01', endDate: '2024-10-01', status: 'active', totalSessions: 50, completedSessions: 22 },
  { id: 'UXB-2024-01', name: 'UI/UX Batch 01', course: 'UI/UX Design', mentorId: 'mentor-2', studentIds: ['s6', 's7'], startDate: '2024-05-01', endDate: '2024-11-01', status: 'active', totalSessions: 40, completedSessions: 18 },
];

// ── Slots ────────────────────────────────────────────────────
export const MOCK_SLOTS = [
  { id: 'slot-1', mentorId: 'mentor-1', studentId: 's1', studentName: 'Riya Kapoor', date: '2025-04-10', time: '10:00', duration: 60, type: 'one-on-one', status: 'booked', topic: 'React Advanced Hooks' },
  { id: 'slot-2', mentorId: 'mentor-1', studentId: 's2', studentName: 'Karan Singh', date: '2025-04-10', time: '11:30', duration: 60, type: 'one-on-one', status: 'booked', topic: 'Async JS & Promises' },
  { id: 'slot-3', mentorId: 'mentor-1', studentId: null, studentName: null, date: '2025-04-11', time: '09:00', duration: 60, type: 'open', status: 'available', topic: '' },
  { id: 'slot-4', mentorId: 'mentor-1', studentId: 's3', studentName: 'Sneha Patel', date: '2025-04-11', time: '14:00', duration: 90, type: 'one-on-one', status: 'booked', topic: 'System Design Basics' },
  { id: 'slot-5', mentorId: 'mentor-1', studentId: null, studentName: null, date: '2025-04-12', time: '10:00', duration: 60, type: 'open', status: 'available', topic: '' },
  { id: 'slot-6', mentorId: 'mentor-1', studentId: 's5', studentName: 'Pooja Nair', date: '2025-04-14', time: '15:00', duration: 60, type: 'one-on-one', status: 'booked', topic: 'REST API Design' },
  { id: 'slot-7', mentorId: 'mentor-1', studentId: null, studentName: null, date: '2025-04-15', time: '11:00', duration: 60, type: 'open', status: 'available', topic: '' },
  { id: 'slot-8', mentorId: 'mentor-1', studentId: 's1', studentName: 'Riya Kapoor', date: '2025-04-03', time: '10:00', duration: 60, type: 'one-on-one', status: 'completed', topic: 'Redux State Management' },
];

// ── Sessions ─────────────────────────────────────────────────
export const MOCK_SESSIONS = [
  { id: 'sess-1', mentorId: 'mentor-1', studentId: 's1', studentName: 'Riya Kapoor', date: '2025-04-10', time: '10:00', duration: 60, topic: 'React Advanced Hooks', meetLink: 'https://meet.google.com/abc-def-ghi', status: 'upcoming' },
  { id: 'sess-2', mentorId: 'mentor-1', studentId: 's2', studentName: 'Karan Singh', date: '2025-04-10', time: '11:30', duration: 60, topic: 'Async JS & Promises', meetLink: 'https://meet.google.com/jkl-mno-pqr', status: 'upcoming' },
  { id: 'sess-3', mentorId: 'mentor-1', studentId: 's3', studentName: 'Sneha Patel', date: '2025-04-11', time: '14:00', duration: 90, topic: 'System Design Basics', meetLink: 'https://meet.google.com/stu-vwx-yz1', status: 'upcoming' },
  { id: 'sess-4', mentorId: 'mentor-1', studentId: 's1', studentName: 'Riya Kapoor', date: '2025-04-03', time: '10:00', duration: 60, topic: 'Redux State Management', meetLink: '', status: 'completed', recording: 'https://drive.google.com/file/d/abc' },
  { id: 'sess-5', mentorId: 'mentor-1', studentId: 's2', studentName: 'Karan Singh', date: '2025-04-02', time: '11:30', duration: 60, topic: 'Closures & Scope', meetLink: '', status: 'completed' },
  { id: 'sess-6', mentorId: 'mentor-1', studentId: 's5', studentName: 'Pooja Nair', date: '2025-04-04', time: '15:00', duration: 60, topic: 'Node.js Middleware', meetLink: '', status: 'completed' },
  { id: 'sess-7', mentorId: 'mentor-1', studentId: 's3', studentName: 'Sneha Patel', date: '2025-04-01', time: '14:00', duration: 60, topic: 'TypeScript Generics', meetLink: '', status: 'completed' },
  { id: 'sess-8', mentorId: 'mentor-1', studentId: 's4', studentName: 'Amit Kumar', date: '2025-03-15', time: '16:00', duration: 60, topic: 'Python Basics', meetLink: '', status: 'completed' },
];

// ── Assignments ──────────────────────────────────────────────
export const MOCK_ASSIGNMENTS = [
  { id: 'asgn-1', mentorId: 'mentor-1', studentId: 's1', studentName: 'Riya Kapoor', title: 'Build a Todo App with Redux', description: 'Create a full CRUD todo application using React and Redux Toolkit. Include local persistence.', dueDate: '2025-04-12', assignedDate: '2025-04-05', status: 'submitted', submission: 'https://github.com/riya/todo-redux', feedback: '', grade: null },
  { id: 'asgn-2', mentorId: 'mentor-1', studentId: 's2', studentName: 'Karan Singh', title: 'Async Data Fetching Exercise', description: 'Implement a weather app that fetches data from a public API using async/await and handles loading/error states.', dueDate: '2025-04-13', assignedDate: '2025-04-06', status: 'pending', submission: null, feedback: '', grade: null },
  { id: 'asgn-3', mentorId: 'mentor-1', studentId: 's3', studentName: 'Sneha Patel', title: 'Design a REST API', description: 'Design and document a RESTful API for an e-commerce platform. Include endpoint definitions, request/response schemas.', dueDate: '2025-04-15', assignedDate: '2025-04-07', status: 'submitted', submission: 'https://github.com/sneha/ecom-api', feedback: 'Excellent work! Very thorough documentation.', grade: 'A' },
  { id: 'asgn-4', mentorId: 'mentor-1', studentId: 's5', studentName: 'Pooja Nair', title: 'Node.js Authentication Module', description: 'Build a JWT-based authentication system with refresh tokens.', dueDate: '2025-04-10', assignedDate: '2025-04-03', status: 'overdue', submission: null, feedback: '', grade: null },
];

// ── Notifications (Mentor) ───────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: 'notif-1', type: 'slot_booked',          message: 'Riya Kapoor booked a slot for April 10 at 10:00 AM', time: '2 hours ago',    read: false },
  { id: 'notif-2', type: 'session_reminder',     message: 'Upcoming session with Karan Singh in 1 hour',        time: '30 minutes ago', read: false },
  { id: 'notif-3', type: 'assignment_submitted', message: 'Sneha Patel submitted "Design a REST API" assignment', time: '1 day ago',   read: true  },
  { id: 'notif-4', type: 'student_activity',     message: 'Amit Kumar has not logged in for 7 days',            time: '2 days ago',    read: true  },
  { id: 'notif-5', type: 'slot_booked',          message: 'Pooja Nair booked a slot for April 14 at 3:00 PM',  time: '3 days ago',    read: true  },
];

// ── Notifications (Operations) ───────────────────────────────
export const MOCK_OPS_NOTIFICATIONS = [
  { id: 'ops-notif-1', type: 'mentor_added',     message: 'New mentor Rohan Verma has been successfully onboarded', time: '1 hour ago',   read: false },
  { id: 'ops-notif-2', type: 'student_enrolled', message: 'Riya Kapoor enrolled in Full Stack Batch 01',             time: '3 hours ago',  read: false },
  { id: 'ops-notif-3', type: 'batch_ending',     message: 'Full Stack Batch 01 ends in 2 weeks — review required',  time: '5 hours ago',  read: false },
  { id: 'ops-notif-4', type: 'batch_started',    message: 'UI/UX Batch 01 has officially started today',            time: '1 day ago',    read: true  },
  { id: 'ops-notif-5', type: 'mentor_rating',    message: 'Divya Krishnan received a 5-star rating from a student', time: '2 days ago',   read: true  },
  { id: 'ops-notif-6', type: 'student_enrolled', message: 'Amit Kumar enrolled in Data Science Batch 01',           time: '4 days ago',   read: true  },
  { id: 'ops-notif-7', type: 'mentor_inactive',  message: 'Mentor Rohan Verma has no sessions scheduled this week', time: '5 days ago',   read: true  },
];

// ── Analytics ────────────────────────────────────────────────
export const MOCK_ANALYTICS = {
  weeklySessionData: [
    { week: 'Week 1', sessions: 4, completed: 4 },
    { week: 'Week 2', sessions: 6, completed: 5 },
    { week: 'Week 3', sessions: 5, completed: 5 },
    { week: 'Week 4', sessions: 7, completed: 6 },
  ],
  studentProgressData: [
    { name: 'Riya Kapoor', progress: 72 },
    { name: 'Karan Singh', progress: 58 },
    { name: 'Sneha Patel', progress: 91 },
    { name: 'Amit Kumar', progress: 45 },
    { name: 'Pooja Nair', progress: 83 },
  ],
  engagementData: [
    { month: 'Jan', engagement: 65 },
    { month: 'Feb', engagement: 72 },
    { month: 'Mar', engagement: 68 },
    { month: 'Apr', engagement: 80 },
  ],
};
