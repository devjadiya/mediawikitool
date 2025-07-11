'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { locateObjects, LocateObjectsOutput } from '@/ai/flows/object-locator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Locate, Wand2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  image: z.any()
    .refine(files => files?.length > 0, 'Image is required.')
    .refine(files => files?.[0]?.size <= 5000000, `Max file size is 5MB.`),
});

type LocatedObject = LocateObjectsOutput['objects'][0];

const BOX_COLORS = [
    'border-red-500', 'border-blue-500', 'border-green-500', 
    'border-yellow-500', 'border-purple-500', 'border-pink-500', 'border-cyan-500', 'border-orange-500'
];

export function ObjectLocator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LocateObjectsOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    }
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            setImageDimensions({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            });
        }
    });

    if (imageRef.current) {
        resizeObserver.observe(imageRef.current);
    }

    return () => {
        resizeObserver.disconnect();
    };
}, [preview, result]);

  const handleDemo = async () => {
    setIsLoading(true);
    setResult(null);
    form.reset();
    
    const imageUrl = `https://picsum.photos/800/600?random=${new Date().getTime()}`;
    setPreview(imageUrl);

    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "demo-image.jpg", { type: 'image/jpeg' });

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const fileList = dataTransfer.files;

        form.setValue('image', fileList);
        await onSubmit(form.getValues());
    } catch(e) {
        toast({
            title: 'Demo Error',
            description: 'Could not fetch the demo image. Please try again.',
            variant: 'destructive',
        });
        setIsLoading(false);
    }
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    const file = values.image[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const result = await locateObjects({ photoDataUri: dataUri });
        setResult(result);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Could not locate objects in the image. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
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
      setResult(null);
    } else {
      setPreview(null);
    }
  };

  const renderBoundingBoxLabel = (obj: LocatedObject, colorClass: string, index: number) => {
    const labelContent = (
      <span className={`text-xs text-white px-1.5 py-0.5 rounded-sm ${colorClass.replace('border-', 'bg-')}`}>
        {index + 1}. {obj.label}
      </span>
    );
    if (obj.wikidataId) {
      return (
        <a href={`https://www.wikidata.org/wiki/${obj.wikidataId}`} target="_blank" rel="noopener noreferrer" className="absolute -top-5 left-0 hover:z-20 transition-transform hover:scale-110">
            {labelContent}
        </a>
      );
    }
    return (
        <div className="absolute -top-5 left-0 z-10">
            {labelContent}
        </div>
    );
  };

  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
             <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline">Locate & Identify Objects</CardTitle>
                    <CardDescription>Upload an image to detect objects and see their bounding boxes.</CardDescription>
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
              <div className="mt-4 flex justify-center items-center">
                <div className="relative w-full max-w-2xl" style={{ width: imageDimensions.width, height: imageDimensions.height }}>
                    <Image
                        ref={imageRef}
                        src={preview}
                        alt="Image preview"
                        layout="fill"
                        className="rounded-lg object-contain"
                        onLoad={(e) => {
                            const img = e.currentTarget;
                            setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                        }}
                        key={preview}
                    />
                    {result && result.objects.map((obj, index) => {
                        const [x_min, y_min, x_max, y_max] = obj.box;
                        const colorClass = BOX_COLORS[index % BOX_COLORS.length];
                        const style = {
                            position: 'absolute',
                            left: `${x_min * 100}%`,
                            top: `${y_min * 100}%`,
                            width: `${(x_max - x_min) * 100}%`,
                            height: `${(y_max - y_min) * 100}%`,
                        } as React.CSSProperties;
                        return (
                            <div key={index} style={style} className={`border-2 ${colorClass} transition-all duration-300`}>
                               {renderBoundingBoxLabel(obj, colorClass, index)}
                            </div>
                        )
                    })}
                 </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !preview} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <><Locate className="mr-2 h-4 w-4" />Locate Objects</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
