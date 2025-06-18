
import {FileObject} from "@/app/_components/files/utils/types";

export const isEditable = (file: FileObject) => {
    // not a file = not editable
    if (!file.is_file) return false;

    // symlinks are sus, skip em
    if (file.is_symlink) return false;

    const mimetype = file.mimetype.toLowerCase();
    const name = file.name.toLowerCase();

    // explicit text types
    if (mimetype.startsWith('text/')) return true;

    // application types that are actually text
    const editableAppTypes = [
        'application/json',
        'application/javascript',
        'application/xml',
        'application/x-yaml',
        'application/yaml',
        'application/x-sh',
        'application/x-shellscript'
    ];

    if (editableAppTypes.some(type => mimetype.includes(type))) return true;

    // fallback to file extensions bc mimetypes can be wonky
    const editableExtensions = [
        '.txt', '.md', '.json', '.js', '.ts', '.jsx', '.tsx',
        '.html', '.htm', '.css', '.scss', '.sass', '.less',
        '.xml', '.yml', '.yaml', '.toml', '.ini', '.cfg', '.conf',
        '.sh', '.bash', '.zsh', '.fish', '.py', '.rb', '.php',
        '.java', '.c', '.cpp', '.h', '.hpp', '.cs', '.go',
        '.rs', '.swift', '.kt', '.scala', '.clj', '.hs',
        '.sql', '.dockerfile', '.gitignore', '.env',
        '.properties', '.log'
    ];

    return editableExtensions.some(ext => name.endsWith(ext));
}