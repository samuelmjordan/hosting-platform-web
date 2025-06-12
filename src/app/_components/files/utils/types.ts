export interface FileObject {
  name: string;
  mode: string;
  size: number;
  is_file: boolean;
  is_symlink: boolean;
  is_editable: boolean;
  mimetype: string;
  created_at: string;
  modified_at: string;
}

export interface SignedUrl {
  object: string;
  attributes: {
    url: string;
  };
}

export interface RenameItem {
  from: string;
  to: string;
}

export interface FileApiClient {
  getFiles: (path: string) => Promise<FileObject[]>;
  getFileContents: (file: string) => Promise<string>;
  getDownloadLink: (file: string) => Promise<SignedUrl>;
  getUploadLink: () => Promise<SignedUrl>;
  renameFiles: (root: string, files: RenameItem[]) => Promise<void>;
  copyFile: (location: string) => Promise<void>;
  writeFile: (file: string, content: string) => Promise<void>;
  compressFiles: (root: string, files: string[]) => Promise<FileObject>;
  decompressFile: (root: string, file: string) => Promise<void>;
  deleteFiles: (root: string, files: string[]) => Promise<void>;
  createFolder: (root: string, name: string) => Promise<void>;
}