'use server';

/**
 * @fileOverview A Genkit flow to generate a caption and description for a scientific image.
 *
 * @exports generateCaption - An async function that takes an image and context, returning a caption and description.
 * @exports GenerateCaptionInput - The input type for the generateCaption function.
 * @exports GenerateCaptionOutput - The output type for the generateCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a scientific subject, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  context: z.string().optional().describe('Optional user-provided context about the image.'),
});
export type GenerateCaptionInput = z.infer<typeof GenerateCaptionInputSchema>;

const GenerateCaptionOutputSchema = z.object({
  title: z.string().describe('A concise, descriptive title for the image (max 15 words).'),
  description: z.string().describe('A detailed, encyclopedic description suitable for Wikimedia Commons, explaining the subject and what is shown (3-4 sentences).'),
});
export type GenerateCaptionOutput = z.infer<typeof GenerateCaptionOutputSchema>;

export async function generateCaption(input: GenerateCaptionInput): Promise<GenerateCaptionOutput> {
  return generateCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaptionPrompt',
  input: {schema: GenerateCaptionInputSchema},
  output: {schema: GenerateCaptionOutputSchema},
  prompt: `You are an expert in scientific communication, writing for Wikimedia Commons. Your task is to generate a title and a detailed, encyclopedic description for the provided image.

The description should be objective and informative, suitable for a Wikipedia article. Explain what the image depicts clearly.

Image: {{media url=photoDataUri}}
{{#if context}}
User-provided context: {{{context}}}
{{/if}}

Generate a title and description.`,
});

const generateCaptionFlow = ai.defineFlow(
  {
    name: 'generateCaptionFlow',
    inputSchema: GenerateCaptionInputSchema,
    outputSchema: GenerateCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
