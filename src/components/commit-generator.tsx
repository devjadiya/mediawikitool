'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateCommit } from '@/ai/flows/generate-commit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GitCommit, Copy } from 'lucide-react';

const formSchema = z.object({
  diff: z.string().min(10, 'Please paste a diff.'),
});

export function CommitGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [commitMessage, setCommitMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diff: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setCommitMessage(null);

    try {
      const result = await generateCommit(values);
      setCommitMessage(result.commitMessage);
    } catch (error) {
      console.error('Error generating commit message:', error);
      toast({
        title: 'Error',
        description: 'Could not generate commit message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Commit message copied to clipboard.' });
  }

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="font-headline">Generate Commit Message</CardTitle>
            <CardDescription>Paste your git diff to generate a conventional commit message.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="diff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Git Diff</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your git diff output here..."
                      className="min-h-[250px] font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {commitMessage && (
              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Generated Message:</h3>
                     <Button type="button" size="sm" variant="ghost" onClick={() => copyToClipboard(commitMessage)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                    </Button>
                </div>
                <Textarea
                  readOnly
                  className="bg-secondary font-mono"
                  value={commitMessage}
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <><GitCommit className="mr-2 h-4 w-4" />Generate Message</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
