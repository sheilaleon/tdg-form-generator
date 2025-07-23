/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

import { Button } from './ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { format } from 'date-fns';
import { FileText, Plus, Upload, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { ProcessedField } from '@/types/form';

interface DynamicFormFieldProps {
  field: ProcessedField;
  form: UseFormReturn<any>;
  mainFieldName?: string;
}

interface PhotoPreview {
  file: File;
  preview: string;
  id: string;
}

export function DynamicFormField({
  field,
  form,
  mainFieldName,
}: DynamicFormFieldProps) {
  const [filePreviews, setFilePreviews] = useState<PhotoPreview[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const mainFieldValue = mainFieldName ? form.watch(mainFieldName) : null;
  const shouldShowPhotoField =
    !mainFieldName ||
    (mainFieldValue !== null &&
      mainFieldValue !== undefined &&
      mainFieldValue !== '');

  // Check if this is a main photo field (not part of a fieldset)
  const isMainPhotoField = field.type === 'photo' && !mainFieldName;

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void,
  ) => {
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
      id: `${file.name}-${crypto.randomUUID()}`,
    }));

    setFilePreviews((prev) => (isMulti ? [...prev, ...previews] : previews));

    onChange(
      isMulti
        ? [...(form.getValues(field.name) ?? []), ...pickedFiles]
        : pickedFiles[0],
    );

    event.target.value = '';
  };

  const removePhoto = (photoId: string, onChange: (value: any) => void) => {
    setFilePreviews((prev) => {
      const next = prev.filter((p) => p.id !== photoId);
      onChange(isMainPhotoField ? next.map((p) => p.file) : null);
      return next;
    });
  };

  const clearAllFiles = (onChange: (value: any) => void) => {
    setFilePreviews([]);
    setFileName(null);
    onChange(null);
  };

  // If this is a photo field and the main field has no value, don't render
  if (field.type === 'photo' && !shouldShowPhotoField) return null;

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="font-semibold">
            {field.label}
            {!field.required && field.type !== 'photo' && (
              <span className="text-muted-foreground">(optional)</span>
            )}
          </FormLabel>
          <FormControl>
            {(() => {
              switch (field.type) {
                case 'text':
                  return (
                    <Input
                      id={field.name}
                      name={formField.name}
                      value={(formField.value as string) ?? ''}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      placeholder={field.placeholder}
                      aria-describedby={
                        field.helpText ? `${field.name}-help` : undefined
                      }
                    />
                  );
                case 'textarea':
                  return (
                    <Textarea
                      id={field.name}
                      name={formField.name}
                      value={(formField.value as string) ?? ''}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      ref={formField.ref}
                      placeholder={field.placeholder}
                      className="min-h-[100px] w-full"
                      aria-describedby={
                        field.helpText ? `${field.name}-help` : undefined
                      }
                    />
                  );
                case 'number':
                  return (
                    <Input
                      id={field.name}
                      name={formField.name}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={
                        formField.value === undefined ||
                        formField.value === null
                          ? ''
                          : String(formField.value)
                      }
                      onChange={(e) => {
                        const val = e.target.value;

                        // Only allow digits
                        if (/^\d*$/.test(val)) {
                          // Valid input, update state
                          formField.onChange(
                            val === '' ? undefined : Number(val),
                          );
                        } else {
                          // Invalid input, do NOT update form state
                          // This stops React from re-rendering with invalid value
                        }
                      }}
                      onBlur={formField.onBlur}
                      ref={formField.ref}
                      placeholder={field.placeholder}
                      className="w-full"
                      aria-describedby={
                        field.helpText ? `${field.name}-help` : undefined
                      }
                    />
                  );
                case 'select':
                  const options = field.options || [];
                  return (
                    <Select
                      value={formField.value?.toString() || ''}
                      onValueChange={(value) => formField.onChange(value)}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-describedby={
                          field.helpText ? `${field.name}-help` : undefined
                        }
                      >
                        <SelectValue
                          placeholder={field.placeholder || 'Select an option'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                case 'photo':
                case 'file':
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document
                              .getElementById(`${field.name}-upload`)
                              ?.click()
                          }
                          className="flex items-center gap-2 hover:cursor-pointer"
                        >
                          {isMainPhotoField ? (
                            <Plus className="h-4 w-4" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {isMainPhotoField
                            ? 'Add Photos'
                            : `Choose ${field.type === 'photo' ? 'Image' : 'File'}`}
                        </Button>

                        {filePreviews.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => clearAllFiles(formField.onChange)}
                            className="flex items-center gap-2 text-red-600 hover:cursor-pointer hover:text-red-700"
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
                        accept={field.type === 'photo' ? 'image/*' : '*'}
                        multiple={isMainPhotoField}
                        onChange={(e) =>
                          handleFileUpload(e, formField.onChange)
                        }
                        className="hidden"
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
                                onClick={() =>
                                  removePhoto(preview.id, formField.onChange)
                                }
                                className="absolute top-1 right-1 h-6 w-6 p-0 hover:cursor-pointer"
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
                          <span className="text-sm text-gray-700">
                            {fileName}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                case 'datetime':
                  const now = format(new Date(), "yyyy-MM-dd'T'HH:mm");

                  return (
                    <Input
                      type="datetime-local"
                      id={field.name}
                      name={formField.name}
                      value={(formField.value as string) ?? ''}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      placeholder={field.placeholder}
                      max={now}
                      aria-describedby={
                        field.helpText ? `${field.name}-help` : undefined
                      }
                    />
                  );
              }
            })()}
          </FormControl>
          {field.helpText && (
            <FormDescription
              id={`${field.name}-help`}
              className="text-sm text-gray-600"
            >
              {field.helpText}
            </FormDescription>
          )}

          <FormMessage className="text-sm text-red-600" />
        </FormItem>
      )}
    />
  );
}
