export interface FileObject {
  name: string;
  mode: string;
  size: number;
  is_file: boolean;
  is_symlink: boolean;
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