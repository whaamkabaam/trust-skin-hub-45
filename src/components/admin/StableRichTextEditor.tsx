import React, { useRef, useEffect, useCallback, useMemo, lazy, Suspense, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
    ['blockquote', 'code-block'],
    ['link'],
    ['clean']
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'code-block', 'link'
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountingRef.current = true;
      
      // Clean up Quill instance
      if (quillRef.current) {
        try {
          const editor = quillRef.current.getEditor?.();
          if (editor && typeof editor.disable === 'function') {
            editor.disable();
          }
        } catch (error) {
          // Silent cleanup failure
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
      `}</style>
    </div>
  );
}