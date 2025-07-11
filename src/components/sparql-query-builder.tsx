'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sparqlQueryBuilder, SparqlQueryBuilderOutput } from '@/ai/flows/sparql-query-builder';
import { Button, StatefulButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Network, Copy, Link as LinkIcon, Info, Wand2 } from 'lucide-react';

const formSchema = z.object({
  naturalLanguageQuery: z.string().min(10, 'Please enter a query of at least 10 characters.'),
});

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

const WIKIDATA_QUERY_SERVICE_URL = 'https://query.wikidata.org/#';

export function SparqlQueryBuilder() {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [result, setResult] = useState<SparqlQueryBuilderOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      naturalLanguageQuery: '',
    },
  });

  const handleDemoClick = () => {
    const randomQuery = "Find all paintings by Vincent van Gogh located in the Netherlands";
    form.setValue('naturalLanguageQuery', randomQuery);
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonState('loading');
    setResult(null);

    try {
      const apiResult = await sparqlQueryBuilder(values);
      setResult(apiResult);
      setButtonState('success');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not generate the SPARQL query. The AI may be busy, please try again.',
        variant: 'destructive',
      });
      setButtonState('error');
    } finally {
        setTimeout(() => setButtonState('idle'), 2000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'SPARQL query copied to clipboard.' });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Describe Your Query</CardTitle>
                <CardDescription>Enter a plain English question to generate a SPARQL query.</CardDescription>
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
              name="naturalLanguageQuery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Natural Language Query</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Find 5 tallest mountains in the world"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold text-lg">Generated Query:</h3>
                <Card className="bg-secondary/20 dark:bg-secondary/50">
                    <CardContent className="p-4 space-y-4">
                        <div>
                             <FormLabel>Generated SPARQL Query</FormLabel>
                             <div className="flex items-start gap-2">
                                <Textarea readOnly value={result.sparqlQuery} className="font-mono text-xs bg-background min-h-[200px]"/>
                                <div className="flex flex-col gap-2">
                                    <Button type="button" size="icon" variant="ghost" onClick={() => copyToClipboard(result.sparqlQuery)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <a href={`${WIKIDATA_QUERY_SERVICE_URL}${encodeURIComponent(result.sparqlQuery)}`} target="_blank" rel="noopener noreferrer">
                                        <Button type="button" size="icon" variant="ghost">
                                            <LinkIcon className="h-4 w-4" />
                                        </Button>
                                    </a>
                                </div>
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
              idleContent={<><Network className="h-4 w-4" />Generate Query</>}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
