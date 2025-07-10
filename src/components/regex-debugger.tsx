'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { debugRegex, DebugRegexOutput } from '@/ai/flows/debug-regex';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Code, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  regex: z.string().min(1, 'Please enter a regular expression.'),
});

export function RegexDebugger() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DebugRegexOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regex: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    try {
      const apiResult = await debugRegex(values);
      setResult(apiResult);
    } catch (error) {
      console.error('Error debugging regex:', error);
      toast({
        title: 'Error',
        description: 'Could not analyze the regular expression.',
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
            <CardTitle className="font-headline">Regex Debugger</CardTitle>
            <CardDescription>Get a natural language explanation of a regex.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="regex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regular Expression</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ^\[([0-9]{4}-[0-9]{2}-[0-9]{2})\]" {...field} className="font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold">Analysis:</h3>
                <Card className={cn("border-2", result.isValid ? "border-green-600" : "border-destructive")}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                           {result.isValid ? <CheckCircle className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-destructive" />}
                           <span className="text-lg font-semibold">{result.isValid ? "Valid Regex" : "Invalid Regex"}</span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
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
                  Analyzing...
                </>
              ) : (
                <><Code className="mr-2 h-4 w-4" />Debug</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
