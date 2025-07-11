'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { itemMergerSuggester, ItemMergerSuggesterOutput } from '@/ai/flows/item-merger-suggester';
import { Button, StatefulButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { GitMerge, Wand2, CheckCircle, XCircle, HelpCircle, Info } from 'lucide-react';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

const formSchema = z.object({
  item1Id: z.string().regex(/^Q\d+$/, "Please enter a valid Wikidata Q-ID (e.g., Q42)."),
  item2Id: z.string().regex(/^Q\d+$/, "Please enter a valid Wikidata Q-ID (e.g., Q2)."),
});

type ButtonState = 'idle' | 'loading' | 'success' | 'error';
type Recommendation = ItemMergerSuggesterOutput['recommendation'];

const recommendationConfig: Record<Recommendation, { icon: React.ReactNode, badge: 'destructive' | 'secondary' | 'outline' }> = {
    'Merge': { icon: <CheckCircle className="h-6 w-6 text-green-500" />, badge: 'secondary' },
    'Do Not Merge': { icon: <XCircle className="h-6 w-6 text-red-500" />, badge: 'destructive' },
    'Uncertain': { icon: <HelpCircle className="h-6 w-6 text-yellow-500" />, badge: 'outline' },
};


export function ItemMergerSuggester() {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [result, setResult] = useState<ItemMergerSuggesterOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item1Id: '',
      item2Id: '',
    },
  });

  const handleDemoClick = () => {
    form.setValue('item1Id', 'Q243'); // Eiffel Tower
    form.setValue('item2Id', 'Q83133'); // La Tour Eiffel (redirects)
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonState('loading');
    setResult(null);

    try {
      const apiResult = await itemMergerSuggester(values);
      setResult(apiResult);
      setButtonState('success');
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Could not compare the items. Please try again.',
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
                <CardTitle>Suggest Item Merge</CardTitle>
                <CardDescription>Enter two Wikidata Q-IDs to get a merge recommendation.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleDemoClick} disabled={buttonState === 'loading'}>
                <Wand2 className="mr-2 h-4 w-4" />
                Try Demo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="item1Id"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Wikidata Item 1 ID</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Q42" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="item2Id"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Wikidata Item 2 ID</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Q2" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
            </div>

            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold text-lg">Merge Analysis:</h3>
                <Card className="bg-secondary/20 dark:bg-secondary/50">
                    <CardHeader className="flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            {recommendationConfig[result.recommendation].icon}
                            <h4 className="text-xl font-bold">{result.recommendation}</h4>
                        </div>
                        <Badge variant={recommendationConfig[result.recommendation].badge}>{Math.round(result.confidence * 100)}% Confidence</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-2 text-sm">
                            <Info className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                            <p className="text-muted-foreground">{result.reasoning}</p>
                        </div>
                         <div>
                            <p className="text-sm font-medium mb-2">Statement Comparison</p>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Item 1 Value</TableHead>
                                        <TableHead>Item 2 Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {result.comparison.map((row, index) => (
                                        <TableRow key={index} className={!row.areConsistent ? 'bg-destructive/10' : ''}>
                                            <TableCell className="font-medium">{row.property}</TableCell>
                                            <TableCell>{row.item1Value}</TableCell>
                                            <TableCell>{row.item2Value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </div>
                    </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <StatefulButton
              type="submit"
              buttonState={buttonState}
              idleContent={<><GitMerge className="h-4 w-4" />Analyze Items</>}
            />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
