'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting image categories based on an uploaded image.
 *
 * @exports suggestCategory - An async function that takes an image data URI as input and returns a list of suggested categories.
 * @exports SuggestCategoryInput - The input type for the suggestCategory function.
 * @exports SuggestCategoryOutput - The output type for the suggestCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCategoryInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be categorized, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestCategoryInput = z.infer<typeof SuggestCategoryInputSchema>;

const SuggestCategoryOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('A list of suggested categories for the image.'),
});
export type SuggestCategoryOutput = z.infer<typeof SuggestCategoryOutputSchema>;

export async function suggestCategory(input: SuggestCategoryInput): Promise<SuggestCategoryOutput> {
  return suggestCategoryFlow(input);
}

const suggestCategoryPrompt = ai.definePrompt({
  name: 'suggestCategoryPrompt',
  input: {schema: SuggestCategoryInputSchema},
  output: {schema: SuggestCategoryOutputSchema},
  prompt: `You are an expert in image categorization for the Wiki Loves Science competition.

  Given the following image, suggest up to 5 relevant categories for it. Return the categories as a JSON array of strings.

  Image: {{media url=photoDataUri}}

  Categories:`,
});

const suggestCategoryFlow = ai.defineFlow(
  {
    name: 'suggestCategoryFlow',
    inputSchema: SuggestCategoryInputSchema,
    outputSchema: SuggestCategoryOutputSchema,
  },
  async input => {
    const {output} = await suggestCategoryPrompt(input);
    return output!;
  }
);
