'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { locateObjects, LocateObjectsOutput } from '@/ai/flows/object-locator';
import { searchWikidata, WikidataSearchOutput } from '@/ai/flows/search-wikidata';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Locate, Wand2, Search, Link as LinkIcon, Info } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  image: z.any()
    .refine(files => files?.length > 0, 'Image is required.')
    .refine(files => files?.[0]?.size <= 5000000, `Max file size is 5MB.`),
});

type LocatedObject = LocateObjectsOutput['objects'][0];
type WikidataEntity = WikidataSearchOutput['results'][0];

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

  const [wikidataResults, setWikidataResults] = useState<Record<string, WikidataEntity[]>>({});
  const [searchingFor, setSearchingFor] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    }
  });

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
    setWikidataResults({});

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
      setWikidataResults({});
    } else {
      setPreview(null);
    }
  };
  
  const handleWikidataSearch = async (objectToSearch: LocatedObject) => {
    setSearchingFor(objectToSearch.label);
    const context = result?.objects
      .filter(obj => obj.label !== objectToSearch.label)
      .map(obj => obj.label) || [];

    try {
      const searchResult = await searchWikidata({ query: objectToSearch.label, context });
      setWikidataResults(prev => ({ ...prev, [objectToSearch.label]: searchResult.results }));
    } catch (error) {
        toast({
          title: 'Wikidata Search Error',
          description: `Could not search for "${objectToSearch.label}". Please try again.`,
          variant: 'destructive',
        });
    } finally {
      setSearchingFor(null);
    }
  }


  return (
    <Card className="border-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
             <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline">Locate & Identify Objects</CardTitle>
                    <CardDescription>Upload an image to detect objects, then search for their Wikidata entries.</CardDescription>
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
                <div className="relative w-full max-w-2xl">
                    <Image
                        ref={imageRef}
                        src={preview}
                        alt="Image preview"
                        width={800}
                        height={600}
                        className="rounded-lg object-contain"
                        onLoad={(e) => {
                            const img = e.currentTarget;
                            setImageDimensions({ width: img.width, height: img.height });
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
                               <span className={`absolute -top-5 left-0 text-xs text-white px-1.5 py-0.5 rounded-sm ${colorClass.replace('border-', 'bg-')}`}>
                                 {index + 1}. {obj.label}
                               </span>
                            </div>
                        )
                    })}
                 </div>
              </div>
            )}
            {result && result.objects.length > 0 && (
                <div className="pt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Identified Objects</h3>
                    <div className="space-y-4">
                        {result.objects.map((obj, index) => (
                            <Card key={obj.label} className="bg-secondary/50">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{index + 1}. {obj.label}</p>
                                        <Button size="sm" onClick={() => handleWikidataSearch(obj)} disabled={searchingFor === obj.label}>
                                            {searchingFor === obj.label ? <Loader2 className="h-4 w-4 animate-spin"/> : <Search className="h-4 w-4" />}
                                            <span className="ml-2">Search Wikidata</span>
                                        </Button>
                                    </div>
                                    {wikidataResults[obj.label] && (
                                        <div className="mt-4 space-y-2">
                                            {wikidataResults[obj.label].length > 0 ? (
                                                wikidataResults[obj.label].map(entity => (
                                                    <div key={entity.id} className="p-3 border rounded-md bg-background">
                                                         <div className="flex justify-between items-center">
                                                            <a href={`https://www.wikidata.org/wiki/${entity.id}`} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{entity.label}</a>
                                                            <p className="font-mono text-xs bg-secondary px-2 py-1 rounded">{entity.id}</p>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">{entity.description}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground text-center p-2">No relevant Wikidata entries found for "{obj.label}".</p>
                                            )}
                                        </div>
                                    )}
                                    {searchingFor === obj.label && !wikidataResults[obj.label] && (
                                        <div className="mt-4 space-y-2">
                                            <Skeleton className="h-12 w-full" />
                                            <Skeleton className="h-12 w-full" />
                                            <Skeleton className="h-12 w-full" />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
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
