'use client';

import { useState } from 'react';

import { AlertTriangle, Bug } from 'lucide-react';
import { Toaster, toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { FormRenderer } from '@/components/form-renderer';

import { formSpecs } from '@/lib/form-specs';

export default function Home() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [simulateError, setSimulateError] = useState(false);

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    setSubmittedData(null);
  };

  const selectedTemplate = formSpecs.find(
    (template) => template.id === selectedTemplateId,
  );

  const handleFormSubmit = (data: any) => {
    setSubmittedData(data);

    toast.success('Form submitted successfully!', {
      action: {
        label: 'View Form JSON Output',
        onClick: () => setIsDrawerOpen(true),
      },
      duration: 8000,
      position: 'top-center',
      richColors: true,
    });
  };

  const handleFormReset = () => {
    setSubmittedData(null);
  };

  return (
    <div>
      <header className="bg-background border-b shadow-xs">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-8 p-4">
          <div className="flex-none">
            <h1>Form Builder</h1>
          </div>

          <div className="w-52">
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
        <div className="grid gap-6">
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
                onReset={handleFormReset}
                simulateError={simulateError}
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
        </div>
        <Toaster />
      </main>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger className="relative" asChild>
          <Button
            size="lg"
            className="fixed right-6 bottom-6 m-0 h-14 w-14 rounded-full bg-orange-500 p-0 text-white shadow-lg transition-shadow hover:bg-orange-600 hover:shadow-xl"
          >
            <Bug className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Debug - Form Submission Data
                </DrawerTitle>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <div className="flex items-center gap-2.5 text-left">
                <Switch
                  id="simulate-error"
                  checked={simulateError}
                  onCheckedChange={setSimulateError}
                />
                <Label
                  htmlFor="simulate-error"
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                >
                  <AlertTriangle className="h-4 w-4 flex-none" />
                  Simulate Submission Error?
                </Label>
                {simulateError && (
                  <div className="rounded text-xs text-red-600">
                    Next submission will fail
                  </div>
                )}
              </div>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {submittedData ? (
              <div>
                <ScrollArea
                  className="w-full rounded-md bg-slate-700 whitespace-nowrap text-slate-100"
                  type="always"
                >
                  <pre className="w-max p-4 text-sm break-words whitespace-pre-wrap">
                    {JSON.stringify(submittedData, null, 2)}
                  </pre>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            ) : (
              <div className="bg-muted rounded-md p-4 text-center">
                <p className="text-muted-foreground">No data submitted yet</p>
                <p className="text-muted-foreground text-sm">
                  Fill out and submit the form to view JSON output
                </p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
