/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';

import { FileText, Plus, Upload, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';

import { ProcessedField } from '@/types/form';

interface PhotoPreview {
  file: File;
  preview: string;
  id: string;
}

interface PhotoFieldProps {
  field: ProcessedField;
  form: UseFormReturn<any>;
  onChange: (value: any) => void;
  isMainPhotoField: boolean;
  disabled?: boolean;
  onReset?: () => void;
}

export function PhotoField({
  field,
  form,
  onChange,
  isMainPhotoField,
  disabled = false,
  onReset,
}: PhotoFieldProps) {
  const [filePreviews, setFilePreviews] = useState<PhotoPreview[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  // Watch for form reset and clear previews
  const fieldValue = form.watch(field.name);
  useEffect(() => {
    if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
      setFilePreviews([]);
      setFileName(null);
    }
  }, [fieldValue, field.name]);

  // Listen for external reset calls
  useEffect(() => {
    if (onReset) {
      const resetHandler = () => {
        setFilePreviews([]);
        setFileName(null);
      };

      (onReset as any).handler = resetHandler;
    }
  }, [onReset]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const files = event.target.files;
    if (!files || files.length === 0) return;

    const isMulti = isMainPhotoField;
    const pickedFiles = isMulti ? Array.from(files) : [files[0]];
    const invalid = pickedFiles.find(
      (f) => !f.type.startsWith('image/') || f.size > 5 * 1024 * 1024,
    );

    if (invalid) {
      form.setError(field.name, { message: 'Images only and each < 5 MB' });
      return;
    }

    const previews: PhotoPreview[] = pickedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${uuidv4()}`,
    }));
    setFilePreviews((prev) => (isMulti ? [...prev, ...previews] : previews));

    onChange(
      isMulti
        ? [...(form.getValues(field.name) ?? []), ...pickedFiles]
        : pickedFiles[0],
    );

    event.target.value = '';
  };

  const removePhoto = (photoId: string) => {
    const updatedPreviews = filePreviews.filter((p) => p.id !== photoId);
    setFilePreviews(updatedPreviews);

    // Update the form value
    const updatedFiles = isMainPhotoField
      ? updatedPreviews.map((p) => p.file)
      : updatedPreviews.length > 0
        ? updatedPreviews[0].file
        : null;

    onChange(updatedFiles);
  };

  const clearAllFiles = () => {
    if (disabled) return;

    setFilePreviews([]);
    setFileName(null);
    onChange(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            !disabled &&
            document.getElementById(`${field.name}-upload`)?.click()
          }
          className="flex items-center gap-2"
          disabled={disabled}
          aria-describedby={field.helpText ? `${field.name}-help` : undefined}
        >
          {isMainPhotoField ? (
            <Plus className="h-4 w-4" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isMainPhotoField ? 'Add Photos' : 'Choose Image'}
        </Button>

        {filePreviews.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={clearAllFiles}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
            Remove All
          </Button>
        )}

        {filePreviews.length > 0 && isMainPhotoField && (
          <span className="text-xs text-gray-500">
            {filePreviews.length} photo
            {filePreviews.length !== 1 ? 's' : ''} selected
          </span>
        )}
      </div>

      <input
        id={`${field.name}-upload`}
        type="file"
        accept="image/*"
        multiple={isMainPhotoField}
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled}
      />

      {filePreviews.length > 0 && (
        <div
          className={`grid gap-3 ${isMainPhotoField ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}
        >
          {filePreviews.map((preview) => (
            <div
              key={preview.id}
              className="relative rounded-lg border bg-gray-50 p-3"
            >
              <img
                src={preview.preview || '/placeholder.svg'}
                alt="Preview"
                className="h-auto max-h-32 w-full rounded-md object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removePhoto(preview.id)}
                className="absolute top-1 right-1 h-6 w-6 p-0"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {fileName && !filePreviews.length && (
        <div className="flex items-center gap-2 rounded-lg border bg-gray-50 p-3">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">{fileName}</span>
        </div>
      )}
    </div>
  );
}
