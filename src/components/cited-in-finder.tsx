'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { citedInFinder, CitedInFinderOutput } from '@/ai/flows/cited-in-finder';
import { Button, StatefulButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { BookText, Wand2, Info, Link as LinkIcon, Quote } from 'lucide-react';

const formSchema = z.object({
  sourceIdentifier: z.string().min(10, "Please enter a source identifier (URL, DOI, or title)."),
});

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export function CitedInFinder() {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [result, setResult] = useState<CitedInFinderOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceIdentifier: '',
    },
  });

  const handleDemoClick = () => {
    form.setValue('sourceIdentifier', 'https://www.nature.com/articles/nature12345');
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonState('loading');
    setResult(null);

    try {
      const apiResult = await citedInFinder(values);
      setResult(apiResult);
      setButtonState('success');
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Could not find citations. The search tool might be busy.',
        variant: 'destructive',
      });
      setButtonState('error');
    } finally {
        setTimeout(() => setButtonState('idle'), 2000);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Find Citations of a Source</CardTitle>
                <CardDescription>Enter a URL, DOI, or book title to find where it's cited.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleDemoClick} disabled={buttonState === 'loading'}>
                <Wand2 className="mr-2 h-4 w-4" />
                Try Demo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="sourceIdentifier"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Source Identifier</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., https://www.nature.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />

            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold text-lg">Search Results:</h3>
                <Card className="bg-secondary/20 dark:bg-secondary/50">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-start gap-2 text-sm">
                            <Info className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                            <p className="text-muted-foreground">{result.summary}</p>
                        </div>
                        <div className="space-y-3">
                            {result.citations.length > 0 ? (
                                result.citations.map((citation, index) => (
                                    <div key={index} className="p-3 border rounded-md bg-background">
                                        <a href={citation.pageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                            <LinkIcon className="h-4 w-4" />
                                            <p className="font-semibold">{citation.pageTitle}</p>
                                        </a>
                                        <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
                                            <Quote className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <p>"{citation.context}"</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center">No citations found for this source.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <StatefulButton
              type="submit"
              buttonState={buttonState}
              idleContent={<><BookText className="h-4 w-4" />Find Citations</>}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
