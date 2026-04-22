// ============================================================
// COMMUNICATION PAGE — Chat with students + announcements
// ============================================================

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_STUDENTS } from '../../../data/mockData';

const INITIAL_MESSAGES = {
  's1': [
    { id: 1, from: 's1',    text: 'Hi! I have a question about the Redux assignment.', time: '10:02 AM' },
    { id: 2, from: 'mentor', text: "Sure, what's the issue?", time: '10:05 AM' },
    { id: 3, from: 's1',    text: "I'm confused about the middleware setup.", time: '10:06 AM' },
    { id: 4, from: 'mentor', text: "Let's cover that in the next session. Meanwhile check the Redux docs on middleware.", time: '10:08 AM' },
  ],
  's2': [
    { id: 1, from: 's2',    text: "Can we reschedule tomorrow's session?", time: '9:30 AM' },
    { id: 2, from: 'mentor', text: 'Yes, what time works for you?', time: '9:45 AM' },
  ],
  's3': [
    { id: 1, from: 's3',    text: 'I submitted the REST API assignment!', time: 'Yesterday' },
    { id: 2, from: 'mentor', text: "Great! I'll review it and send feedback.", time: 'Yesterday' },
  ],
};

const sendIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;

export default function CommunicationPage() {
  const { user } = useAuth();
  const myStudents = MOCK_STUDENTS.filter((s) => s.mentorId === user?.id);

  const [activeStudent, setActiveStudent] = useState(myStudents[0] || null);
  const [messages, setMessages]           = useState(INITIAL_MESSAGES);
  const [input, setInput]                 = useState('');
  const [tab, setTab]                     = useState('chat');
  const [announcement, setAnnouncement]   = useState('');
  const [announcements, setAnnouncements] = useState([
    { id: 1, text: 'Session rescheduled to Friday 3 PM for FSB-2024-01', time: '2 days ago', author: 'Arjun Sharma' },
    { id: 2, text: 'Please complete the Redux assignment before the next session', time: '4 days ago', author: 'Arjun Sharma' },
  ]);

  const currentMsgs = (activeStudent && messages[activeStudent.id]) || [];

  const sendMessage = () => {
    if (!input.trim() || !activeStudent) return;
    const newMsg = {
      id: Date.now(), from: 'mentor', text: input.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => ({ ...prev, [activeStudent.id]: [...(prev[activeStudent.id] || []), newMsg] }));
    setInput('');
  };

  const postAnnouncement = () => {
    if (!announcement.trim()) return;
    setAnnouncements((p) => [{ id: Date.now(), text: announcement.trim(), time: 'Just now', author: user?.name }, ...p]);
    setAnnouncement('');
  };

  return (
    <div className="p-6 flex flex-col gap-4 fade-in">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Communication</h2>
        <p className="text-sm text-gray-500 mt-0.5">Chat with students and post announcements</p>
      </div>

      {/* Tab toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {[{ key: 'chat', label: '💬 Chat' }, { key: 'announcements', label: '📢 Announcements' }].map((t) => (
          <button
            key={t.key}
            className={`px-5 py-2 rounded-[10px] text-[13px] transition-all ${tab === t.key ? 'bg-white text-mentor-primary font-bold shadow-sm' : 'text-gray-500 font-medium'}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'chat' ? (
        <div className="flex bg-white rounded-2xl border border-gray-200 overflow-hidden min-h-[500px]">
          {/* Student list */}
          <div className="w-[220px] border-r border-gray-100 overflow-y-auto shrink-0">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.5px] px-3.5 pt-3.5 pb-2">Students</p>
            {myStudents.map((s) => (
              <button
                key={s.id}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-colors ${activeStudent?.id === s.id ? 'bg-mentor-lighter' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveStudent(s)}
              >
                <div
                  className="w-[34px] h-[34px] rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${s.id.charCodeAt(1) * 25}, 60%, 50%)` }}
                >
                  {s.avatar}
                </div>
                <div className="text-left flex-1 overflow-hidden">
                  <p className="text-[13px] font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">{s.name}</p>
                  <p className="text-[11px] text-gray-400">
                    {messages[s.id]?.slice(-1)[0]?.text?.slice(0, 28) || 'No messages yet'}...
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Chat window */}
          <div className="flex-1 flex flex-col">
            {activeStudent ? (
              <>
                <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
                  <div
                    className="w-[34px] h-[34px] rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0"
                    style={{ background: `hsl(${activeStudent.id.charCodeAt(1) * 25}, 60%, 50%)` }}
                  >
                    {activeStudent.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{activeStudent.name}</p>
                    <p className="text-[11px] text-green-500">● Online</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {currentMsgs.map((msg) => {
                    const isMe = msg.from === 'mentor';
                    return (
                      <div key={msg.id} className={`flex mb-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-[70%]">
                          <div
                            className="px-3.5 py-2 rounded-[14px] text-[13px] leading-relaxed"
                            style={{
                              background: isMe ? '#0d9488' : '#f3f4f6',
                              color: isMe ? '#fff' : '#374151',
                              borderBottomRightRadius: isMe ? 4 : 14,
                              borderBottomLeftRadius: isMe ? 14 : 4,
                            }}
                          >
                            {msg.text}
                          </div>
                          <p className={`text-[10px] text-gray-400 mt-0.5 ${isMe ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
                  <input
                    className="flex-1 px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-gray-200 text-[13px] outline-none"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    className="w-10 h-10 rounded-[10px] bg-mentor-primary text-white flex items-center justify-center shrink-0"
                    onClick={sendMessage}
                  >
                    {sendIcon}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">Select a student to start chatting</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          <div className="bg-white rounded-[14px] p-5 border border-gray-200">
            <p className="text-sm font-bold text-gray-900 mb-2.5">Post Announcement</p>
            <textarea
              className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-gray-200 text-[13px] resize-y outline-none mb-2.5"
              rows={3}
              placeholder="Write an announcement for all your students..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
            <button className="px-5 py-2 rounded-[10px] bg-mentor-primary text-white font-semibold text-[13px]" onClick={postAnnouncement}>
              Post Announcement
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white rounded-xl px-5 py-3.5 border border-gray-200 flex gap-3 items-start">
                <span className="text-xl">📢</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-1">by {a.author} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
