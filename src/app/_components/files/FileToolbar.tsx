import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Upload,
  Download,
  FolderPlus,
  Trash2,
  RefreshCw,
  Archive,
  MoreVertical,
  Copy,
  Edit,
} from 'lucide-react';

interface FileToolbarProps {
  selectedCount: number;
  onCreateFolder: (name: string) => void;
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onCompress: () => void;
  onRefresh: () => void;
  onCopy: () => void;
}

export function FileToolbar({
  selectedCount,
  onCreateFolder,
  onUpload,
  onDownload,
  onDelete,
  onCompress,
  onRefresh,
  onCopy,
}: FileToolbarProps) {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      setFolderName('');
      setIsCreateFolderOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 p-3 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateFolderOpen(true)}
            className="gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">new folder</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onUpload}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">upload</span>
          </Button>

          {selectedCount > 0 && (
              <>
                <div className="h-6 w-px bg-border" />

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onCopy}
                    className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Duplicate</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onDownload}
                    disabled={selectedCount !== 1}
                    className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onCompress}
                    className="gap-2"
                >
                  <Archive className="h-4 w-4" />
                  <span className="hidden sm:inline">Compress</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for the new folder
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!folderName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}