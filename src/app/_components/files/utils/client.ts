import { FileObject, SignedUrl, RenameItem, FileApiClient } from '@/app/_components/files/utils/types';

export class PterodactylFileClient implements FileApiClient {
  constructor(
    private baseUrl: string,
    private userId: string,
    private subscriptionId: string
  ) {}

  private async request<T>(
    method: string,
    endpoint: string,
    params?: URLSearchParams,
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}/api/panel/user/${this.userId}/subscription/${this.subscriptionId}/file${endpoint}${params ? `?${params}` : ''}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': body instanceof FormData ? 'multipart/form-data' : 'application/json',
        // Add auth headers as needed
      },
    };

    if (body && !(body instanceof FormData)) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    } else if (body instanceof FormData) {
      options.body = body;
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as T;
  }

  async getFiles(path: string): Promise<FileObject[]> {
    const params = new URLSearchParams({ directory: path });
    const response = await this.request<Array<{ object: string; attributes: FileObject }>>(
      'GET', 
      '/list', 
      params
    );
    return response.map(item => item.attributes);
  }

  async getFileContents(file: string): Promise<string> {
    const params = new URLSearchParams({ file });
    return this.request<string>('GET', '/contents', params);
  }

  async getDownloadLink(file: string): Promise<SignedUrl> {
    const params = new URLSearchParams({ file });
    return this.request<SignedUrl>('GET', '/download', params);
  }

  async getUploadLink(): Promise<SignedUrl> {
    return this.request<SignedUrl>('GET', '/upload');
  }

  async renameFiles(root: string, files: RenameItem[]): Promise<void> {
    return this.request<void>('PUT', '/rename', undefined, { root, files });
  }

  async copyFile(location: string): Promise<void> {
    return this.request<void>('POST', '/copy', undefined, { location });
  }

  async writeFile(file: string, content: string): Promise<void> {
    const params = new URLSearchParams({ file });
    return this.request<void>('POST', '/write', params, content);
  }

  async compressFiles(root: string, files: string[]): Promise<FileObject> {
    return this.request<FileObject>('POST', '/compress', undefined, { root, files });
  }

  async decompressFile(root: string, file: string): Promise<void> {
    return this.request<void>('POST', '/decompress', undefined, { root, file });
  }

  async deleteFiles(root: string, files: string[]): Promise<void> {
    return this.request<void>('POST', '/delete', undefined, { root, files });
  }

  async createFolder(root: string, name: string): Promise<void> {
    return this.request<void>('POST', '/create-folder', undefined, { root, name });
  }
}