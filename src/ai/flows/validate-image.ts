'use server';

/**
 * @fileOverview A Genkit flow to validate an image against competition rules.
 *
 * @exports validateImage - An async function that takes an image and returns validation results.
 * @exports ValidateImageInput - The input type for the validateImage function.
 * @exports ValidateImageOutput - The output type for the validateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo for validation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ValidateImageInput = z.infer<typeof ValidateImageInputSchema>;

const ValidateImageOutputSchema = z.object({
  hasWatermark: z.boolean().describe('Does the image appear to have a watermark, signature, or overlaid text?'),
  isClear: z.boolean().describe('Is the main subject of the image generally clear and in focus?'),
  feedback: z.string().describe('Provide one sentence of constructive feedback for the photographer to improve the image for the competition.'),
});
export type ValidateImageOutput = z.infer<typeof ValidateImageOutputSchema>;

export async function validateImage(input: ValidateImageInput): Promise<ValidateImageOutput> {
  return validateImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateImagePrompt',
  input: {schema: ValidateImageInputSchema},
  output: {schema: ValidateImageOutputSchema},
  prompt: `You are an AI judge for a photography competition. Analyze the image provided based on standard competition rules.

- Check for any watermarks, signatures, or text overlays. Watermarks are typically in the corners or semi-transparent over the image.
- Evaluate if the main subject is reasonably in focus and clear.
- Provide one sentence of constructive feedback to help the user. For example, suggest improvements on lighting, composition, or focus.

Image: {{media url=photoDataUri}}

Analyze the image and provide the validation results.`,
});

const validateImageFlow = ai.defineFlow(
  {
    name: 'validateImageFlow',
    inputSchema: ValidateImageInputSchema,
    outputSchema: ValidateImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
