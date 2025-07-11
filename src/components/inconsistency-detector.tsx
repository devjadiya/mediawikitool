'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { detectInconsistencies, DetectInconsistenciesOutput } from '@/ai/flows/detect-inconsistencies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GitCompareArrows, Check, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const formSchema = z.object({
  url1: z.string().url('Please enter a valid URL for the first article.'),
  url2: z.string().url('Please enter a valid URL for the second article.'),
});

export function InconsistencyDetector() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectInconsistenciesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url1: '',
      url2: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    try {
      const apiResult = await detectInconsistencies(values);
      setResult(apiResult);
    } catch (error) {
      console.error('Error detecting inconsistencies:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'Could not compare the articles. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="font-headline">Compare Articles</CardTitle>
            <CardDescription>Enter the URLs of two articles to compare them for factual inconsistencies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="url1"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Article URL 1</FormLabel>
                    <FormControl>
                        <Input placeholder="https://en.wikipedia.org/wiki/Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="url2"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Article URL 2</FormLabel>
                    <FormControl>
                        <Input placeholder="https://hi.wikipedia.org/wiki/मुंबई" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            {result && (
              <div className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg">Comparison Result:</h3>
                 <div>
                    <h4 className="font-medium mb-1">Summary</h4>
                    <p className="text-sm text-muted-foreground">{result.summary}</p>
                 </div>
                 <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Fact</TableHead>
                                <TableHead>Article 1 Value</TableHead>
                                <TableHead>Article 2 Value</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.facts.map((fact, index) => (
                                <TableRow key={index} className={!fact.isConsistent ? 'bg-destructive/10' : ''}>
                                    <TableCell className="font-medium">{fact.label}</TableCell>
                                    <TableCell>{fact.value1}</TableCell>
                                    <TableCell>{fact.value2}</TableCell>
                                    <TableCell className="text-center">
                                        {fact.isConsistent ? 
                                            <Check className="h-5 w-5 text-green-600 mx-auto" /> 
                                            : <AlertTriangle className="h-5 w-5 text-destructive mx-auto" />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </Card>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Comparing...
                </>
              ) : (
                <><GitCompareArrows className="mr-2 h-4 w-4" />Compare Articles</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
