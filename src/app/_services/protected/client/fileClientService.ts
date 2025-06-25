import { FileObject, SignedUrl, RenameItem } from '@/app/_components/page/files/utils/types';

export async function getFiles(subscriptionId: string, path: string): Promise<FileObject[]> {
    const params = new URLSearchParams({ directory: path });
    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/list?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('failed to list files');
    }

    const data = await response.json();
    return data.map((item: { object: string; attributes: FileObject }) => item.attributes);
}

export async function getFileContents(subscriptionId: string, file: string): Promise<string> {
    const params = new URLSearchParams({ file });
    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/contents?${params}`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error('failed to get file contents');
    }

    return response.text();
}

export async function writeFile(subscriptionId: string, file: string, content: string): Promise<void> {
    const params = new URLSearchParams({ file });
    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/write?${params}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: content
    });

    if (!response.ok) {
        throw new Error('failed to write file');
    }
}

export async function deleteFiles(subscriptionId: string, root: string, files: string[]): Promise<void> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ root, files })
    });

    if (!response.ok) {
        throw new Error('failed to delete files');
    }
}

export async function createFolder(subscriptionId: string, root: string, name: string): Promise<void> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/create-folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ root, name })
    });

    if (!response.ok) {
        throw new Error('failed to create folder');
    }
}

export async function renameFiles(subscriptionId: string, root: string, files: RenameItem[]): Promise<void> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ root, files })
    });

    if (!response.ok) {
        throw new Error('failed to rename files');
    }
}

export async function copyFile(subscriptionId: string, location: string): Promise<void> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
    });

    if (!response.ok) {
        throw new Error('failed to copy file');
    }
}

export async function compressFiles(subscriptionId: string, root: string, files: string[]): Promise<FileObject> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/compress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ root, files })
    });

    if (!response.ok) {
        throw new Error('failed to compress files');
    }

    return response.json();
}

export async function decompressFile(subscriptionId: string, root: string, file: string): Promise<void> {
    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/decompress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ root, file })
    });

    if (!response.ok) {
        throw new Error('failed to decompress file');
    }
}

export async function getDownloadLink(subscriptionId: string, file: string): Promise<SignedUrl> {
    const params = new URLSearchParams({ file });
    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/download?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('failed to get download link');
    }

    return response.json();
}


export async function uploadFiles(subscriptionId: string, files: File[]): Promise<void> {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    const response = await fetch(`/api/user/subscription/${subscriptionId}/file/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('failed to upload files');
    }
}