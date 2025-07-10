'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { explainCode, ExplainCodeOutput } from '@/ai/flows/explain-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  code: z.string().min(10, 'Please enter at least 10 characters of code.'),
  language: z.enum(['Lua', 'JavaScript']),
});

export function CodeExplainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExplainCodeOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      language: 'JavaScript',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    try {
      const apiResult = await explainCode(values);
      setResult(apiResult);
    } catch (error) {
      console.error('Error explaining code:', error);
      toast({
        title: 'Error',
        description: 'Could not explain the code. Please try again.',
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
            <CardTitle className="font-headline">Code Explainer</CardTitle>
            <CardDescription>Get an explanation for a snippet of Lua or JavaScript.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="JavaScript">JavaScript</SelectItem>
                            <SelectItem value="Lua">Lua</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Snippet</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your code snippet here..."
                      className="min-h-[200px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold">Explanation:</h3>
                <Card className="bg-secondary">
                    <CardContent className="p-4 space-y-4">
                        <div>
                             <p className="text-sm font-medium mb-1">Summary</p>
                             <p className="text-sm text-muted-foreground">{result.explanation}</p>
                        </div>
                        <div>
                             <p className="text-sm font-medium mb-2">Line-by-Line Breakdown</p>
                             <div className="space-y-2">
                                {result.lineByLine.map(line => (
                                    <div key={line.line} className="text-xs font-mono p-2 rounded-md bg-background/50">
                                        <span className="font-bold text-primary mr-2">Line {line.line}:</span>
                                        <span className="text-muted-foreground">{line.explanation}</span>
                                    </div>
                                ))}
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
                  Analyzing...
                </>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4" />Explain Code</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
