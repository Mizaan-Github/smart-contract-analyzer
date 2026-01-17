import { cn } from '@/lib/utils';
import { Upload, FileText } from 'lucide-react';
import { useCallback, useState } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

export function UploadZone({ onFileSelect, className }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        'upload-zone cursor-pointer group',
        isDragging && 'dragging',
        className
      )}
    >
      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-5">
        <div className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300',
          isDragging 
            ? 'bg-primary/15 scale-110' 
            : 'bg-muted group-hover:bg-primary/10 group-hover:scale-105'
        )}>
          {isDragging ? (
            <FileText className="w-6 h-6 text-primary" />
          ) : (
            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
        <div className="space-y-1.5 text-center">
          <p className="font-medium text-sm text-foreground">
            {isDragging ? 'Déposez votre fichier' : 'Glissez votre contrat ici'}
          </p>
          <p className="text-xs text-muted-foreground">
            ou cliquez pour parcourir
          </p>
        </div>
        <div className="chip">
          PDF, Word, Image • Max 10 MB
        </div>
      </label>
    </div>
  );
}
