import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignedUrl } from '@/app/_components/files/utils/types';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  userId: string;
  subscriptionId: string;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

export function UploadDialog({ open, onClose, onUpload, userId, subscriptionId }: UploadDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const uploadFiles = droppedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    
    setFiles(prev => [...prev, ...uploadFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const uploadFiles = selectedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    
    setFiles(prev => [...prev, ...uploadFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    try {
      for (let i = 0; i < files.length; i++) {
        const uploadFile = files[i];
        if (uploadFile.status !== 'pending') continue;

        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'uploading' } : f
        ));

        try {
          // Create FormData with the file
          const formData = new FormData();
          formData.append('files', uploadFile.file);

          // Upload through your backend proxy
          const xhr = new XMLHttpRequest();
          
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const progress = (e.loaded / e.total) * 100;
              setFiles(prev => prev.map((f, idx) => 
                idx === i ? { ...f, progress } : f
              ));
            }
          });

          await new Promise<void>((resolve, reject) => {
            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
              } else {
                reject(new Error(`Upload failed: ${xhr.status}`));
              }
            });
            xhr.addEventListener('error', () => reject(new Error('Upload failed')));

            // Upload to YOUR backend, not the signed URL
            const uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/panel/user/${userId}/subscription/${subscriptionId}/file/upload`;
            xhr.open('POST', uploadUrl);
            xhr.send(formData);
          });

          setFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'completed', progress: 100 } : f
          ));
        } catch (error) {
          setFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'error' } : f
          ));
          console.error('Upload error:', error);
        }
      }

      toast({
        title: 'Upload complete',
        description: `${files.filter(f => f.status === 'completed').length} file(s) uploaded successfully`,
      });

      onUpload(files.map(f => f.file));
      setTimeout(() => {
        setFiles([]);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to browse
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            "hover:border-primary hover:bg-primary/5"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop files here, or click to select
          </p>
          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            onChange={handleFileSelect}
          />
          <Button asChild variant="outline" size="sm">
            <label htmlFor="file-upload" className="cursor-pointer">
              Browse Files
            </label>
          </Button>
        </div>

        {files.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((uploadFile, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <File className="h-4 w-4 text-muted-foreground flex-none" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploadFile.file.size)}
                  </p>
                  {uploadFile.status === 'uploading' && (
                    <Progress value={uploadFile.progress} className="h-1 mt-1" />
                  )}
                </div>
                {uploadFile.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {uploadFile.status === 'completed' && (
                  <span className="text-xs text-green-600">✓</span>
                )}
                {uploadFile.status === 'error' && (
                  <span className="text-xs text-destructive">✗</span>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={uploadFiles} 
            disabled={files.length === 0 || files.some(f => f.status === 'uploading')}
          >
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
