import { Button } from './ui/button';
import { FormField } from '@/types/form-field';

interface FormRendererProps {
  fields: FormField[];
}

export function FormRenderer({ fields }: FormRendererProps) {
  return (
    <>
      <form>
        <div className="flex flex-col gap-8">
          <div className="rounded-md p-2">
            {fields.map((field) => (
              <div key={field.fieldid}>
                <label htmlFor={field.fieldid}>{field.title}</label>
              </div>
            ))}
          </div>
          <div className="flex gap-2.5">
            <Button type="submit">Submit</Button>
            <Button variant="outline">Reset Form</Button>
          </div>
        </div>
      </form>
    </>
  );
}
