import { FileObject } from '@/app/_components/page/files/utils/types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  File,
  Folder,
  FileText,
  FileCode,
  FileArchive,
  Image,
  Film,
  Music
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {isEditable} from "@/app/_components/page/files/utils/helpers";

interface FileListProps {
  files: FileObject[];
  selectedFiles: Set<string>;
  onFileSelect: (fileName: string, isSelected: boolean, shiftKey?: boolean) => void;
  onSelectAll: (selectAll: boolean) => void;
  onFileOpen: (file: FileObject) => void;
}

export function FileList({
   files,
   selectedFiles,
   onFileSelect,
   onSelectAll,
   onFileOpen
}: FileListProps) {
  const getFileIcon = (file: FileObject) => {
    if (!file.is_file) return <Folder className="h-5 w-5 text-blue-500" />;

    const ext = file.name.split('.').pop()?.toLowerCase();
    const mime = file.mimetype.toLowerCase();

    if (mime.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext || '')) {
      return <Image className="h-5 w-5 text-green-500" />;
    }
    if (mime.includes('video') || ['mp4', 'avi', 'mov', 'webm'].includes(ext || '')) {
      return <Film className="h-5 w-5 text-purple-500" />;
    }
    if (mime.includes('audio') || ['mp3', 'wav', 'ogg', 'flac'].includes(ext || '')) {
      return <Music className="h-5 w-5 text-pink-500" />;
    }
    if (mime.includes('zip') || mime.includes('tar') || ['zip', 'tar', 'gz', 'rar', '7z'].includes(ext || '')) {
      return <FileArchive className="h-5 w-5 text-yellow-500" />;
    }
    if (isEditable(file) || ['txt', 'md', 'yml', 'yaml', 'json', 'xml'].includes(ext || '')) {
      return <FileText className="h-5 w-5 text-blue-400" />;
    }
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'h'].includes(ext || '')) {
      return <FileCode className="h-5 w-5 text-orange-500" />;
    }

    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const sortedFiles = [...files].sort((a, b) => {
    // Directories first
    if (!a.is_file && b.is_file) return -1;
    if (a.is_file && !b.is_file) return 1;
    // Then alphabetically
    return a.name.localeCompare(b.name);
  });

  const handleSelectAll = (checked: boolean) => {
    onSelectAll(!!checked);
  };

  const isAllSelected = files.length > 0 && selectedFiles.size === files.length;

  return (
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-background border-b">
          <tr className="text-sm text-muted-foreground">
            <th className="w-12 p-3">
              <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="text-left p-3 font-medium">name</th>
            <th className="text-left p-3 font-medium hidden sm:table-cell">size</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">modified</th>
            <th className="text-left p-3 font-medium hidden lg:table-cell">permissions</th>
          </tr>
          </thead>
          <tbody>
          {sortedFiles.map((file) => (
              <tr
                  key={file.name}
                  className={cn(
                      "border-b transition-colors hover:bg-muted/50 cursor-pointer",
                      selectedFiles.has(file.name) && "bg-muted/30"
                  )}
                  onDoubleClick={() => onFileOpen(file)}
              >
                <td className="p-3">
                  <Checkbox
                      checked={selectedFiles.has(file.name)}
                      onCheckedChange={(checked) => {
                        // this gets called without shift info, so we ignore it
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileSelect(file.name, !selectedFiles.has(file.name), e.shiftKey);
                      }}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file)}
                    <span className="font-medium truncate max-w-xs">
                    {file.name}
                  </span>
                  </div>
                </td>
                <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">
                  {file.is_file ? formatFileSize(file.size) : '-'}
                </td>
                <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">
                  {formatDistanceToNow(new Date(file.modified_at), { addSuffix: true })}
                </td>
                <td className="p-3 text-sm font-mono text-muted-foreground hidden lg:table-cell">
                  {file.mode}
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        {files.length === 0 && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Folder className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>This folder is empty</p>
              </div>
            </div>
        )}
      </div>
  );
}