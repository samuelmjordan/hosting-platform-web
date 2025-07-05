'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileObject } from '@/app/_components/page/files/utils/types';
import * as fileService from '@/app/_services/protected/client/fileClientService';
import { FileList } from './FileList';
import { FileToolbar } from './FileToolbar';
import { FileBreadcrumb } from './FileBreadcrumb';
import { FileEditor } from './FileEditor';
import { UploadDialog } from './UploadDialog';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import {CheckCircle2, FileBadge, Folder, Loader2} from 'lucide-react';
import {isEditable} from "@/app/_components/page/files/utils/helpers";
import {Alert, AlertDescription} from "@/components/ui/alert";

interface FileExplorerProps {
  userId: string;
  subscriptionId: string;
}

export function FileExplorer({ userId, subscriptionId }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<FileObject[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [lastClickedFile, setLastClickedFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFile, setEditingFile] = useState<{ path: string; content: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const files = await fileService.getFiles(subscriptionId, currentPath);
      console.log('Files loaded:', files);
      setFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: 'Error loading files',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPath, subscriptionId, toast]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedFiles(new Set());
    setLastClickedFile(null);
  };

  const handleFileOpen = async (file: FileObject) => {
    if (!file.is_file) {
      handleNavigate(`${currentPath}/${file.name}`.replace('//', '/'));
      return;
    }

    if (isEditable(file)) {
      try {
        const content = await fileService.getFileContents(
            subscriptionId,
            `${currentPath}/${file.name}`.replace('//', '/')
        );
        setEditingFile({
          path: `${currentPath}/${file.name}`.replace('//', '/'),
          content,
        });
      } catch (error) {
        toast({
          title: 'Error opening file',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFileSelect = (fileName: string, isSelected: boolean, shiftKey = false) => {
    if (shiftKey && lastClickedFile && lastClickedFile !== fileName) {
      // find the range between lastClickedFile and fileName
      const sortedFileNames = files
          .sort((a, b) => {
            if (!a.is_file && b.is_file) return -1;
            if (a.is_file && !b.is_file) return 1;
            return a.name.localeCompare(b.name);
          })
          .map(f => f.name);

      const startIdx = sortedFileNames.indexOf(lastClickedFile);
      const endIdx = sortedFileNames.indexOf(fileName);

      if (startIdx !== -1 && endIdx !== -1) {
        const rangeStart = Math.min(startIdx, endIdx);
        const rangeEnd = Math.max(startIdx, endIdx);
        const filesToSelect = sortedFileNames.slice(rangeStart, rangeEnd + 1);

        setSelectedFiles(prev => {
          const newSelected = new Set(prev);
          filesToSelect.forEach(name => {
            if (isSelected) {
              newSelected.add(name);
            } else {
              newSelected.delete(name);
            }
          });
          return newSelected;
        });
      }
    } else {
      // normal single selection
      setSelectedFiles(prev => {
        const newSelected = new Set(prev);
        if (isSelected) {
          newSelected.add(fileName);
        } else {
          newSelected.delete(fileName);
        }
        return newSelected;
      });
    }

    setLastClickedFile(fileName);
  };

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedFiles(new Set(files.map(f => f.name)));
    } else {
      setSelectedFiles(new Set());
    }
    setLastClickedFile(null);
  };

  const handleDownload = async () => {
    if (selectedFiles.size !== 1) return;

    const fileName = Array.from(selectedFiles)[0];
    const file = files.find(f => f.name === fileName);
    if (!file || !file.is_file) return;

    try {
      const { attributes } = await fileService.getDownloadLink(
          subscriptionId,
          `${currentPath}/${fileName}`.replace('//', '/')
      );
      window.open(attributes.url, '_blank');
    } catch (error) {
      toast({
        title: 'Error downloading file',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (selectedFiles.size === 0) return;

    try {
      await fileService.deleteFiles(subscriptionId, currentPath, Array.from(selectedFiles));
      await loadFiles();
      setSelectedFiles(new Set());
      toast({
        title: 'Files deleted',
        description: `${selectedFiles.size} file(s) deleted successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error deleting files',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      await fileService.createFolder(subscriptionId, currentPath, name);
      await loadFiles();
      toast({
        title: 'Folder created',
        description: `Folder "${name}" created successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error creating folder',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCompress = async () => {
    if (selectedFiles.size === 0) return;

    try {
      const result = await fileService.compressFiles(subscriptionId, currentPath, Array.from(selectedFiles));
      await loadFiles();
      setSelectedFiles(new Set());
      toast({
        title: 'Files compressed',
        description: `Archive "${result.name}" created successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error compressing files',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleFileSave = async (content: string) => {
    if (!editingFile) return;

    try {
      await fileService.writeFile(subscriptionId, editingFile.path, content);
      setEditingFile(null);
      toast({
        title: 'File saved',
        description: 'File saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error saving file',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = async () => {
    if (selectedFiles.size === 0) return;

    try {
      for (const fileName of selectedFiles) {
        const filePath = `${currentPath}/${fileName}`.replace('//', '/');
        await fileService.copyFile(subscriptionId, filePath);
      }

      await loadFiles();
      setSelectedFiles(new Set());

      toast({
        title: 'Files duplicated',
        description: `${selectedFiles.size} file(s) duplicated successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error duplicating files',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  if (editingFile) {
    return (
        <FileEditor
            filePath={editingFile.path}
            initialContent={editingFile.content}
            onSave={handleFileSave}
            onClose={() => setEditingFile(null)}
        />
    );
  }

  return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">File Explorer</h1>
        </div>

        <Card>
          <FileBreadcrumb
              path={currentPath}
              onNavigate={handleNavigate}
          />

          <FileToolbar
              selectedCount={selectedFiles.size}
              onCreateFolder={handleCreateFolder}
              onUpload={() => setIsUploading(true)}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onCompress={handleCompress}
              onRefresh={loadFiles}
              onCopy={handleCopy}
          />

          {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
          ) : (
              <FileList
                  files={files}
                  selectedFiles={selectedFiles}
                  onFileSelect={handleFileSelect}
                  onSelectAll={handleSelectAll}
                  onFileOpen={handleFileOpen}
              />
          )}

          <UploadDialog
              open={isUploading}
              onClose={() => setIsUploading(false)}
              onUpload={async (files) => {
                setIsUploading(false);
                await loadFiles();
              }}
              subscriptionId={subscriptionId}
          />
        </Card>

        <Alert>
          <Folder className="h-4 w-4" />
          <AlertDescription>
            For uploading / downloading large files, it is recommended to use a dedicated SFTP client. <a href="./sftp" className="underline">Check your SFTP details.</a>
          </AlertDescription>
        </Alert>
      </div>
  );
}