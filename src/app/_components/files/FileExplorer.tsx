'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FileObject } from '@/app/_components/files/utils/types';
import { PterodactylFileClient } from '@/app/_components/files/utils/client';
import { FileList } from './FileList';
import { FileToolbar } from './FileToolbar';
import { FileBreadcrumb } from './FileBreadcrumb';
import { FileEditor } from './FileEditor';
import { UploadDialog } from './FileDialog';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface FileExplorerProps {
  userId: string;
  subscriptionId: string;
}

export function FileExplorer({ userId, subscriptionId }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<FileObject[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [editingFile, setEditingFile] = useState<{ path: string; content: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const client = useMemo(
    () => new PterodactylFileClient(
      process.env.NEXT_PUBLIC_API_URL || '',
      userId,
      subscriptionId
    ),
    [userId, subscriptionId]
  );

  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const files = await client.getFiles(currentPath);
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
  }, [currentPath, client, toast]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedFiles(new Set());
  };

  const handleFileOpen = async (file: FileObject) => {
    if (!file.is_file) {
      handleNavigate(`${currentPath}/${file.name}`.replace('//', '/'));
      return;
    }

    if (file.is_editable) {
      try {
        const content = await client.getFileContents(`${currentPath}/${file.name}`.replace('//', '/'));
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

  const handleDownload = async () => {
    if (selectedFiles.size !== 1) return;
    
    const fileName = Array.from(selectedFiles)[0];
    const file = files.find(f => f.name === fileName);
    if (!file || !file.is_file) return;

    try {
      const { attributes } = await client.getDownloadLink(
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
      await client.deleteFiles(currentPath, Array.from(selectedFiles));
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
      await client.createFolder(currentPath, name);
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
      const result = await client.compressFiles(currentPath, Array.from(selectedFiles));
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
      await client.writeFile(editingFile.path, content);
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
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
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
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <FileList
          files={files}
          selectedFiles={selectedFiles}
          onFileSelect={(fileName, isSelected) => {
            const newSelected = new Set(selectedFiles);
            if (isSelected) {
              newSelected.add(fileName);
            } else {
              newSelected.delete(fileName);
            }
            setSelectedFiles(newSelected);
          }}
          onFileOpen={handleFileOpen}
          currentPath={currentPath}
        />
      )}

      <UploadDialog
        open={isUploading}
        onClose={() => setIsUploading(false)}
        onUpload={async (files) => {
          // Handle file upload
          setIsUploading(false);
          await loadFiles();
        }}
        getUploadUrl={() => client.getUploadLink()}
      />
    </Card>
  );
}