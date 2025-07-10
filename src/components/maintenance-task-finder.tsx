'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { findMaintenanceTasks, FindMaintenanceTasksOutput } from '@/ai/flows/find-maintenance-tasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wrench, Link as LinkIcon } from 'lucide-react';

const formSchema = z.object({
  taskType: z.enum(['Uncategorizedpages', 'Shortpages'], {
      required_error: "Please select a task type."
  }),
});

export function MaintenanceTaskFinder() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FindMaintenanceTasksOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    try {
      const apiResult = await findMaintenanceTasks({ taskType: values.taskType, limit: 20 });
      setResult(apiResult);
    } catch (error) {
      console.error('Error finding maintenance tasks:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch tasks. The API might be busy, please try again.',
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
            <CardTitle className="font-headline">Find Maintenance Tasks</CardTitle>
            <CardDescription>Select a task type to get a list of articles on Hindi Wikipedia that need edits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="taskType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type of task..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Uncategorizedpages">Uncategorized Pages</SelectItem>
                      <SelectItem value="Shortpages">Short Pages</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {result && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold text-lg">Pages to Edit:</h3>
                {result.pages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result.pages.map((page, index) => (
                             <a
                                key={index}
                                href={page.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4 text-primary" />
                                    <p className="font-medium truncate">{page.title}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground p-4 bg-secondary rounded-lg">
                        No pages found for this task type. Good job, community!
                    </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Tasks...
                </>
              ) : (
                <><Wrench className="mr-2 h-4 w-4" />Find Pages</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
