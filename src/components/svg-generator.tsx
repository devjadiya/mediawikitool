'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateSvg } from '@/ai/flows/generate-svg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileType, Copy } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(5, 'Please describe the icon in at least 5 characters.'),
});

export function SvgGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [svgCode, setSvgCode] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSvgCode(null);

    try {
      const result = await generateSvg(values);
      setSvgCode(result.svgCode);
    } catch (error) {
      console.error('Error generating SVG:', error);
      toast({
        title: 'Error',
        description: 'Could not generate the SVG. Please try a different description.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'SVG code copied to clipboard.' });
  }

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="font-headline">SVG Generator</CardTitle>
            <CardDescription>Describe an icon to generate simple SVG code.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A shield with a checkmark inside" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {svgCode && (
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold">Preview:</h3>
                    <div className="w-full h-48 flex items-center justify-center bg-secondary rounded-md p-4">
                        <div className="h-24 w-24 text-primary" dangerouslySetInnerHTML={{ __html: svgCode }} />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">SVG Code:</h3>
                        <Button type="button" size="sm" variant="ghost" onClick={() => copyToClipboard(svgCode)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                        </Button>
                    </div>
                    <Textarea readOnly value={svgCode} className="h-48 font-mono text-xs" />
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
                <><FileType className="mr-2 h-4 w-4" />Generate SVG</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
