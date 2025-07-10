'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { checkNotability, CheckNotabilityOutput } from '@/ai/flows/check-notability';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BadgeCheck, CheckCircle, XCircle, HelpCircle, Link as LinkIcon, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic to check for notability.'),
});

type Assessment = CheckNotabilityOutput['assessment'];

const assessmentConfig: Record<Assessment, { icon: React.ReactNode, color: string, badge: any }> = {
    'Likely Notable': {
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        color: 'text-green-600',
        badge: 'secondary',
    },
    'Possibly Notable': {
        icon: <HelpCircle className="h-5 w-5 text-amber-600" />,
        color: 'text-amber-600',
        badge: 'outline',
    },
    'Unlikely to be Notable': {
        icon: <XCircle className="h-5 w-5 text-destructive" />,
        color: 'text-destructive',
        badge: 'destructive',
    }
}


export function NotabilityChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CheckNotabilityOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    try {
      const apiResult = await checkNotability(values);
      setResult(apiResult);
    } catch (error) {
      console.error('Error checking notability:', error);
      toast({
        title: 'Error',
        description: 'Could not perform the notability check. Please try again.',
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
            <CardTitle className="font-headline">Check Notability</CardTitle>
            <CardDescription>The AI will search for sources to assess if a topic is notable.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Samrat Ashok Technological Institute" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg">Notability Assessment:</h3>
                 <Card className="bg-secondary/50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                {assessmentConfig[result.assessment].icon}
                                <span className={cn("font-bold", assessmentConfig[result.assessment].color)}>{result.assessment}</span>
                             </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                             <p className="text-sm font-medium mb-1">Reasoning</p>
                             <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                        </div>
                         <div>
                            <p className="text-sm font-medium mb-2">Potential Sources Found</p>
                            <div className="space-y-3">
                                {result.sources.map((source, index) => (
                                    <div key={index} className="border p-3 rounded-md bg-background">
                                         <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-start gap-2">
                                            <LinkIcon className="h-4 w-4 mt-1 flex-shrink-0" />
                                            <span className="font-semibold">{source.title}</span>
                                        </a>
                                        <div className="flex items-center gap-4 mt-2">
                                            <Badge variant={source.isReliable ? 'secondary' : 'destructive'}>
                                                {source.isReliable ? 'Reliable' : 'Unreliable'}
                                            </Badge>
                                             <Badge variant={source.isIndependent ? 'secondary' : 'outline'}>
                                                {source.isIndependent ? 'Independent' : 'Not Independent'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {result.sources.length === 0 && <p className="text-sm text-muted-foreground">No significant sources were found.</p>}
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
                  Assessing...
                </>
              ) : (
                <><BadgeCheck className="mr-2 h-4 w-4" />Check Notability</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
