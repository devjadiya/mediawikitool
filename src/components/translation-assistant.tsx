'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { translateText } from '@/ai/flows/translate-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Languages, ArrowRightLeft } from 'lucide-react';

const languages = ["English", "Spanish", "French", "German", "Hindi", "Mandarin Chinese", "Japanese", "Russian", "Arabic"];

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
  sourceLanguage: z.string().min(1, 'Please select a source language.'),
  targetLanguage: z.string().min(1, 'Please select a target language.'),
});

export function TranslationAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      sourceLanguage: 'English',
      targetLanguage: 'Hindi',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setTranslatedText(null);

    try {
      const result = await translateText(values);
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error('Error translating text:', error);
      toast({
        title: 'Error',
        description: 'Could not translate the text. Please try again.',
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
            <CardTitle className="font-headline">Translate Wikitext</CardTitle>
            <CardDescription>Translate content while preserving links and templates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="sourceLanguage"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>From</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a language..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {languages.map(lang => (
                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="targetLanguage"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a language..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {languages.map(lang => (
                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Original Text</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="e.g., [[New Delhi]] is the capital of '''India'''."
                        className="min-h-[250px] font-mono"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="space-y-2">
                    <FormLabel>Translated Text</FormLabel>
                    <Textarea
                        readOnly
                        className="min-h-[250px] bg-secondary font-mono"
                        value={translatedText || ''}
                        placeholder="Translation will appear here..."
                    />
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                <><ArrowRightLeft className="mr-2 h-4 w-4" />Translate</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
