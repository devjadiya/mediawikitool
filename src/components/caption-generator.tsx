
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateCaption } from '@/ai/flows/generate-caption';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Pilcrow, Type, Wand2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  image: z.any()
    .refine(files => files?.length > 0, 'Image is required.')
    .refine(files => files?.[0]?.size <= 5000000, `Max file size is 5MB.`),
  context: z.string().optional(),
});

type AIGeneratedContent = {
  title: string;
  description: string;
}

export function CaptionGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent | null>(null);
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
    form.setValue('context', '');

    try {
        const imageUrl = 'https://picsum.photos/600/400';
        setPreview(imageUrl);
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "demo-image.png", { type: blob.type });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const fileList = dataTransfer.files;

        form.setValue('image', fileList);
        await form.trigger('image');
        
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
    setGeneratedContent(null);

    const file = values.image[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const result = await generateCaption({ photoDataUri: dataUri, context: values.context });
        setGeneratedContent(result);
      } catch (error) {
        console.error('Error generating caption:', error);
        toast({
          title: 'Error',
          description: 'Could not generate caption. Please try again.',
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

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
             <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline">Generate Title & Description</CardTitle>
                <CardDescription>Upload an image and add optional context to get a great title and description.</CardDescription>
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
                      placeholder="e.g., 'This is a micrograph of a human cheek cell stained with methylene blue.'"
                      {...field}
                    />
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
                  width={300}
                  height={200}
                  className="rounded-lg object-cover aspect-video"
                />
              </div>
            )}
            {generatedContent && (
                <div className="pt-4 space-y-4">
                    <h3 className="font-semibold mb-2">Generated Content:</h3>
                    <div className="space-y-2">
                        <div className="flex items-start gap-3">
                            <Type className="h-5 w-5 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold">Title</h4>
                                <p className="text-muted-foreground">{generatedContent.title}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Pilcrow className="h-5 w-5 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold">Description</h4>
                                <p className="text-muted-foreground">{generatedContent.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Content'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
