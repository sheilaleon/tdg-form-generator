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

import { formSpecs } from '@/lib/form-specs';

export default function Home() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<any>(null);

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
  };

  const selectedTemplate = formSpecs.find(
    (template) => template.id === selectedTemplateId,
  );

  const handleFormSubmit = (data: any) => {
    setSubmittedData(data);
  };

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
                {formSpecs.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="grid gap-8">
          {selectedTemplate ? (
            <>
              <div className="space-y-3">
                <h2 className="text-2xl leading-none font-semibold">
                  {selectedTemplate.title}
                </h2>
                <p className="text-muted-foreground">
                  All fields required unless specified
                </p>
              </div>
              <FormRenderer
                key={selectedTemplateId}
                spec={selectedTemplate}
                onSubmit={handleFormSubmit}
              />
            </>
          ) : (
            <Card>
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
            </Card>
          )}
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-xl leading-none font-semibold">
                Form Submission Data
              </h2>
            </CardHeader>
            <CardContent>
              {submittedData ? (
                <div>
                  <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                </div>
              ) : (
                <div className="bg-muted rounded-md p-4 text-center">
                  <p className="text-muted-foreground">No data submitted yet</p>
                  <p className="text-muted-foreground text-sm">
                    Fill out and submit the form to view JSON output
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
