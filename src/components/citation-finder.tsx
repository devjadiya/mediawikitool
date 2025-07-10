'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { findCitation, FindCitationOutput } from '@/ai/flows/find-citations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileSearch, Link, Copy } from 'lucide-react';
import { Progress } from './ui/progress';

const formSchema = z.object({
  statement: z.string().min(10, 'Please enter a statement of at least 10 characters.'),
});

export function CitationFinder() {
  const [isLoading, setIsLoading] = useState(false);
  const [citation, setCitation] = useState<FindCitationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      statement: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setCitation(null);

    try {
      const result = await findCitation(values);
      setCitation(result);
    } catch (error) {
      console.error('Error finding citation:', error);
      toast({
        title: 'Error',
        description: 'Could not find a citation. Please try a different statement.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Citation copied to clipboard.' });
  }

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="font-headline">Find Citation</CardTitle>
            <CardDescription>Enter a statement to find a reliable source.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="statement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statement needing citation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., The sun is primarily composed of hydrogen and helium."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {citation && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold">Result:</h3>
                <Card className="bg-secondary">
                    <CardContent className="p-4 space-y-4">
                        <div>
                            <p className="text-sm font-medium mb-1">Source</p>
                            <a href={citation.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                                <Link className="h-4 w-4" />
                                <span className="truncate">{citation.title}</span>
                            </a>
                        </div>
                         <div>
                            <p className="text-sm font-medium mb-2">Confidence</p>
                            <div className="flex items-center gap-2">
                               <Progress value={citation.confidence * 100} className="w-full" />
                               <span className="text-sm font-mono">{Math.round(citation.confidence * 100)}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-1">Formatted Citation</p>
                            <div className="flex items-center gap-2">
                                <Textarea readOnly value={citation.formattedCitation} className="font-mono text-xs" rows={3}/>
                                <Button type="button" size="icon" variant="ghost" onClick={() => copyToClipboard(citation.formattedCitation)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <><FileSearch className="mr-2 h-4 w-4" />Find Source</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
