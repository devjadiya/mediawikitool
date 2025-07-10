'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { detectCopyvio, DetectCopyvioOutput } from '@/ai/flows/detect-copyvio';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookCopy, CheckCircle, XCircle, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import Link from 'next/link';

const formSchema = z.object({
  text: z.string().min(50, 'Please enter at least 50 characters for a reliable check.'),
});

export function CopyvioDetector() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectCopyvioOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    try {
      const apiResult = await detectCopyvio(values);
      setResult(apiResult);
    } catch (error) {
      console.error('Error detecting copyvio:', error);
      toast({
        title: 'Error',
        description: 'Could not perform check. Please try again.',
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
            <CardTitle className="font-headline">Detect Copyright Violation</CardTitle>
            <CardDescription>Paste text to check for potential copyright issues.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text to Check</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the text you want to check here..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold">Analysis Result:</h3>
                <Card className={cn("border-2", result.isPotentialViolation ? "border-destructive" : "border-green-600")}>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                           {result.isPotentialViolation ? <XCircle className="h-6 w-6 text-destructive" /> : <CheckCircle className="h-6 w-6 text-green-600" />}
                           <span className="text-lg font-semibold">{result.isPotentialViolation ? "Potential Violation Detected" : "No Violation Detected"}</span>
                        </div>
                         <div>
                            <p className="text-sm font-medium mb-2">Confidence</p>
                            <div className="flex items-center gap-2">
                               <Progress value={result.confidence * 100} className="w-full" />
                               <span className="text-sm font-mono">{Math.round(result.confidence * 100)}%</span>
                            </div>
                        </div>
                        <div>
                             <p className="text-sm font-medium mb-1">Explanation</p>
                             <p className="text-sm text-muted-foreground">{result.explanation}</p>
                        </div>
                        {result.matchedSource && (
                            <div>
                                <p className="text-sm font-medium mb-1">Likely Source</p>
                                <a href={result.matchedSource} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                                    <LinkIcon className="h-4 w-4" />
                                    <span className="truncate">{result.matchedSource}</span>
                                </a>
                           </div>
                        )}
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
                  Checking...
                </>
              ) : (
                <><BookCopy className="mr-2 h-4 w-4" />Check for Copyvio</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
