import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  timeRemaining: number; // seconds
}

interface FileUploadState {
  file: File;
  status: 'uploading' | 'completed' | 'error' | 'paused';
  progress: UploadProgress;
  url?: string;
  error?: string;
  controller?: AbortController;
}

interface EnhancedFileUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  accept?: string;
  maxSize?: number;
  label: string;
  className?: string;
  multiple?: boolean;
}

export function EnhancedFileUpload({ 
  onUpload, 
  currentUrl, 
  accept = 'image/*', 
  maxSize = 5 * 1024 * 1024,
  label,
  className = '',
  multiple = false
}: EnhancedFileUploadProps) {
  const [uploads, setUploads] = useState<Map<string, FileUploadState>>(new Map());
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const uploadStartTime = useRef<number>(0);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number) => {
    if (seconds === Infinity || isNaN(seconds)) return '∞';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const uploadFile = async (file: File) => {
    const fileId = `${Date.now()}_${file.name}`;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Initialize upload state
    setUploads(prev => new Map(prev).set(fileId, {
      file,
      status: 'uploading',
      progress: { loaded: 0, total: file.size, percentage: 0, speed: 0, timeRemaining: Infinity }
    }));

    uploadStartTime.current = Date.now();

    try {
      // Use Supabase client for upload with progress simulation
      const { data, error } = await supabase.storage
        .from('operator-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('operator-media')
        .getPublicUrl(data.path);

      // Create media asset entry in database
      try {
        await supabase.from('media_assets').insert({
          url: publicUrl,
          type: file.type,
          operator_id: null, // Will be set when operator is created
          alt_text: file.name,
          caption: ''
        });
      } catch (dbError) {
        console.warn('Failed to create media asset entry:', dbError);
        // Continue with upload success even if DB entry fails
      }

      // Update to completed state
      setUploads(prev => {
        const newMap = new Map(prev);
        newMap.set(fileId, {
          ...prev.get(fileId)!,
          status: 'completed',
          url: publicUrl,
          progress: { loaded: file.size, total: file.size, percentage: 100, speed: 0, timeRemaining: 0 }
        });
        return newMap;
      });

      if (!multiple) {
        setPreview(publicUrl);
        onUpload(publicUrl);
      }
      
      toast.success('File uploaded successfully');
    } catch (error) {
      setUploads(prev => {
        const newMap = new Map(prev);
        const upload = newMap.get(fileId);
        if (upload) {
          newMap.set(fileId, {
            ...upload,
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed'
          });
        }
        return newMap;
      });
      
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(`Failed to upload file: ${errorMessage}`);
      throw error;
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      uploadFile(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    multiple,
  });

  const pauseUpload = (fileId: string) => {
    setUploads(prev => {
      const newMap = new Map(prev);
      const upload = newMap.get(fileId);
      if (upload && upload.controller) {
        upload.controller.abort();
        newMap.set(fileId, { ...upload, status: 'paused' });
      }
      return newMap;
    });
  };

  const resumeUpload = (fileId: string) => {
    const upload = uploads.get(fileId);
    if (upload && upload.status === 'paused') {
      uploadFile(upload.file);
      setUploads(prev => {
        const newMap = new Map(prev);
        newMap.delete(fileId);
        return newMap;
      });
    }
  };

  const cancelUpload = (fileId: string) => {
    const upload = uploads.get(fileId);
    if (upload && upload.controller) {
      upload.controller.abort();
    }
    setUploads(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  };

  const clearFile = () => {
    setPreview(null);
    onUpload('');
  };

  return (
    <div className={cn('space-y-4', className)}>
      <label className="text-sm font-medium">{label}</label>
      
      {preview && !multiple && (
        <div className="relative">
          <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden border">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={clearFile}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {uploads.size > 0 && (
        <div className="space-y-2">
          {Array.from(uploads.entries()).map(([fileId, upload]) => (
            <Card key={fileId} className="p-3">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {upload.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {upload.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {upload.file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatBytes(upload.file.size)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {upload.status === 'uploading' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => pauseUpload(fileId)}
                      >
                        <Pause className="h-3 w-3" />
                      </Button>
                    )}
                    {upload.status === 'paused' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resumeUpload(fileId)}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelUpload(fileId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {upload.status === 'uploading' && (
                  <>
                    <Progress value={upload.progress.percentage} className="mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{upload.progress.percentage}%</span>
                      <span>
                        {formatBytes(upload.progress.speed)}/s • {formatTime(upload.progress.timeRemaining)} remaining
                      </span>
                    </div>
                  </>
                )}
                
                {upload.status === 'error' && (
                  <p className="text-xs text-destructive">{upload.error}</p>
                )}
                
                {upload.status === 'completed' && (
                  <p className="text-xs text-green-600">Upload completed successfully</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200",
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm">
            {isDragActive ? (
              <span>Drop the {multiple ? 'files' : 'file'} here...</span>
            ) : (
              <span>
                Drag & drop {multiple ? 'files' : 'a file'} here, or click to select
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Max size: {Math.round(maxSize / 1024 / 1024)}MB
            {multiple && ' per file'}
          </div>
        </div>
      </div>
    </div>
  );
}