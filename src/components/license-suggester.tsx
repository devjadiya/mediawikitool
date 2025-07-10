
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { suggestLicense, SuggestLicenseOutput } from '@/ai/flows/suggest-license';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, ShieldCheck, Link as LinkIcon, Lightbulb, Wand2, ArrowLeft, XCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const formSchema = z.object({
  image: z.any()
    .refine(files => files?.length > 0, 'Image is required.'),
  isOriginalAuthor: z.enum(['yes', 'no']).optional(),
  isDerivativeWork: z.enum(['yes', 'no']).optional(),
});

type Step = 'upload' | 'questions' | 'result' | 'invalid';

export function LicenseSuggester() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestLicenseOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('upload');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResult(null);

    const file = values.image[0];
    if (!file) {
        toast({ title: 'Error', description: 'No image file found.', variant: 'destructive'});
        setIsLoading(false);
        return;
    }
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const apiResult = await suggestLicense({ 
            photoDataUri: dataUri,
            isOriginalAuthor: values.isOriginalAuthor === 'yes',
            isDerivativeWork: values.isDerivativeWork === 'yes',
        });
        
        setResult(apiResult);
        if (apiResult.status === 'INVALID_CONTENT') {
            setStep('invalid');
        } else {
            setStep('result');
        }

      } catch (error) {
        console.error('Error suggesting license:', error);
        toast({
          title: 'Error',
          description: 'Could not process the image. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      form.setValue('image', event.target.files);
      
      // Perform initial validation
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        try {
            const validationResult = await suggestLicense({
                photoDataUri: dataUri,
                isOriginalAuthor: true, // Dummy value for validation
                isDerivativeWork: false, // Dummy value for validation
            });
            if (validationResult.status === 'INVALID_CONTENT') {
                setResult(validationResult);
                setStep('invalid');
            } else {
                setStep('questions');
                setResult(null); // Clear validation result if valid
            }
        } catch (e) {
            toast({ title: 'Error', description: 'Could not validate image.', variant: 'destructive'});
            setStep('upload');
        } finally {
            setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);

    } else {
      setPreview(null);
    }
  };

  const handleReset = () => {
    form.reset();
    setPreview(null);
    setResult(null);
    setStep('upload');
  };

  return (
    <Card className="border-2 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardHeader>
            <CardTitle className="font-headline">License Suggester</CardTitle>
            <CardDescription>A step-by-step tool to find the right license for your work.</CardDescription>
          </CardHeader>
          <CardContent>

            {preview && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={preview}
                  alt="Image preview"
                  width={200}
                  height={200}
                  className={cn("rounded-lg mx-auto object-cover aspect-square", (step === 'invalid' || step === 'result') && 'opacity-50')}
                />
              </div>
            )}
            
            {step === 'upload' && (
                <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <Input 
                            type="file" 
                            accept="image/*"
                            className="pl-12"
                            onChange={handleFileChange}
                            disabled={isLoading}
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
            )}

            {isLoading && step !== 'result' && (
                 <div className="text-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">Analyzing image...</p>
                 </div>
            )}
            
            {!isLoading && step === 'questions' && (
              <div className="space-y-6 animate-in fade-in-0 duration-500">
                <FormField
                  control={form.control}
                  name="isOriginalAuthor"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">Are you the original author/creator of this work?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <FormItem className="flex items-center space-x-2">
                            <FormControl><RadioGroupItem value="yes" /></FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl><RadioGroupItem value="no" /></FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDerivativeWork"
                  render={({ field }) => (
                     <FormItem className="space-y-3">
                      <FormLabel className="text-base">Is this a derivative work (e.g., a photo of a statue, a modification of another free image)?</FormLabel>
                       <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <FormItem className="flex items-center space-x-2">
                            <FormControl><RadioGroupItem value="yes" /></FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl><RadioGroupItem value="no" /></FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {!isLoading && (step === 'result' || step === 'invalid') && result && (
              <div className="space-y-4 animate-in fade-in-0 duration-500">
                {step === 'invalid' && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4"/>
                        <AlertTitle>Content Not Suitable for Commons</AlertTitle>
                        <AlertDescription>
                            {result.rejectionReason || 'This type of content may not be acceptable on Wikimedia Commons.'}
                        </AlertDescription>
                    </Alert>
                )}

                {step === 'result' && (
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <h3 className="font-semibold text-lg">Recommended Licenses</h3>
                        </div>
                        <div className="space-y-3">
                            {result.suggestedLicenses.map((license, index) => (
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
              </div>
            )}

          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {step === 'questions' && (
                 <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                    ) : (
                        <><ShieldCheck className="mr-2 h-4 w-4" />Suggest License</>
                    )}
                </Button>
            )}
            {(step === 'result' || step === 'invalid' || step === 'questions') && (
                <Button type="button" variant="outline" onClick={handleReset} className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
                </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
