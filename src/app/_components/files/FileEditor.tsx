import { useState } from 'react';
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

  const handleSave = () => {
    onSave(content);
    setIsDirty(false);
  };

  const handleClose = () => {
    if (isDirty) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirm) return;
    }
    onClose();
  };

  const fileName = filePath.split('/').pop() || 'unnamed';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-medium">{fileName}</CardTitle>
            {isDirty && (
              <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded">
                Modified
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
              Save
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
      <CardContent className="flex-1 p-0">
        <Textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsDirty(true);
          }}
          className={cn(
            "h-full w-full resize-none rounded-none border-0 p-4",
            "font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          )}
          placeholder="Empty file"
          spellCheck={false}
        />
      </CardContent>
    </Card>
  );
}