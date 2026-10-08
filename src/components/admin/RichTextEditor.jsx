import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

/**
 * RichTextEditor
 * 
 * Quill-based WYSIWYG editor tailored for AdminBlogEditorPage.
 * Supports:
 * - Direct pasting from Word, Google Docs, AI generators with full formatting preservation:
 *   Bold, Italics, Underline, Strikethrough, Headings (H2, H3, H4),
 *   Lists (bullet & ordered), Blockquotes, Code blocks, and Tables.
 * - Insertion and preservation of media placeholders ([[image-1]], [[image-2]], [[image-3]], [[video]]).
 * - Dark-mode styled toolbar and editing canvas matching the admin panel.
 */
export const RichTextEditor = forwardRef(function RichTextEditor(
  { value = '', onChange, placeholder = 'Write section body or paste from Word/Docs/AI...' },
  ref
) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const isUpdatingRef = useRef(false);

  // Expose methods to parent via ref (e.g., cursor-aware insertion of tokens or markdown tables)
  useImperativeHandle(ref, () => ({
    insertTextAtCursor: (text) => {
      const quill = quillRef.current;
      if (!quill) return;
      const range = quill.getSelection(true);
      const index = range ? range.index : quill.getLength();
      quill.insertText(index, text, 'user');
      quill.setSelection(index + text.length, 0, 'silent');
      quill.focus();
    },
    formatSelection: (format, val) => {
      const quill = quillRef.current;
      if (!quill) return;
      const range = quill.getSelection(true);
      if (range) {
        if (range.length > 0) {
          const currentFormat = quill.getFormat(range);
          quill.format(format, !currentFormat[format], 'user');
        } else {
          // Wrap or insert placeholder
          const placeholderText = 'bold text';
          quill.insertText(range.index, placeholderText, { [format]: val ?? true }, 'user');
          quill.setSelection(range.index, placeholderText.length, 'silent');
        }
      }
      quill.focus();
    },
    insertTable: (rows = 3, cols = 3) => {
      const quill = quillRef.current;
      if (!quill) return;
      const tableModule = quill.getModule('table');
      if (tableModule) {
        tableModule.insertTable(rows, cols);
      } else {
        // Fallback markdown table text if table module isn't active
        const range = quill.getSelection(true);
        const index = range ? range.index : quill.getLength();
        const mdTable = '\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Row 1 | Data | Data |\n| Row 2 | Data | Data |\n';
        quill.insertText(index, mdTable, 'user');
        quill.setSelection(index + mdTable.length, 0, 'silent');
      }
      quill.focus();
    },
    focus: () => {
      quillRef.current?.focus();
    },
    getQuill: () => quillRef.current
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    // Create an inner wrapper for Quill to attach to
    const editorEl = document.createElement('div');
    containerRef.current.appendChild(editorEl);

    // Quill toolbar configuration
    const toolbarOptions = [
      [{ header: [2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ align: [] }],
      ['link', 'clean']
    ];

    const quill = new Quill(editorEl, {
      theme: 'snow',
      placeholder: placeholder,
      modules: {
        toolbar: toolbarOptions,
        table: true,
        clipboard: {
          matchVisual: false
        }
      }
    });

    quillRef.current = quill;

    // Initialize content
    if (value) {
      if (value.startsWith('<') && value.includes('>')) {
        quill.clipboard.dangerouslyPasteHTML(value, 'silent');
      } else {
        // Plain text or markdown
        quill.setText(value, 'silent');
      }
    }

    // Text-change listener
    quill.on('text-change', (_delta, _oldDelta, source) => {
      if (source === 'silent') return;
      isUpdatingRef.current = true;
      const html = quill.root.innerHTML;
      // If editor is empty (e.g. <p><br></p>), treat as empty string
      const cleanValue = html === '<p><br></p>' || html === '<p></p>' ? '' : html;
      onChange?.(cleanValue);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    });

    return () => {
      quillRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Run once on mount

  // Sync external value updates (e.g. initial load or form resets)
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill || isUpdatingRef.current) return;

    const currentHtml = quill.root.innerHTML;
    const isCurrentlyEmpty = currentHtml === '<p><br></p>' || currentHtml === '<p></p>' || !currentHtml;

    if (!value && isCurrentlyEmpty) return;

    // Check if value is significantly different to prevent cursor jumps
    if (value !== currentHtml && (value !== '' || !isCurrentlyEmpty)) {
      if (value.startsWith('<') && value.includes('>')) {
        const selection = quill.getSelection();
        quill.clipboard.dangerouslyPasteHTML(value, 'silent');
        if (selection) {
          quill.setSelection(selection.index, selection.length, 'silent');
        }
      } else if (!value) {
        quill.setText('', 'silent');
      } else {
        // Plain text or markdown value
        const selection = quill.getSelection();
        quill.setText(value, 'silent');
        if (selection) {
          quill.setSelection(selection.index, selection.length, 'silent');
        }
      }
    }
  }, [value]);

  return (
    <div className="rich-editor-wrapper rounded-xl border border-slate-700 bg-slate-900 overflow-hidden text-slate-100">
      <style>{`
        .rich-editor-wrapper .ql-toolbar.ql-snow {
          background-color: #0f121d;
          border: none;
          border-bottom: 1px solid #1e293b;
          padding: 8px 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 2px;
        }
        .rich-editor-wrapper .ql-toolbar .ql-formats {
          margin-right: 10px;
        }
        .rich-editor-wrapper .ql-snow .ql-stroke {
          stroke: #94a3b8;
        }
        .rich-editor-wrapper .ql-snow .ql-fill {
          fill: #94a3b8;
        }
        .rich-editor-wrapper .ql-snow .ql-picker {
          color: #94a3b8;
          font-size: 11px;
        }
        .rich-editor-wrapper .ql-snow .ql-picker-options {
          background-color: #1e293b;
          border: 1px solid #334155;
          padding: 6px;
          border-radius: 8px;
          color: #f1f5f9;
        }
        .rich-editor-wrapper .ql-snow .ql-picker-item:hover {
          color: #818cf8;
        }
        .rich-editor-wrapper .ql-snow .ql-picker.ql-expanded .ql-picker-label {
          color: #818cf8;
          border-color: #4f46e5;
        }
        .rich-editor-wrapper .ql-snow button:hover .ql-stroke,
        .rich-editor-wrapper .ql-snow button.ql-active .ql-stroke {
          stroke: #818cf8;
        }
        .rich-editor-wrapper .ql-snow button:hover .ql-fill,
        .rich-editor-wrapper .ql-snow button.ql-active .ql-fill {
          fill: #818cf8;
        }
        .rich-editor-wrapper .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 13px;
          min-height: 160px;
          color: #e2e8f0;
          line-height: 1.6;
        }
        .rich-editor-wrapper .ql-editor {
          padding: 12px 14px;
          min-height: 160px;
        }
        .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: #64748b;
          font-style: normal;
        }
        .rich-editor-wrapper .ql-editor h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .rich-editor-wrapper .ql-editor h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .rich-editor-wrapper .ql-editor h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-top: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .rich-editor-wrapper .ql-editor blockquote {
          border-left: 3px solid #6366f1;
          padding-left: 12px;
          color: #cbd5e1;
          font-style: italic;
          margin: 8px 0;
        }
        .rich-editor-wrapper .ql-editor pre {
          background-color: #090b10;
          border-radius: 6px;
          padding: 8px 12px;
          color: #e2e8f0;
          font-size: 12px;
        }
        .rich-editor-wrapper .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 12px 0;
          border: 1px solid #334155;
        }
        .rich-editor-wrapper .ql-editor table td,
        .rich-editor-wrapper .ql-editor table th {
          border: 1px solid #334155;
          padding: 6px 10px;
          font-size: 12px;
        }
        .rich-editor-wrapper .ql-editor table th {
          background-color: #1e293b;
          font-weight: 600;
          color: #f8fafc;
        }
        .rich-editor-wrapper .ql-editor strong {
          color: #ffffff;
          font-weight: 700;
        }
      `}</style>
      <div ref={containerRef} />
    </div>
  );
});
