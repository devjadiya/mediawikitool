'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { draftArticle, DraftArticleOutput } from '@/ai/flows/draft-article';
import { Button, StatefulButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { FileText, Copy } from 'lucide-react';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic.'),
});

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export function DraftingAssistant() {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [article, setArticle] = useState<DraftArticleOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonState('loading');
    setArticle(null);

    try {
      const result = await draftArticle(values);
      setArticle(result);
      setButtonState('success');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not draft the article. Please try another topic.',
        variant: 'destructive',
      });
      setButtonState('error');
    } finally {
        setTimeout(() => setButtonState('idle'), 2000);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Wikitext copied to clipboard.' });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle>Draft an Article</CardTitle>
            <CardDescription>Enter a topic to generate a starter article with sources.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Indus Valley Civilization" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {article && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold">Generated Draft:</h3>
                <div className="space-y-2">
                    <FormLabel>Title</FormLabel>
                    <Input readOnly value={article.title} />
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <FormLabel>Wikitext</FormLabel>
                        <Button type="button" size="sm" variant="ghost" onClick={() => copyToClipboard(article.wikitext)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                        </Button>
                    </div>
                    <Textarea
                      readOnly
                      className="min-h-[300px] bg-secondary font-mono text-xs"
                      value={article.wikitext}
                    />
                 </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <StatefulButton
                type="submit"
                buttonState={buttonState}
                idleContent={<><FileText className="h-4 w-4"/>Generate Draft</>}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
