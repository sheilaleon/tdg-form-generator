'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FormRenderer } from '@/components/form-renderer';

import { formTemplates } from '@/lib/form-templates';

export default function Home() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
  };

  const selectedTemplate = formTemplates.find(
    (template) => template.formId === selectedTemplateId,
  );

  console.log(selectedTemplate);

  return (
    <div>
      <header className="bg-background border-b shadow-xs">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-8 p-4">
          <div className="flex-none">
            <h1>Form Builder</h1>
          </div>

          <div className="w-full sm:w-60">
            <Select
              value={selectedTemplateId}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a form template" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {formTemplates.map((template) => (
                  <SelectItem key={template.formId} value={template.formId}>
                    {template.formName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="grid gap-8">
          <Card>
            {selectedTemplate ? (
              <>
                <CardHeader>
                  <h2>Form Title</h2>
                </CardHeader>
                <CardContent>
                  <FormRenderer fields={selectedTemplate.fields} />
                </CardContent>
              </>
            ) : (
              <CardContent>
                <div className="bg-muted rounded-md p-4 text-center">
                  <p className="text-muted-foreground">
                    No form template selected
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Select a form template to view the form
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
          <Card>
            <CardHeader>
              <h2>Form Submission Data</h2>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-md p-4 text-center">
                <p className="text-muted-foreground">No data submitted yet</p>
                <p className="text-muted-foreground text-sm">
                  Fill out and submit the form to view JSON output
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
