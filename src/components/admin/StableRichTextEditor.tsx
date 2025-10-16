import React, { useRef, useEffect, useCallback, useMemo, lazy, Suspense, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Quill from 'quill';
import QuillBetterTable from 'quill-better-table';
import 'quill-better-table/dist/quill-better-table.css';

// Register quill-better-table module
if (typeof window !== 'undefined' && Quill) {
  Quill.register('modules/better-table', QuillBetterTable);
}

// Lazy load ReactQuill to prevent SSR issues and reduce bundle size
const ReactQuill = lazy(() => import('react-quill'));

interface StableRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Error boundary component specifically for ReactQuill
class ReactQuillErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('ReactQuill error:', error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border rounded-md p-3 min-h-[120px] bg-background">
          <textarea
            className="w-full h-full min-h-[100px] bg-transparent border-none resize-none outline-none"
            value={this.props.children as any}
            placeholder="Rich text editor failed to load. Using fallback textarea."
            readOnly
          />
        </div>
      );
    }

    return this.props.children;
  }
}

// Stable modules configuration to prevent recreation
const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean']
  ],
  table: false,
  'better-table': {
    operationMenu: {
      items: {
        unmergeCells: { text: 'Unmerge cells' },
        insertColumnRight: { text: 'Insert column right' },
        insertColumnLeft: { text: 'Insert column left' },
        insertRowUp: { text: 'Insert row above' },
        insertRowDown: { text: 'Insert row below' },
        removeCol: { text: 'Remove column' },
        removeRow: { text: 'Remove row' },
        removeTable: { text: 'Remove table' }
      },
      color: {
        colors: ['#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af'],
        text: 'Background Colors'
      }
    }
  },
  keyboard: {
    bindings: QuillBetterTable.keyboardBindings
  }
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'code-block', 'link', 'align',
  'table', 'table-cell-line', 'table-cell', 'table-row', 'table-body',
  'width', 'colspan', 'rowspan', 'height'
];

export function StableRichTextEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Start typing...', 
  className = '',
  disabled = false
}: StableRichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const isUnmountingRef = useRef(false);
  const [editorError, setEditorError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Memoize the onChange handler to prevent recreating on every render
  const stableOnChange = useCallback((content: string) => {
    if (isUnmountingRef.current || editorError || disabled) return;
    
    try {
      // Validate that content is a string
      if (typeof content === 'string') {
        onChange(content);
      }
    } catch (error) {
      console.error('StableRichTextEditor onChange error:', error);
      setEditorError(true);
    }
  }, [onChange, editorError, disabled]);

  // Handle editor ready state
  const handleEditorReady = useCallback(() => {
    if (!isUnmountingRef.current) {
      setIsReady(true);
    }
  }, []);

  // Handle errors from ReactQuill
  const handleQuillError = useCallback(() => {
    setEditorError(true);
  }, []);

  // Enhanced cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountingRef.current = true;
      
      // More comprehensive cleanup
      if (quillRef.current) {
        try {
          const editor = quillRef.current.getEditor?.();
          
          if (editor) {
            // Remove all event listeners
            if (typeof editor.off === 'function') {
              editor.off();
            }
            
            // Clear selection and disable
            if (typeof editor.setSelection === 'function') {
              editor.setSelection(null);
            }
            
            if (typeof editor.disable === 'function') {
              editor.disable();
            }
            
            // Clear contents if possible
            if (typeof editor.setText === 'function') {
              editor.setText('');
            }
          }
        } catch (error) {
          // Silent cleanup failure - component is unmounting anyway
        } finally {
          // Always clear the reference
          quillRef.current = null;
        }
      }
      
      setIsReady(false);
    };
  }, []);

  // Loading fallback
  const LoadingFallback = useMemo(() => (
    <div className={`rich-text-editor-loading ${className}`}>
      <div className="border rounded-md p-3">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  ), [className]);

  // Error fallback - simple textarea
  if (editorError) {
    return (
      <div className={`rich-text-fallback ${className}`}>
        <textarea
          className="w-full min-h-[120px] p-3 border rounded-md bg-background text-foreground resize-vertical"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Rich text editor encountered an error. Using fallback editor.
        </p>
      </div>
    );
  }

  return (
    <div className={`stable-rich-text-editor ${className}`}>
      <ReactQuillErrorBoundary onError={handleQuillError}>
        <Suspense fallback={LoadingFallback}>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={value || ''}
              onChange={stableOnChange}
              modules={QUILL_MODULES}
              formats={QUILL_FORMATS}
              placeholder={placeholder}
              readOnly={disabled}
              style={{
                '--quill-border-color': 'hsl(var(--border))',
                '--quill-toolbar-border-color': 'hsl(var(--border))',
              } as React.CSSProperties}
            />
        </Suspense>
      </ReactQuillErrorBoundary>
      
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
        
        /* Table styling */
        .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        .ql-editor table td,
        .ql-editor table th {
          border: 1px solid hsl(var(--border));
          padding: 8px 12px;
          min-width: 50px;
        }
        .ql-editor table th {
          background: hsl(var(--muted));
          font-weight: 600;
        }
        .ql-better-table-wrapper {
          overflow-x: auto;
        }
        
        /* Table operation menu */
        .qlbt-operation-menu {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 100;
        }
        .qlbt-operation-menu-item {
          color: hsl(var(--foreground));
          padding: 8px 12px;
        }
        .qlbt-operation-menu-item:hover {
          background: hsl(var(--accent));
        }
      `}</style>
    </div>
  );
}