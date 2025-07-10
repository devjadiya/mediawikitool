
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { validateImage } from '@/ai/flows/validate-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, CheckCircle, XCircle, MessageSquareQuote, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  image: z.any()
    .refine(files => files?.length > 0, 'Image is required.')
    .refine(files => files?.[0]?.size <= 5000000, `Max file size is 5MB.`),
});

type ValidationResult = {
  hasWatermark: boolean;
  isClear: boolean;
  feedback: string;
}

export function ImageValidator() {
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
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
    setValidationResult(null);
    setPreview(null);
    try {
        const imageUrl = 'https://picsum.photos/400/400';
        setPreview(imageUrl); 
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "demo-image.png", { type: blob.type });

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
    setValidationResult(null);

    const file = values.image[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const result = await validateImage({ photoDataUri: dataUri });
        setValidationResult(result);
      } catch (error) {
        console.error('Error validating image:', error);
        toast({
          title: 'Error',
          description: 'Could not validate the image. Please try again.',
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
      setValidationResult(null);
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
                <CardTitle className="font-headline">Upload for Validation</CardTitle>
                <CardDescription>We'll check for common issues like watermarks and image clarity.</CardDescription>
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
                />
              </div>
            )}
            {validationResult && (
                <div className="pt-4 space-y-4">
                    <h3 className="font-semibold mb-2">Validation Results:</h3>
                    <div className="space-y-3">
                        <div className={cn("flex items-center gap-3 p-3 rounded-md", validationResult.hasWatermark ? 'bg-destructive/10' : 'bg-green-600/10')}>
                            {validationResult.hasWatermark ? <XCircle className="h-5 w-5 text-destructive" /> : <CheckCircle className="h-5 w-5 text-green-600" />}
                            <div>
                                <h4 className="font-semibold">Watermark Check</h4>
                                <p className="text-sm text-muted-foreground">{validationResult.hasWatermark ? "Potential watermark or text detected. Submissions should not have watermarks." : "No watermarks detected. Good to go!"}</p>
                            </div>
                        </div>
                        <div className={cn("flex items-center gap-3 p-3 rounded-md", !validationResult.isClear ? 'bg-destructive/10' : 'bg-green-600/10')}>
                            {!validationResult.isClear ? <XCircle className="h-5 w-5 text-destructive" /> : <CheckCircle className="h-5 w-5 text-green-600" />}
                            <div>
                                <h4 className="font-semibold">Clarity Check</h4>
                                <p className="text-sm text-muted-foreground">{!validationResult.isClear ? "The subject may not be perfectly clear or in focus." : "Image appears clear and in focus."}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-md bg-secondary">
                            <MessageSquareQuote className="h-5 w-5 text-secondary-foreground mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold">AI Feedback</h4>
                                <p className="text-sm text-muted-foreground">{validationResult.feedback}</p>
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
                  Validating...
                </>
              ) : (
                'Validate Image'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
