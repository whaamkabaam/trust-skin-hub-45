import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'code-block', 'link'
];

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Start typing...', 
  className = '' 
}: RichTextEditorProps) {
  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          '--quill-border-color': 'hsl(var(--border))',
          '--quill-toolbar-border-color': 'hsl(var(--border))',
        } as React.CSSProperties}
      />
      <style>{`
        .ql-toolbar {
          border-color: hsl(var(--border)) !important;
          background: hsl(var(--background));
        }
        .ql-container {
          border-color: hsl(var(--border)) !important;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        .ql-editor {
          color: hsl(var(--foreground));
        }
        .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
        }
        .ql-snow .ql-picker {
          color: hsl(var(--foreground));
        }
        .ql-snow .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        .ql-snow .ql-fill {
          fill: hsl(var(--foreground));
        }
        .ql-snow .ql-tooltip {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
        }
      `}</style>
    </div>
  );
}