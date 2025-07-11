'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { referenceResolver, ReferenceResolverOutput } from '@/ai/flows/reference-resolver';
import { Button, StatefulButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { BookCheck, Wand2, Copy, Info } from 'lucide-react';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  qId: z.string().regex(/^Q\d+$/, "Please enter a valid Wikidata Q-ID (e.g., Q42)."),
  url: z.string().url('Please enter a valid URL.'),
});

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export function ReferenceResolver() {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [result, setResult] = useState<ReferenceResolverOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qId: '',
      url: '',
    },
  });

  const handleDemoClick = () => {
    form.setValue('qId', 'Q243'); // Eiffel Tower
    form.setValue('url', 'https://www.toureiffel.paris/en/the-monument/history');
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonState('loading');
    setResult(null);

    try {
      const apiResult = await referenceResolver(values);
      setResult(apiResult);
      setButtonState('success');
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Could not resolve the reference. The URL might be inaccessible.',
        variant: 'destructive',
      });
      setButtonState('error');
    } finally {
        setTimeout(() => setButtonState('idle'), 2000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Reference wikitext copied to clipboard.' });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Resolve Reference</CardTitle>
                <CardDescription>Enter a Q-ID and a source URL to generate a citation.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleDemoClick} disabled={buttonState === 'loading'}>
                <Wand2 className="mr-2 h-4 w-4" />
                Try Demo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="qId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Wikidata Item ID</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Q243" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Source URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://www.example.com/article" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
            </div>

            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold text-lg">Generated Reference:</h3>
                <Card className="bg-secondary/20 dark:bg-secondary/50">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-start gap-2 text-sm">
                            <Info className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                            <p className="text-muted-foreground">{result.summary}</p>
                        </div>
                        <div>
                             <FormLabel>Formatted Wikitext</FormLabel>
                             <div className="flex items-start gap-2">
                                <Textarea readOnly value={result.wikitext} className="font-mono text-xs bg-background min-h-[100px]"/>
                                <Button type="button" size="icon" variant="ghost" onClick={() => copyToClipboard(result.wikitext)}>
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
            <StatefulButton
              type="submit"
              buttonState={buttonState}
              idleContent={<><BookCheck className="h-4 w-4" />Generate Reference</>}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
