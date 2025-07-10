'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { pageviewPredictor, PageviewPredictorOutput } from '@/ai/flows/pageview-predictor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, TrendingUp, PlusCircle, X, Trophy, CheckCircle, Percent, BarChart } from 'lucide-react';
import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from './ui/chart';
import { Badge } from './ui/badge';

const formSchema = z.object({
  image: z.any().refine(files => files?.length > 0, 'Image is required.'),
  articleTitles: z.array(z.object({ value: z.string().min(1, "Article title can't be empty.") })).min(2, "Please provide at least two articles to compare."),
});

export function PageviewPredictor() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PageviewPredictorOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleTitles: [{ value: 'Tiger' }, { value: 'Bengal tiger' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "articleTitles",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    const file = values.image[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const result = await pageviewPredictor({
          photoDataUri: dataUri,
          articleTitles: values.articleTitles.map(t => t.value),
        });
        setResult(result);
      } catch (error) {
        console.error('Error predicting pageviews:', error);
        toast({
          title: 'Error',
          description: (error as Error).message || 'Could not get a prediction. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setResult(null);
    } else {
      setPreview(null);
    }
  };
  
  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="font-headline">Analyze Image Impact</CardTitle>
            <CardDescription>Upload an image and provide article titles to find the best fit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image to Analyze</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            className="pl-12"
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              handleFileChange(e);
                            }}
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {preview && (
                  <div className="mt-4 flex justify-center">
                    <Image
                      src={preview}
                      alt="Image preview"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover aspect-square"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <FormLabel>Article Titles to Compare</FormLabel>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                    <FormField
                        key={field.id}
                        control={form.control}
                        name={`articleTitles.${index}.value`}
                        render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                            <Input {...field} placeholder={`Article Title ${index + 1}`} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 2}>
                                <X className="h-4 w-4" />
                            </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })} disabled={fields.length >= 5}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Article (Max 5)
                </Button>
              </div>
            </div>

            {result && (
              <div className="pt-6 space-y-4">
                <Card className="bg-primary/10 border-primary">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Trophy className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle className="text-xl">Recommendation: "{result.recommendation}"</CardTitle>
                                <CardDescription className="text-primary/80">{result.reasoning}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                    {result.analysis.map((item, index) => (
                        <Card key={index} className="bg-secondary/50">
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="flex justify-around text-center text-sm">
                                    <div>
                                        <p className="font-bold text-lg">{item.totalViews.toLocaleString()}</p>
                                        <p className="text-muted-foreground">Monthly Views</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{(item.relevanceScore * 100).toFixed(0)}%</p>
                                        <p className="text-muted-foreground">Relevance</p>
                                    </div>
                               </div>
                               <div>
                                 <h4 className="text-sm font-medium mb-2 text-center">Last 30 Days Traffic</h4>
                                 <ChartContainer config={{}} className="w-full h-[150px]">
                                    <LineChart data={item.pageviews} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                        <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ChartContainer>
                               </div>
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
                  Analyzing...
                </>
              ) : (
                <><TrendingUp className="mr-2 h-4 w-4" />Predict Impact</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
