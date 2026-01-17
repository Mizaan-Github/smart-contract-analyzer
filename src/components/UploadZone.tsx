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
    if (files && files.length > 0) onFileSelect(files[0]);
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) onFileSelect(files[0]);
  }, [onFileSelect]);

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn('upload-minimal cursor-pointer group', isDragging && 'active', className)}
    >
      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300',
          isDragging ? 'bg-primary/12 scale-105' : 'bg-muted/60 group-hover:bg-primary/8'
        )}>
          {isDragging ? (
            <FileText className="w-5 h-5 text-primary" />
          ) : (
            <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
        <div className="space-y-1 text-center">
          <p className="text-[13px] font-medium text-foreground">
            {isDragging ? 'Déposez ici' : 'Glissez votre contrat'}
          </p>
          <p className="text-[11px] text-muted-foreground/70">ou cliquez pour parcourir</p>
        </div>
        <span className="badge-minimal bg-muted/60 text-muted-foreground">
          PDF • DOCX • JPG
        </span>
      </label>
    </div>
  );
}
