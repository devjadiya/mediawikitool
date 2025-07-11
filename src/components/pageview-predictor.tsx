
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getPageviews } from '@/services/wikimedia';
import { predictPageviews, PredictPageviewsOutput } from '@/ai/flows/pageview-predictor';
import { Button, StatefulButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Eye, Wand2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartTooltipContent } from './ui/chart';

const formSchema = z.object({
  articleTitles: z.string().min(3, 'Please enter at least one article title.'),
});

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export function PageviewPredictor() {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [result, setResult] = useState<PredictPageviewsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleTitles: '',
    },
  });
  
  const handleDemoClick = () => {
    form.setValue('articleTitles', 'India, Cricket World Cup');
    form.handleSubmit(onSubmit)();
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonState('loading');
    setResult(null);

    try {
      const pageNames = values.articleTitles.split(',').map(name => name.trim()).filter(Boolean);
      if (pageNames.length === 0) {
        toast({ title: 'Invalid Input', description: 'Please enter at least one article title.', variant: 'destructive' });
        setButtonState('idle');
        return;
      }
      
      const historicalData = await getPageviews({ pageNames });
      if (historicalData.length === 0) {
          toast({ title: 'No Data Found', description: 'Could not fetch historical pageview data for the given articles. Please check the titles.', variant: 'destructive' });
          setButtonState('idle');
          return;
      }

      const prediction = await predictPageviews({ historicalData });
      setResult(prediction);
      setButtonState('success');
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Could not generate prediction. Please try again.',
        variant: 'destructive',
      });
      setButtonState('error');
    } finally {
        setTimeout(() => setButtonState('idle'), 2000);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Predict Pageviews</CardTitle>
                <CardDescription>Enter up to 5 comma-separated article titles to see historical data and a 3-month prediction.</CardDescription>
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
              name="articleTitles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Titles</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., India, Cricket World Cup, Taylor Swift" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {result && (
                <div className="pt-4 space-y-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Pageview Trends and Prediction</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={result.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    {result.predictions.map((p, index) => (
                                        <Line key={p.title} type="monotone" dataKey={p.title} stroke={`hsl(var(--chart-${index + 1}))`} />
                                    ))}
                                    {result.predictions.map((p, index) => (
                                        <Line key={`${p.title}-predicted`} type="monotone" dataKey={`${p.title} (predicted)`} stroke={`hsl(var(--chart-${index + 1}))`} strokeDasharray="5 5" />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                     </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.predictions.map((p, index) => (
                            <Card key={p.title} className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="text-lg" style={{ color: `hsl(var(--chart-${index + 1}))` }}>{p.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{p.analysis}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                </div>
            )}
          </CardContent>
          <CardFooter>
            <StatefulButton
              type="submit"
              buttonState={buttonState}
              idleContent={<><Eye className="h-4 w-4" />Generate Prediction</>}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
