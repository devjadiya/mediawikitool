'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { enhanceTranslation, EnhanceTranslationOutput } from '@/ai/flows/enhance-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Languages, ArrowRightLeft, Copy, Wand2, ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  sourceUrl: z.string().url('Please enter a valid URL for the English article.'),
  targetUrl: z.string().url('Please enter a valid URL for the Hindi article.'),
});

export function TranslationEnhancer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnhanceTranslationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceUrl: '',
      targetUrl: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    try {
      const apiResult = await enhanceTranslation(values);
      setResult(apiResult);
    } catch (error) {
      console.error('Error enhancing translation:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'Could not enhance the translation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Wikitext copied to clipboard.' });
  }

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="font-headline">Enhance Translation</CardTitle>
            <CardDescription>Provide English and Hindi article URLs to find and translate missing content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 items-start">
                <FormField
                control={form.control}
                name="sourceUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Source Article (English)</FormLabel>
                    <FormControl>
                        <Input placeholder="https://en.wikipedia.org/wiki/..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="targetUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Target Article (Hindi)</FormLabel>
                    <FormControl>
                        <Input placeholder="https://hi.wikipedia.org/wiki/..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            {result && (
              <div className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Enhancement Suggestions
                </h3>
                 <Card className="bg-secondary/50">
                    <CardContent className="p-4">
                        <p className="text-sm font-medium">Summary</p>
                        <p className="text-sm text-muted-foreground">{result.summary}</p>
                    </CardContent>
                 </Card>

                {result.suggestedSections.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {result.suggestedSections.map((section, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                    <div className="flex items-center gap-2">
                                        <ArrowRight className="h-4 w-4" />
                                        {section.title}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4 p-2">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <FormLabel>Translated Content (Hindi)</FormLabel>
                                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`== ${section.title} ==\n\n${section.translatedContent}`)}>
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Copy Section
                                                </Button>
                                            </div>
                                             <Textarea readOnly value={section.translatedContent} className="font-sans min-h-[150px] bg-background" />
                                        </div>
                                         <div>
                                            <FormLabel>Original Content (English)</FormLabel>
                                            <Textarea readOnly value={section.originalContent} className="font-sans text-muted-foreground min-h-[150px] bg-background/50" />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                     <p className="text-muted-foreground text-center py-4">No major missing sections were found. The Hindi article appears to be well-aligned with the English one.</p>
                )}
                 
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing & Translating...
                </>
              ) : (
                <><Languages className="mr-2 h-4 w-4" />Enhance Translation</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
