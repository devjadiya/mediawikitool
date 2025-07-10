'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { visualizeTrust, VisualizeTrustOutput } from '@/ai/flows/trust-visualizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';

const formSchema = z.object({
  username: z.string().min(1, 'Please enter a username.'),
});

const MOCK_NAMESPACE_DATA = [
    { name: 'Main', value: 400 },
    { name: 'User', value: 300 },
    { name: 'Talk', value: 300 },
    { name: 'Template', value: 200 },
];
const MOCK_ACTIVITY_DATA = [
  { name: 'Jan', edits: 30 }, { name: 'Feb', edits: 45 }, { name: 'Mar', edits: 80 },
  { name: 'Apr', edits: 50 }, { name: 'May', edits: 95 }, { name: 'Jun', edits: 120 },
];
const MOCK_REVERT_DATA = [ { name: 'Reverted', value: 13 }, { name: 'Unreverted', value: 87 } ];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const REVERT_COLORS = ['#FF8042', '#00C49F'];

export function TrustVisualizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VisualizeTrustOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    try {
      const apiResult = await visualizeTrust(values);
      setResult(apiResult);
    } catch (error) {
      console.error('Error visualizing trust:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch user data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Visualize User Contributions</CardTitle>
            <CardDescription>Enter a Wikimedia username to generate a full visual dashboard of their contribution patterns.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormControl>
                        <Input placeholder="e.g., Dev Jadiya" {...field} />
                    </FormControl>
                    <Button type="submit" disabled={isLoading} size="icon">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading && <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}
            
            {result && (
              <div className="pt-8 space-y-6">
                 {/* User Header */}
                <div className="p-4 bg-secondary rounded-lg">
                    <h2 className="text-2xl font-bold font-headline">{result.username}</h2>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Project: <span className="font-semibold">{result.project}</span></span>
                        <span>Joined: <span className="font-semibold">{result.joinDate}</span></span>
                        <span>Total Edits: <span className="font-semibold">{result.totalEdits.toLocaleString()}</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Namespace Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contributions by Namespace</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                <Pie data={MOCK_NAMESPACE_DATA} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                                    {MOCK_NAMESPACE_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                     {/* Revert Analysis */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revert Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                <Pie data={MOCK_REVERT_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                    {MOCK_REVERT_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={REVERT_COLORS[index % REVERT_COLORS.length]} />
                                    ))}
                                </Pie>
                                 <Tooltip />
                                <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Top Edited Categories */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Edited Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {result.topCategories.map((cat, i) => (
                                    <li key={i} className="flex justify-between">
                                        <span>{cat.name}</span>
                                        <span className="font-semibold text-muted-foreground">{cat.pages} pages</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Edit Activity Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Activity Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={MOCK_ACTIVITY_DATA}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="edits" stroke="#8884d8" activeDot={{ r: 8 }} />
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
