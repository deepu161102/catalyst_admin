// ============================================================
// RICH TEXT EDITOR
// Lightweight WYSIWYG via contentEditable + execCommand.
// - Only sets innerHTML on mount to avoid cursor-reset.
// - Strips HTML on paste to keep clean text flow.
// ============================================================

import { useRef, useEffect, useCallback } from 'react';

const INLINE_TOOLS = [
  { cmd: 'bold',          icon: 'B',   label: 'Bold',          wrapStyle: { fontWeight: 700 } },
  { cmd: 'italic',        icon: 'I',   label: 'Italic',        wrapStyle: { fontStyle: 'italic' } },
  { cmd: 'underline',     icon: 'U',   label: 'Underline',     wrapStyle: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough', icon: 'S̶',  label: 'Strikethrough', wrapStyle: { textDecoration: 'line-through' } },
  null,
  { cmd: 'insertUnorderedList', icon: '• ≡', label: 'Bullet list' },
  { cmd: 'insertOrderedList',   icon: '1 ≡', label: 'Numbered list' },
];

const FONT_SIZES = [
  { val: '1', label: '10' },
  { val: '2', label: '13' },
  { val: '3', label: '16' },
  { val: '4', label: '18' },
  { val: '5', label: '24' },
  { val: '6', label: '32' },
  { val: '7', label: '48' },
];

const TEXT_COLORS = [
  '#111827', '#dc2626', '#d97706', '#16a34a',
  '#2563eb', '#7c3aed', '#db2777', '#0891b2', '#6b7280',
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Type here…',
  minHeight = 100,
}) {
  const editorRef = useRef(null);
  const initialised = useRef(false);

  // Set content once on mount — avoids cursor jumping on re-renders
  useEffect(() => {
    if (!initialised.current && editorRef.current) {
      editorRef.current.innerHTML = value || '';
      initialised.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fireChange = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const exec = useCallback(
    (cmd, val = null) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, val);
      fireChange();
    },
    [fireChange],
  );

  // Strip HTML on paste — keeps plain text only
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    fireChange();
  };

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.gif';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => exec('insertImage', ev.target.result);
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const insertLink = () => {
    const url = prompt('Enter URL (include https://):');
    if (url) exec('createLink', url);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        {INLINE_TOOLS.map((tool, i) => {
          if (tool === null) {
            return <span key={`div-${i}`} className="w-px h-4 bg-gray-300 mx-1 shrink-0" />;
          }
          return (
            <button
              key={tool.cmd}
              type="button"
              title={tool.label}
              style={tool.wrapStyle}
              className="w-7 h-7 rounded-md text-[11px] text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-colors select-none"
              onMouseDown={(e) => {
                e.preventDefault();
                exec(tool.cmd);
              }}
            >
              {tool.icon}
            </button>
          );
        })}

        <span className="w-px h-4 bg-gray-300 mx-1 shrink-0" />

        {/* Font size dropdown */}
        <select
          className="text-[11px] border border-gray-200 rounded-md px-1.5 py-0.5 bg-white text-gray-600 cursor-pointer outline-none"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              exec('fontSize', e.target.value);
              e.target.value = '';
            }
          }}
        >
          <option value="" disabled>
            Size
          </option>
          {FONT_SIZES.map(({ val, label }) => (
            <option key={val} value={val}>
              {label}px
            </option>
          ))}
        </select>

        <span className="w-px h-4 bg-gray-300 mx-1 shrink-0" />

        {/* Color swatches */}
        {TEXT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            className="w-4 h-4 rounded-full ring-1 ring-white hover:ring-2 hover:ring-offset-1 transition-all shrink-0"
            style={{ background: color }}
            onMouseDown={(e) => {
              e.preventDefault();
              exec('foreColor', color);
            }}
          />
        ))}

        <span className="w-px h-4 bg-gray-300 mx-1 shrink-0" />

        {/* Image & Link */}
        <button
          type="button"
          title="Insert Image / GIF"
          className="w-7 h-7 rounded-md text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-sm transition-colors"
          onMouseDown={(e) => {
            e.preventDefault();
            insertImage();
          }}
        >
          🖼
        </button>
        <button
          type="button"
          title="Insert Link"
          className="w-7 h-7 rounded-md text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-sm transition-colors"
          onMouseDown={(e) => {
            e.preventDefault();
            insertLink();
          }}
        >
          🔗
        </button>
      </div>

      {/* ── Editable area ── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="px-4 py-3 text-[13px] text-gray-800 leading-relaxed outline-none"
        style={{ minHeight }}
        onInput={fireChange}
        onPaste={handlePaste}
        data-placeholder={placeholder}
      />

      <style>{`
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
        [contenteditable] img {
          max-width: 100%;
          max-height: 280px;
          border-radius: 8px;
          margin: 4px 0;
          display: inline-block;
        }
        [contenteditable] a {
          color: #4f46e5;
          text-decoration: underline;
        }
        [contenteditable] ul { list-style: disc; padding-left: 1.5em; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.5em; }
      `}</style>
    </div>
  );
}
