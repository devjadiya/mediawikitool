'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { suggestCategory } from '@/ai/flows/suggest-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Tag, Wand2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  image: z.any()
    .refine(files => files?.length > 0, 'Image is required.')
    .refine(files => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      files => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      '.jpg, .png, and .webp files are accepted.'
    ),
});

export function CategorySuggester() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    }
  });

  const handleDemo = async () => {
    form.reset();
    setSuggestedCategories([]);
    setPreview(null);
    try {
        const imageUrl = 'https://placehold.co/500x500.png';
        setPreview(imageUrl); // Show placeholder immediately
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "demo-microscope.png", { type: "image/png" });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const fileList = dataTransfer.files;

        form.setValue('image', fileList);
        
        const isValid = await form.trigger();
        if (isValid) {
            onSubmit(form.getValues());
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
    setSuggestedCategories([]);

    const file = values.image[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const result = await suggestCategory({ photoDataUri: dataUri });
        setSuggestedCategories(result.categories);
      } catch (error) {
        console.error('Error suggesting category:', error);
        toast({
          title: 'Error',
          description: 'Could not suggest categories. Please try again.',
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
      setSuggestedCategories([]);
    } else {
      setPreview(null);
    }
  };

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
             <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline">AI-Powered Category Suggestion</CardTitle>
                <CardDescription>We'll analyze your photo and suggest relevant categories.</CardDescription>
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
            {preview && (
              <div className="mt-4">
                <Image
                  src={preview}
                  alt="Image preview"
                  width={200}
                  height={200}
                  className="rounded-lg mx-auto object-cover aspect-square"
                  data-ai-hint="microscope lab"
                />
              </div>
            )}
            {suggestedCategories.length > 0 && (
                <div className="pt-4">
                    <h3 className="font-semibold mb-2">Suggested Categories:</h3>
                    <div className="flex flex-wrap gap-2">
                    {suggestedCategories.map(cat => (
                        <div key={cat} className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                            <Tag className="h-4 w-4" />
                            <span>{cat}</span>
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
                  Analyzing...
                </>
              ) : (
                'Suggest Categories'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
