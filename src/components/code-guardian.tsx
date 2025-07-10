'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { codeGuardian, CodeGuardianOutput } from '@/ai/flows/code-guardian';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, Zap, Wrench, AlertTriangle, Info, GaugeCircle, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const formSchema = z.object({
  code: z.string().min(20, 'Please enter at least 20 characters of code.'),
  language: z.enum(['Lua', 'JavaScript']),
});

type AnalysisItem = CodeGuardianOutput['security'][0];

const severityConfig = {
    Critical: { icon: <AlertTriangle className="h-4 w-4 text-red-700" />, badge: 'destructive' },
    High: { icon: <AlertTriangle className="h-4 w-4 text-red-500" />, badge: 'destructive' },
    Medium: { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, badge: 'secondary' },
    Low: { icon: <Info className="h-4 w-4 text-blue-500" />, badge: 'outline' },
    Info: { icon: <Info className="h-4 w-4 text-gray-500" />, badge: 'outline' },
};

const AnalysisSection = ({ title, icon, items }: { title: string, icon: React.ReactNode, items: AnalysisItem[] }) => {
    if (items.length === 0) {
        return (
            <div className="p-4 border-dashed border-2 rounded-lg text-center text-muted-foreground">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                No issues found in {title}.
            </div>
        )
    }

    return (
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
                    {icon} {title} <Badge variant="secondary">{items.length}</Badge>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-3 pt-2">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-md border">
                                {severityConfig[item.severity].icon}
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <Badge variant={severityConfig[item.severity].badge}>{item.severity}</Badge>
                                        {item.line && <span className="text-xs font-mono">Line: {item.line}</span>}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};


export function CodeGuardian() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CodeGuardianOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      language: 'JavaScript',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const apiResult = await codeGuardian(values);
      setResult(apiResult);
    } catch (error) {
      console.error('Error analyzing code:', error);
      toast({
        title: 'Error',
        description: 'Could not analyze the code. Please try again.',
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
            <CardTitle className="font-headline">Analyze Code</CardTitle>
            <CardDescription>Paste your MediaWiki JS or Lua code snippet below for a comprehensive analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                     <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Code Snippet</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Paste your code snippet here..."
                                className="min-h-[200px] font-mono"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                <div className="md:col-span-1">
                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                                    <SelectItem value="Lua">Lua</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            
            {result && (
              <div className="pt-4 space-y-6">
                <div>
                    <h3 className="text-xl font-headline font-semibold mb-2">Summary</h3>
                    <p className="text-muted-foreground">{result.explanation}</p>
                </div>
                <div className="space-y-4">
                    <AnalysisSection title="Security" icon={<Shield className="h-5 w-5"/>} items={result.security} />
                    <AnalysisSection title="Performance" icon={<Zap className="h-5 w-5"/>} items={result.performance} />
                    <AnalysisSection title="Best Practices" icon={<Wrench className="h-5 w-5"/>} items={result.bestPractices} />
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
                <><Shield className="mr-2 h-4 w-4" />Analyze Code</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
