
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { suggestDepicts, SuggestDepictsOutput } from '@/ai/flows/suggest-depicts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Database, Wand2, Copy, Link as LinkIcon, Info } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  image: z.any()
    .refine(files => files?.length > 0, 'Image is required.')
    .refine(files => files?.[0]?.size <= 5000000, `Max file size is 5MB.`),
  context: z.string().optional(),
});

export function DepictsSuggester() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<SuggestDepictsOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      context: '',
    }
  });

  const handleDemo = async () => {
    form.reset();
    setGeneratedContent(null);
    setPreview(null);
    form.setValue('context', 'A cute puppy in a field');

    try {
        const imageUrl = 'https://picsum.photos/600/400';
        setPreview(imageUrl);
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "demo-image.jpg", { type: blob.type });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const fileList = dataTransfer.files;

        form.setValue('image', fileList);
        await form.trigger('image');
        
        const isValid = await form.trigger();
        if (isValid) {
            await onSubmit(form.getValues());
        }
    } catch(e) {
        toast({
            title: 'Demo Error',
            description: 'Could not fetch the demo image. Please try again.',
            variant: 'destructive',
        });
    }
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setGeneratedContent(null);

    const file = values.image[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const result = await suggestDepicts({ photoDataUri: dataUri, context: values.context });
        setGeneratedContent(result);
      } catch (error) {
        console.error('Error suggesting depicts statements:', error);
        toast({
          title: 'Error',
          description: 'Could not generate suggestions. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
        console.error('Error reading file');
        toast({
          title: 'File Read Error',
          description: 'There was an error reading your image file.',
          variant: 'destructive',
        });
        setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setGeneratedContent(null);
    } else {
      setPreview(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: `${text} copied to clipboard.` });
  }

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
             <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline">Suggest "Depicts" Statements</CardTitle>
                    <CardDescription>Upload an image to get structured data suggestions.</CardDescription>
                </div>
                 <Button type="button" variant="outline" size="sm" onClick={handleDemo} disabled={isLoading}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Try Demo
                </Button>
            </div>
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
                        accept="image/png, image/jpeg, image/webp"
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
                      placeholder="e.g., 'Photo of the Eiffel Tower in Paris at sunset.'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center gap-4 items-center">
                {preview && (
                    <div className="mt-4">
                        <Image
                        src={preview}
                        alt="Image preview"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover aspect-video"
                        data-ai-hint="eiffel tower"
                        />
                    </div>
                )}
                {generatedContent && (
                    <div className="pt-4 space-y-4 flex-1">
                        <h3 className="font-semibold mb-2 text-center">Suggested Statements</h3>
                        <div className="space-y-2">
                            {generatedContent.depictedItems.length > 0 ? generatedContent.depictedItems.map(item => (
                                <Card key={item.wikidataId} className="bg-secondary/50">
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-center">
                                            <a href={`https://www.wikidata.org/wiki/${item.wikidataId}`} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{item.label}</a>
                                            <div className="flex items-center gap-2">
                                                <p className="font-mono text-xs bg-background px-2 py-1 rounded">{item.wikidataId}</p>
                                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(item.wikidataId)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
                                            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                            <p>{item.reasoning}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : <p className="text-muted-foreground text-center">No specific entities could be identified.</p>}
                        </div>
                    </div>
                )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <><Database className="mr-2 h-4 w-4" />Generate Statements</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
