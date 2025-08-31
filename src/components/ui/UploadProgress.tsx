import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/utils/imageUtils';

export interface UploadProgressProps {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
  fileName: string;
  state: 'running' | 'paused' | 'success' | 'error';
  error?: string;
  onCancel?: () => void;
  className?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  bytesTransferred,
  totalBytes,
  fileName,
  state,
  error,
  onCancel,
  className
}) => {
  const getStatusIcon = () => {
    switch (state) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'paused':
        return <Loader2 className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'success':
        return 'Upload complete';
      case 'error':
        return error || 'Upload failed';
      case 'running':
        return `Uploading... ${Math.round(progress)}%`;
      case 'paused':
        return 'Upload paused';
      default:
        return 'Uploading...';
    }
  };

  return (
    <div className={cn(
      "w-full p-4 border rounded-lg bg-slate-800/50 border-slate-700",
      state === 'error' && "border-red-500/50 bg-red-500/10",
      state === 'success' && "border-green-500/50 bg-green-500/10",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-white truncate max-w-[200px]">
            {fileName}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">
            {formatFileSize(bytesTransferred)} / {formatFileSize(totalBytes)}
          </span>
          {state === 'running' && onCancel && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-red-400"
              onClick={onCancel}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <Progress
        value={progress}
        className="h-2 bg-slate-700"
        indicatorClassName={cn(
          "bg-blue-500",
          state === 'success' && "bg-green-500",
          state === 'error' && "bg-red-500",
          state === 'paused' && "bg-yellow-500"
        )}
      />

      <div className="flex items-center justify-between mt-2">
        <span className={cn(
          "text-xs",
          state === 'running' && "text-blue-400",
          state === 'success' && "text-green-400",
          state === 'error' && "text-red-400",
          state === 'paused' && "text-yellow-400"
        )}>
          {getStatusText()}
        </span>
        
        <span className="text-xs text-slate-400">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export interface UploadProgressListProps {
  uploads: Array<{
    id: string;
    file: File;
    progress: {
      progress: number;
      bytesTransferred: number;
      totalBytes: number;
      state: 'running' | 'paused' | 'success' | 'error';
    };
    error?: string;
  }>;
  onCancelUpload?: (id: string) => void;
  className?: string;
}

export const UploadProgressList: React.FC<UploadProgressListProps> = ({
  uploads,
  onCancelUpload,
  className
}) => {
  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {uploads.map((upload) => (
        <UploadProgress
          key={upload.id}
          progress={upload.progress.progress}
          bytesTransferred={upload.progress.bytesTransferred}
          totalBytes={upload.progress.totalBytes}
          fileName={upload.file.name}
          state={upload.progress.state}
          error={upload.error}
          onCancel={onCancelUpload ? () => onCancelUpload(upload.id) : undefined}
        />
      ))}
    </div>
  );
};
