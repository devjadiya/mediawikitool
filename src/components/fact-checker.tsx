'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { factCheckText, FactCheckTextOutput } from '@/ai/flows/fact-checker';
import { Button, StatefulButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldQuestion, CheckCircle, XCircle, HelpCircle, Link as LinkIcon, Quote, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const formSchema = z.object({
  text: z.string().min(20, 'Please enter at least 20 characters for fact-checking.'),
});

type ButtonState = 'idle' | 'loading' | 'success' | 'error';
type Claim = FactCheckTextOutput['claims'][0];

const statusConfig = {
    Supported: {
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        badge: "secondary",
        text: "text-green-600"
    },
    Unsupported: {
        icon: <HelpCircle className="h-5 w-5 text-amber-600" />,
        badge: "outline",
        text: "text-amber-600"
    },
    Contradicted: {
        icon: <XCircle className="h-5 w-5 text-destructive" />,
        badge: "destructive",
        text: "text-destructive"
    }
}


export function FactChecker() {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [result, setResult] = useState<FactCheckTextOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  const handleDemo = async () => {
    const demoText = 'The Moon is Earth\'s only natural satellite. The Sun is a planet, not a star.';
    form.setValue('text', demoText);
    await form.trigger('text');
    onSubmit({ text: demoText });
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonState('loading');
    setResult(null);

    try {
      const apiResult = await factCheckText(values);
      setResult(apiResult);
      setButtonState('success');
    } catch (error) {
      console.error('Error fact-checking text:', error);
      toast({
        title: 'Error',
        description: 'Could not perform fact-check. Please try again.',
        variant: 'destructive',
      });
      setButtonState('error');
    } finally {
        setTimeout(() => setButtonState('idle'), 2000);
    }
  };

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline">Fact-Check Article Content</CardTitle>
                <CardDescription>The AI will break the text into claims and attempt to verify each one.</CardDescription>
              </div>
               <Button type="button" variant="outline" size="sm" onClick={handleDemo} disabled={buttonState === 'loading'}>
                <Wand2 className="mr-2 h-4 w-4" />
                Try Demo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text to Analyze</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., The Sun is a star at the center of the Solar System. The Moon is primarily composed of cheese."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold">Analysis Results:</h3>
                <div className="space-y-4">
                  {result.claims.length > 0 ? (
                    result.claims.map((claim, index) => (
                      <Card key={index} className="bg-secondary/50">
                        <CardHeader className="p-4 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                {statusConfig[claim.status].icon}
                                <p className="font-semibold text-lg">{claim.claim}</p>
                            </div>
                           <Badge variant={statusConfig[claim.status].badge}>{claim.status}</Badge>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                            <div className="flex items-start gap-2 text-sm">
                                <Quote className={cn("h-4 w-4 mt-1 flex-shrink-0", statusConfig[claim.status].text)} />
                                <p className="text-muted-foreground">{claim.reasoning}</p>
                            </div>
                            {claim.source && (
                                <div className="flex items-start gap-2 text-sm">
                                    <LinkIcon className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                                    <a href={claim.source} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                                        {claim.source}
                                    </a>
                                </div>
                            )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No verifiable claims were found in the provided text.</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <StatefulButton
              type="submit"
              buttonState={buttonState}
              idleContent={<><ShieldQuestion />Verify Claims</>}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
