'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { propertySuggester, PropertySuggesterOutput } from '@/ai/flows/property-suggester';
import { Button, StatefulButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ListPlus, Wand2, Info, Copy, Link as LinkIcon } from 'lucide-react';
import { Badge } from './ui/badge';

const formSchema = z.object({
  qId: z.string().regex(/^Q\d+$/, "Please enter a valid Wikidata Q-ID (e.g., Q42)."),
});

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export function PropertySuggester() {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [result, setResult] = useState<PropertySuggesterOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qId: '',
    },
  });

  const handleDemoClick = () => {
    form.setValue('qId', 'Q42'); // Douglas Adams
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonState('loading');
    setResult(null);

    try {
      const apiResult = await propertySuggester(values);
      setResult(apiResult);
      setButtonState('success');
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Could not fetch suggestions. Please check the Q-ID and try again.',
        variant: 'destructive',
      });
      setButtonState('error');
    } finally {
        setTimeout(() => setButtonState('idle'), 2000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `Property ID ${text} copied to clipboard.` });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Suggest Properties</CardTitle>
                <CardDescription>Enter a Wikidata item ID to find missing properties.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleDemoClick} disabled={buttonState === 'loading'}>
                <Wand2 className="mr-2 h-4 w-4" />
                Try Demo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="qId"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Wikidata Item ID</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., Q42" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />

            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold text-lg">Suggestions for {result.itemLabel}:</h3>
                 <div className="space-y-3">
                    {result.suggestions.length > 0 ? (
                        result.suggestions.map((prop) => (
                            <Card key={prop.propertyId} className="bg-secondary/50">
                                <CardContent className="p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <a href={`https://www.wikidata.org/wiki/Property:${prop.propertyId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                            <LinkIcon className="h-4 w-4" />
                                            <p className="font-semibold">{prop.propertyLabel}</p>
                                        </a>
                                        <div className="flex items-center gap-1">
                                            <Badge variant="outline">{prop.propertyId}</Badge>
                                             <Button type="button" size="icon" variant="ghost" onClick={() => copyToClipboard(prop.propertyId)}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <p>{prop.reasoning}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center">No obvious properties seem to be missing. This item is well-described!</p>
                    )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <StatefulButton
              type="submit"
              buttonState={buttonState}
              idleContent={<><ListPlus className="h-4 w-4" />Suggest Properties</>}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
