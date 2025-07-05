import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileEditorProps {
  filePath: string;
  initialContent: string;
  onSave: (content: string) => void;
  onClose: () => void;
}

export function FileEditor({ filePath, initialContent, onSave, onClose }: FileEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // calculate rows needed based on content
      const lines = content.split('\n').length;
      const lineHeight = 20; // approximate line height for text-sm
      const padding = 32; // p-4 = 16px top + 16px bottom
      const newHeight = Math.max(lines * lineHeight + padding, 120);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  const handleSave = () => {
    onSave(content);
    setIsDirty(false);
  };

  const handleClose = () => {
    if (isDirty) {
      const confirm = window.confirm('you have unsaved changes. are you sure you want to close?');
      if (!confirm) return;
    }
    onClose();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  const fileName = filePath.split('/').pop() || 'unnamed';

  return (
      <Card className="flex flex-col w-full">
        <CardHeader className="flex-none border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg font-medium">{fileName}</CardTitle>
              {isDirty && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded">
                modified
              </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={!isDirty}
                  className="gap-2"
              >
                <Save className="h-4 w-4" />
                save
              </Button>
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{filePath}</p>
        </CardHeader>
        <CardContent className="p-0">
          <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              className={cn(
                  "w-full resize-none rounded-none border-0 p-4 overflow-hidden",
                  "font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
              placeholder="empty file"
              spellCheck={false}
              style={{ minHeight: '120px' }}
          />
        </CardContent>
      </Card>
  );
}