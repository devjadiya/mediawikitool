'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { visualizeTrust, VisualizeTrustOutput } from '@/ai/flows/trust-visualizer';
import { searchUsers } from '@/app/actions/wikimedia';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Link as LinkIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command';
import { useDebounce } from '@/hooks/use-debounce';
import { ChartContainer, ChartTooltipContent } from './ui/chart';

const formSchema = z.object({
  username: z.string().min(1, 'Please enter a username.'),
});

const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7300'];
const REVERT_COLORS = ['#FF8042', '#00C49F'];

export function TrustVisualizer() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VisualizeTrustOutput | null>(null);
  const { toast } = useToast();
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  useEffect(() => {
    if (debouncedSearchQuery) {
      const fetchSuggestions = async () => {
        const users = await searchUsers(debouncedSearchQuery);
        setSuggestions(users);
        if (users.length > 0) {
            setIsPopoverOpen(true);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setIsPopoverOpen(false);
    }
  }, [debouncedSearchQuery]);

  const handleSelectSuggestion = (username: string) => {
    form.setValue('username', username);
    setSearchQuery(username);
    setIsPopoverOpen(false);
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsPopoverOpen(false);
    setIsLoading(true);
    setResult(null);

    try {
      const apiResult = await visualizeTrust(values);
      setResult(apiResult);
    } catch (error) {
      console.error('Error visualizing trust:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'Could not fetch user data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (username: string) => {
    startTransition(() => {
      form.setValue('username', username);
      setSearchQuery(username);
      onSubmit({ username });
    });
  };

  const MOCK_REVERT_DATA = result ? [ { name: 'Reverted', value: Math.round(result.revertRate * 100) }, { name: 'Unreverted', value: Math.round((1 - result.revertRate) * 100) } ] : [];

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Visualize User Contributions</CardTitle>
            <CardDescription>Enter a Wikimedia username to generate a visual dashboard of their contribution patterns.</CardDescription>
          </CardHeader>
          <CardContent>
             <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input 
                                            placeholder="e.g., Dev Jadiya" 
                                            {...field} 
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setSearchQuery(e.target.value);
                                            }}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <Button type="submit" disabled={isLoading || isPending} size="icon">
                            {isLoading || isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                    </div>
                </PopoverTrigger>
                 <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                    <Command>
                        <CommandList>
                             {suggestions.length === 0 && debouncedSearchQuery && (
                                <CommandEmpty>No users found.</CommandEmpty>
                            )}
                            <CommandGroup>
                                {suggestions.map((user) => (
                                    <CommandItem
                                        key={user}
                                        value={user}
                                        onSelect={() => handleSelectSuggestion(user)}
                                    >
                                        {user}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {(isLoading || isPending) && <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}
            
            {result && !isPending && (
              <div className="pt-8 space-y-6">
                <div className="p-4 bg-secondary rounded-lg">
                    <h2 className="text-2xl font-bold font-headline">{result.username}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>Project: <span className="font-semibold text-foreground">{result.project}</span></span>
                        <span>Joined: <span className="font-semibold text-foreground">{result.joinDate}</span></span>
                        <span>Total Edits: <span className="font-semibold text-foreground">{result.totalEdits.toLocaleString()}</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contributions by Namespace</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={{}} className="h-[200px] w-full">
                                <PieChart>
                                <Tooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Pie data={result.namespaceData} dataKey="edits" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false}>
                                    {result.namespaceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Revert Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={{}} className="h-[200px] w-full">
                                <PieChart>
                                <Tooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Pie data={MOCK_REVERT_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="name">
                                    {MOCK_REVERT_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={REVERT_COLORS[index % REVERT_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Edited Pages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                {result.topPages.slice(0, 5).map((page) => (
                                    <div key={page.title} className="flex justify-between items-center gap-2">
                                        <a href={`https://${result.project}/wiki/${page.title}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary truncate hover:underline">
                                            <LinkIcon className="h-3 w-3" />
                                            <span className="truncate">{page.title.replace(/_/g, ' ')}</span>
                                        </a>
                                        <span className="font-semibold text-muted-foreground flex-shrink-0">{page.edits.toLocaleString()}</span>
                                    </div>
                                ))}
                                {result.topPages.length === 0 && <p className="text-muted-foreground">No top pages found.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Activity Timeline (Last 12 Months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={result.monthlyEdits}>
                                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Line type="monotone" dataKey="edits" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
