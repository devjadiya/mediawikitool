
'use server';

/**
 * @fileOverview A Genkit flow to suggest a license for an image based on Commons guidelines.
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
  isOriginalAuthor: z.boolean().describe("Whether the user is the original author of the work."),
  isDerivativeWork: z.boolean().describe("Whether the work is a derivative of another work."),
});
export type SuggestLicenseInput = z.infer<typeof SuggestLicenseInputSchema>;

const SuggestionSchema = z.object({
    name: z.string().describe('The common name of the license (e.g., "CC BY-SA 4.0").'),
    rationale: z.string().describe('A brief explanation for why this license is suggested.'),
    url: z.string().url().describe('A link to the full license text.'),
});

const SuggestLicenseOutputSchema = z.object({
  status: z.enum(['VALID', 'INVALID_CONTENT']).describe("The validation status of the image content."),
  rejectionReason: z.string().optional().describe("If the image is invalid, the reason why."),
  suggestedLicenses: z.array(SuggestionSchema).describe('A list of suggested licenses for the image.'),
});
export type SuggestLicenseOutput = z.infer<typeof SuggestLicenseOutputSchema>;

export async function suggestLicense(input: SuggestLicenseInput): Promise<SuggestLicenseOutput> {
  return suggestLicenseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLicensePrompt',
  input: {schema: SuggestLicenseInputSchema},
  output: {schema: SuggestLicenseOutputSchema},
  prompt: `You are an expert on Wikimedia Commons content licensing policies. Your task is to analyze an image and a user's answers to suggest suitable Creative Commons licenses.

**Step 1: Content Validation**
First, analyze the image itself.
- Is the image a photograph of a 2D artwork, like a painting, drawing, or poster?
- Is the image a cartoon, illustration, or computer-generated graphic that is not a diagram?
- Does the image prominently feature a copyrighted logo, character, or another piece of intellectual property?
If the answer to ANY of these is yes, the image is likely NOT suitable for Commons. Set the 'status' to 'INVALID_CONTENT' and provide a 'rejectionReason' explaining the problem (e.g., "This appears to be a photo of a copyrighted painting. Only works you created yourself can be uploaded."). In this case, do not suggest any licenses.

**Step 2: License Suggestion (only if content is VALID)**
If the image passes the content validation, proceed to suggest licenses based on the user's answers.
- User is the original author: {{{isOriginalAuthor}}}
- This is a derivative work: {{{isDerivativeWork}}}

Based on these answers and standard Commons practice (preferring "free" licenses), provide 1-3 appropriate license suggestions. CC BY-SA 4.0 is almost always a good primary suggestion for original work. Explain the rationale for each. Set the 'status' to 'VALID'.

Image: {{media url=photoDataUri}}

Provide your complete analysis now.`,
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
