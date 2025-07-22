import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div>
      <header className='bg-background border-b shadow-xs'>
        <div className='mx-auto max-w-2xl p-4'>
          <h1>Form Builder</h1>
        </div>
      </header>
      <main className='mx-auto max-w-2xl px-4 py-8'>
        <div className='grid gap-8'>
          <Card>
            <CardHeader>
              <h2>Form Title</h2>
            </CardHeader>
            <CardContent>Form Content</CardContent>
            <CardFooter className='flex gap-2'>
              <Button>Submit</Button>
              <Button variant='outline'>Reset Form</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <h2>Form Submission Data</h2>
            </CardHeader>
            <CardContent>
              <div className='bg-muted rounded-md p-4 text-center'>
                <p className='text-muted-foreground'>No data submitted yet</p>
                <p className='text-muted-foreground text-sm'>
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
