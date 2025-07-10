'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateApiQuery, GenerateApiQueryOutput } from '@/ai/flows/generate-api-query';
import { Button, StatefulButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Terminal, Copy, Link as LinkIcon, Info } from 'lucide-react';
import { Input } from './ui/input';

const formSchema = z.object({
  taskDescription: z.string().min(10, 'Please enter a description of at least 10 characters.'),
});

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

const demoQueries = [
  "Get the first 10 revisions of the page 'Albert Einstein'",
  "Find all pages in 'Category:Living people'",
  "Search for 5 pages with 'global warming' in the title",
  "Get basic page information for 'Mars' and 'Jupiter'",
  "Get the last 5 edits by user 'Jimbo Wales'",
  "Parse the wikitext of the main page",
  "List 10 most recently changed pages",
  "OpenSearch for 'artificial intelligence'",
  "Get a list of 5 random pages",
  "Find all pages that link to 'United States'",
];

export function ApiQueryGenerator() {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [result, setResult] = useState<GenerateApiQueryOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskDescription: '',
    },
  });

  const handleDemoClick = (description: string) => {
    form.setValue('taskDescription', description);
    onSubmit({ taskDescription: description });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonState('loading');
    setResult(null);

    try {
      const apiResult = await generateApiQuery(values);
      setResult(apiResult);
      setButtonState('success');
    } catch (error) {
      console.error('Error generating API query:', error);
      toast({
        title: 'Error',
        description: 'Could not generate the API query. The AI may be busy, please try again.',
        variant: 'destructive',
      });
      setButtonState('error');
    } finally {
        setTimeout(() => setButtonState('idle'), 2000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'API URL copied to clipboard.' });
  }

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="font-headline">Describe Your Task</CardTitle>
            <CardDescription>Enter a plain English description of what you want to do with the API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Find all pages in the category 'Living people'"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
                <FormLabel>Or try a demo query</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                    {demoQueries.map((query, index) => (
                        <Button 
                            key={index}
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="text-xs h-auto py-2"
                            onClick={() => handleDemoClick(query)}
                            disabled={buttonState === 'loading'}
                        >
                            {query}
                        </Button>
                    ))}
                </div>
            </div>

            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold text-lg">Generated Query:</h3>
                <Card className="bg-secondary/50">
                    <CardContent className="p-4 space-y-4">
                        <div>
                             <FormLabel>Generated API URL</FormLabel>
                             <div className="flex items-center gap-2">
                                <Input readOnly value={result.apiUrl} className="font-mono text-xs bg-background"/>
                                <Button type="button" size="icon" variant="ghost" onClick={() => copyToClipboard(result.apiUrl)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <a href={result.apiUrl} target="_blank" rel="noopener noreferrer">
                                     <Button type="button" size="icon" variant="ghost">
                                        <LinkIcon className="h-4 w-4" />
                                    </Button>
                                </a>
                             </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <Info className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                            <p className="text-muted-foreground">{result.explanation}</p>
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
              idleContent={<><Terminal />Generate Query</>}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
