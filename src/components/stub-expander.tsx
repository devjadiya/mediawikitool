'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { expandStub, ExpandStubOutput } from '@/ai/flows/expand-stub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Lightbulb, Check } from 'lucide-react';

const formSchema = z.object({
  articleTitle: z.string().min(3, 'Please enter a title.'),
  existingContent: z.string().min(10, 'Please enter some existing content.'),
});

export function StubExpander() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ExpandStubOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleTitle: '',
      existingContent: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSuggestions(null);

    try {
      const result = await expandStub(values);
      setSuggestions(result);
    } catch (error) {
      console.error('Error expanding stub:', error);
      toast({
        title: 'Error',
        description: 'Could not generate suggestions. Please try again.',
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
            <CardTitle className="font-headline">Expand Article Stub</CardTitle>
            <CardDescription>Provide an article title and its current content to get expansion ideas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="articleTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., History of Mumbai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="existingContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Existing Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the current wikitext of the stub here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {suggestions && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold">Suggested Sections:</h3>
                <div className="grid grid-cols-1 gap-4">
                  {suggestions.suggestedSections.map((section, index) => (
                    <Card key={index} className="bg-secondary">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-primary" />
                          {section.title}
                        </CardTitle>
                        <CardDescription>{section.reasoning}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm font-medium mb-2">Key Points to Cover:</p>
                        <ul className="space-y-2">
                          {section.keyPoints.map((point, pIndex) => (
                            <li key={pIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                <><Sparkles className="mr-2 h-4 w-4" />Get Suggestions</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
