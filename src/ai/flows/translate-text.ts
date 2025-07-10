'use server';

/**
 * @fileOverview A Genkit flow to translate wikitext between languages.
 *
 * @exports translateText - An async function that translates text.
 * @exports TranslateTextInput - The input type for the translateText function.
 * @exports TranslateTextOutput - The output type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The wikitext to be translated.'),
  targetLanguage: z.string().describe('The language to translate the text into (e.g., "Hindi", "French").'),
  sourceLanguage: z.string().optional().describe('The source language of the text (e.g., "English").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated wikitext.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `You are an expert translator specializing in wikitext for Wikimedia projects. Your task is to translate the given wikitext to the target language.

- Preserve the wikitext markup (e.g., [[links]], {{templates}}, '''bold''', ''italic'').
- Translate the content accurately and naturally.
- Do not translate template names, parameters, or link targets unless it's appropriate for the target wiki.

Source Language: {{{sourceLanguage | 'auto'}}}
Target Language: {{{targetLanguage}}}

Wikitext to translate:
{{{text}}}

Return only the translated wikitext.`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
