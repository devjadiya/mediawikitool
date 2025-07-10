'use server';

/**
 * @fileOverview A Genkit flow to anonymize text by redacting Personally Identifiable Information (PII).
 *
 * @exports anonymizeText - An async function that takes text and returns an anonymized version.
 * @exports AnonymizeTextInput - The input type for the anonymizeText function.
 * @exports AnonymizeTextOutput - The output type for the anonymizeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnonymizeTextInputSchema = z.object({
  text: z.string().describe('The text to be anonymized.'),
});
export type AnonymizeTextInput = z.infer<typeof AnonymizeTextInputSchema>;

const AnonymizeTextOutputSchema = z.object({
  anonymizedText: z.string().describe('The text with PII redacted.'),
});
export type AnonymizeTextOutput = z.infer<typeof AnonymizeTextOutputSchema>;

export async function anonymizeText(input: AnonymizeTextInput): Promise<AnonymizeTextOutput> {
  return anonymizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'anonymizeTextPrompt',
  input: {schema: AnonymizeTextInputSchema},
  output: {schema: AnonymizeTextOutputSchema},
  prompt: `You are a privacy-focused text anonymizer for Wikimedians. Your task is to redact Personally Identifiable Information (PII) from the given text.

PII includes, but is not limited to:
- Names of individuals (replace with [REDACTED_NAME])
- Email addresses (replace with [REDACTED_EMAIL])
- Phone numbers (replace with [REDACTED_PHONE])
- IP addresses (replace with [REDACTED_IP])
- Physical addresses (replace with [REDACTED_ADDRESS])

Do not redact usernames or general locations unless they form a specific address.

Original text:
{{{text}}}

Return the anonymized text.`,
});

const anonymizeTextFlow = ai.defineFlow(
  {
    name: 'anonymizeTextFlow',
    inputSchema: AnonymizeTextInputSchema,
    outputSchema: AnonymizeTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
