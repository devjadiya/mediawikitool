'use server';

/**
 * @fileOverview A Genkit flow to detect potential copyright violations.
 *
 * @exports detectCopyvio - An async function that checks text for copyvio.
 * @exports DetectCopyvioInput - The input type for the detectCopyvio function.
 * @exports DetectCopyvioOutput - The output type for the detectCopyvio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectCopyvioInputSchema = z.object({
  text: z.string().describe('The text to check for copyright violations.'),
});
export type DetectCopyvioInput = z.infer<typeof DetectCopyvioInputSchema>;

const DetectCopyvioOutputSchema = z.object({
  isPotentialViolation: z.boolean().describe('Whether the text is a likely copyright violation.'),
  confidence: z.number().min(0).max(1).describe('The confidence score (0-1) for the violation assessment.'),
  explanation: z.string().describe('A brief explanation of the findings, and if it is a violation, which parts and why.'),
  matchedSource: z.string().url().optional().describe('The most likely URL of the source if a violation is detected.'),
});
export type DetectCopyvioOutput = z.infer<typeof DetectCopyvioOutputSchema>;

export async function detectCopyvio(input: DetectCopyvioInput): Promise<DetectCopyvioOutput> {
  return detectCopyvioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectCopyvioPrompt',
  input: {schema: DetectCopyvioInputSchema},
  output: {schema: DetectCopyvioOutputSchema},
  prompt: `You are an AI assistant specializing in copyright violation detection for Wikimedia.
Analyze the following text to determine if it is a likely copy-paste from another source. Search for the text online to find potential matches.

- If it seems to be a copyright violation, set 'isPotentialViolation' to true and provide the URL of the likely source.
- Provide a confidence score for your assessment.
- Explain your reasoning.

Text to analyze:
{{{text}}}

Provide your analysis.`,
});

const detectCopyvioFlow = ai.defineFlow(
  {
    name: 'detectCopyvioFlow',
    inputSchema: DetectCopyvioInputSchema,
    outputSchema: DetectCopyvioOutputSchema,
  },
  async input => {
    // In a real app, this would use a tool to search the web.
    // For this prototype, the model will simulate this.
    const {output} = await prompt(input);
    return output!;
  }
);
