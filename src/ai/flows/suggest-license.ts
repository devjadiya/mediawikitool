'use server';

/**
 * @fileOverview A Genkit flow to suggest a license for an image.
 *
 * @exports suggestLicense - An async function that suggests a license.
 * @exports SuggestLicenseInput - The input type for the suggestLicense function.
 * @exports SuggestLicenseOutput - The output type for the suggestLicense function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLicenseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo needing a license, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
    context: z.string().optional().describe('Optional context about the image origin or content.')
});
export type SuggestLicenseInput = z.infer<typeof SuggestLicenseInputSchema>;

const SuggestLicenseOutputSchema = z.object({
  suggestedLicenses: z.array(z.object({
    name: z.string().describe('The common name of the license (e.g., "CC BY-SA 4.0").'),
    rationale: z.string().describe('A brief explanation for why this license is suggested.'),
    url: z.string().url().describe('A link to the full license text.'),
  })).describe('A list of suggested licenses for the image.'),
});
export type SuggestLicenseOutput = z.infer<typeof SuggestLicenseOutputSchema>;

export async function suggestLicense(input: SuggestLicenseInput): Promise<SuggestLicenseOutput> {
  return suggestLicenseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLicensePrompt',
  input: {schema: SuggestLicenseInputSchema},
  output: {schema: SuggestLicenseOutputSchema},
  prompt: `You are an expert on content licensing for Wikimedia Commons.
Analyze the provided image and any context to suggest suitable Creative Commons licenses.
Consider factors like whether it's a derivative work, if it contains identifiable people, or if it's a work of art.
Provide 1-3 license suggestions with a rationale for each.

Image: {{media url=photoDataUri}}
{{#if context}}
Context: {{{context}}}
{{/if}}

Provide your license suggestions.`,
});

const suggestLicenseFlow = ai.defineFlow(
  {
    name: 'suggestLicenseFlow',
    inputSchema: SuggestLicenseInputSchema,
    outputSchema: SuggestLicenseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
