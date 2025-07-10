'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generatePrizes } from '@/ai/flows/generate-prizes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Telescope, Microscope, FlaskConical, Camera, BookOpenCheck, Zap } from 'lucide-react';
import { categories } from '@/lib/data';

const formSchema = z.object({
  category: z.string().min(1, 'Please select a category.'),
});

type PrizeIdea = {
  name: string;
  description: string;
  icon: 'Telescope' | 'Microscope' | 'FlaskConical' | 'Camera' | 'BookOpenCheck';
}

const iconMap = {
  Telescope: <Telescope className="h-8 w-8 text-primary" />,
  Microscope: <Microscope className="h-8 w-8 text-primary" />,
  FlaskConical: <FlaskConical className="h-8 w-8 text-primary" />,
  Camera: <Camera className="h-8 w-8 text-primary" />,
  BookOpenCheck: <BookOpenCheck className="h-8 w-8 text-primary" />,
};

export function PrizeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [prizeIdeas, setPrizeIdeas] = useState<PrizeIdea[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setPrizeIdeas([]);
    try {
      const result = await generatePrizes({ category: values.category });
      setPrizeIdeas(result.prizes);
    } catch (error) {
      console.error('Error generating prizes:', error);
      toast({
        title: 'Error',
        description: 'Could not generate prize ideas. Please try again.',
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
            <CardTitle className="font-headline">Generate Prize Ideas</CardTitle>
            <CardDescription>Select a category to brainstorm some creative, science-themed prizes.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competition Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {prizeIdeas.length > 0 && (
                <div className="pt-6">
                    <h3 className="font-semibold mb-4 text-center">Here are some ideas!</h3>
                    <div className="grid grid-cols-1 gap-4">
                    {prizeIdeas.map((idea, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-secondary rounded-lg">
                            <div className="flex-shrink-0">{iconMap[idea.icon]}</div>
                            <div>
                                <h4 className="font-bold">{idea.name}</h4>
                                <p className="text-sm text-muted-foreground">{idea.description}</p>
                            </div>
                        </div>
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
                  Brainstorming...
                </>
              ) : (
                <><Zap className="mr-2 h-4 w-4" />Generate Ideas</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
