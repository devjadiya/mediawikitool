'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { anonymizeText } from '@/ai/flows/anonymize-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters to anonymize.'),
});

export function TextAnonymizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [anonymizedText, setAnonymizedText] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAnonymizedText(null);

    try {
      const result = await anonymizeText({ text: values.text });
      setAnonymizedText(result.anonymizedText);
    } catch (error) {
      console.error('Error anonymizing text:', error);
      toast({
        title: 'Error',
        description: 'Could not anonymize the text. Please try again.',
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
            <CardTitle className="font-headline">Anonymize Text</CardTitle>
            <CardDescription>Paste your text below to find and redact PII.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Contact John Doe at john.doe@email.com or 192.168.1.1 for details...'"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {anonymizedText && (
              <div className="pt-4">
                <FormItem>
                  <FormLabel>Anonymized Text</FormLabel>
                  <FormControl>
                    <Textarea
                      readOnly
                      className="min-h-[150px] bg-secondary"
                      value={anonymizedText}
                    />
                  </FormControl>
                </FormItem>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Anonymizing...
                </>
              ) : (
                <><ShieldCheck className="mr-2 h-4 w-4" />Anonymize</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
