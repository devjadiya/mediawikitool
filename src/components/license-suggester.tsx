'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { suggestLicense, SuggestLicenseOutput } from '@/ai/flows/suggest-license';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, ShieldCheck, Link as LinkIcon, Lightbulb } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  image: z.any()
    .refine(files => files?.length > 0, 'Image is required.'),
  context: z.string().optional(),
});

export function LicenseSuggester() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestLicenseOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      context: '',
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSuggestions(null);

    const file = values.image[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const result = await suggestLicense({ photoDataUri: dataUri, context: values.context });
        setSuggestions(result);
      } catch (error) {
        console.error('Error suggesting license:', error);
        toast({
          title: 'Error',
          description: 'Could not suggest a license. Please try again.',
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
      const url = URL.createObjectURL(file);
      setPreview(url);
      setSuggestions(null);
    } else {
      setPreview(null);
    }
  };

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="font-headline">License Suggester</CardTitle>
            <CardDescription>Upload an image to get license suggestions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image File</FormLabel>
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
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optional Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'This is a photo I took of the Eiffel Tower.' or 'This is a derivative work of a 17th-century painting.'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {preview && (
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Image preview"
                  width={200}
                  height={200}
                  className="rounded-lg mx-auto object-cover aspect-square"
                />
              </div>
            )}
            {suggestions && (
                <div className="pt-4 space-y-4">
                    <h3 className="font-semibold mb-2">Suggested Licenses:</h3>
                    <div className="space-y-3">
                        {suggestions.suggestedLicenses.map((license, index) => (
                           <Card key={index} className="bg-secondary">
                             <CardContent className="p-4 space-y-2">
                                <h4 className="font-bold">{license.name}</h4>
                                <div className="flex items-start gap-2">
                                    <Lightbulb className="h-4 w-4 mt-1 flex-shrink-0 text-yellow-500" />
                                    <p className="text-sm text-muted-foreground">{license.rationale}</p>
                                </div>
                                <a href={license.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                                    <LinkIcon className="h-4 w-4" />
                                    <span>Read full license</span>
                                </a>
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
                <><ShieldCheck className="mr-2 h-4 w-4" />Suggest License</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
