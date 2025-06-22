import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileBreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

export function FileBreadcrumb({ path, onNavigate }: FileBreadcrumbProps) {
  const segments = path.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center gap-1 p-3 border-b overflow-x-auto">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 gap-1"
        onClick={() => onNavigate('/')}
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">home</span>
      </Button>
      
      {segments.map((segment, index) => {
        const segmentPath = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        
        return (
          <div key={segmentPath} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2",
                isLast && "font-semibold"
              )}
              onClick={() => !isLast && onNavigate(segmentPath)}
              disabled={isLast}
            >
              {segment}
            </Button>
          </div>
        );
      })}
    </div>
  );
}