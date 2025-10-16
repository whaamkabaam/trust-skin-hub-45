import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import QuillBetterTable from 'quill-better-table';
import 'quill-better-table/dist/quill-better-table.css';
import { TableInsertButton } from './TableInsertButton';

// Register table module with Quill
if (typeof window !== 'undefined') {
  Quill.register('modules/better-table', QuillBetterTable);
}

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
  'better-table': {
    operationMenu: {
      items: {
        unmergeCells: {
          text: 'Unmerge cells'
        },
        insertColumnRight: {
          text: 'Insert column right'
        },
        insertColumnLeft: {
          text: 'Insert column left'
        },
        insertRowUp: {
          text: 'Insert row above'
        },
        insertRowDown: {
          text: 'Insert row below'
        },
        removeCol: {
          text: 'Remove column'
        },
        removeRow: {
          text: 'Remove row'
        },
        removeTable: {
          text: 'Remove table'
        }
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
  'table', 'table-cell-line'
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

  // Handle table insertion with better-table module
  const handleInsertTable = useCallback(() => {
    if (!quillRef.current || editorError || disabled) return;

    try {
      const editor = quillRef.current.getEditor();
      if (!editor) return;

      const tableModule = editor.getModule('better-table');
      if (tableModule) {
        // Insert a 3x3 table using the better-table module
        tableModule.insertTable(3, 3);
      } else {
        console.warn('better-table module not found, falling back to HTML insertion');
        // Fallback to HTML insertion if module not available
        const range = editor.getSelection(true);
        const tableHTML = `
          <table>
            <thead>
              <tr>
                <th>Header 1</th>
                <th>Header 2</th>
                <th>Header 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><br></td>
                <td><br></td>
                <td><br></td>
              </tr>
              <tr>
                <td><br></td>
                <td><br></td>
                <td><br></td>
              </tr>
            </tbody>
          </table>
          <p><br></p>
        `;
        editor.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
      }
    } catch (error) {
      console.error('Error inserting table:', error);
    }
  }, [editorError, disabled]);

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

  // Don't show table button if disabled or in error state
  const showTableButton = !disabled && !editorError;

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
      {showTableButton && (
        <TableInsertButton onInsertTable={handleInsertTable} />
      )}
      
      <ReactQuillErrorBoundary onError={handleQuillError}>
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
          border: 1px solid hsl(var(--border));
        }
        .ql-editor table td,
        .ql-editor table th {
          border: 1px solid hsl(var(--border));
          padding: 8px 12px;
          min-width: 80px;
        }
        .ql-editor table th {
          background: hsl(var(--muted));
          font-weight: 600;
          text-align: left;
        }
        .ql-editor table tbody tr:hover {
          background: hsl(var(--muted) / 0.3);
        }
      `}</style>
    </div>
  );
}