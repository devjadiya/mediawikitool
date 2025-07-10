'use server';

/**
 * @fileOverview A Genkit flow to debug a regular expression.
 *
 * @exports debugRegex - An async function that explains a regex.
 * @exports DebugRegexInput - The input type for the debugRegex function.
 * @exports DebugRegexOutput - The output type for the debugRegex function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DebugRegexInputSchema = z.object({
  regex: z.string().describe('The regular expression to debug.'),
});
export type DebugRegexInput = z.infer<typeof DebugRegexInputSchema>;

const DebugRegexOutputSchema = z.object({
  explanation: z.string().describe('A step-by-step, natural language explanation of the regex.'),
  isValid: z.boolean().describe('Whether the regular expression is syntactically valid.'),
});
export type DebugRegexOutput = z.infer<typeof DebugRegexOutputSchema>;

export async function debugRegex(input: DebugRegexInput): Promise<DebugRegexOutput> {
  return debugRegexFlow(input);
}

const prompt = ai.definePrompt({
  name: 'debugRegexPrompt',
  input: {schema: DebugRegexInputSchema},
  output: {schema: DebugRegexOutputSchema},
  prompt: `You are an expert in regular expressions.
Analyze the following regex and provide a detailed, step-by-step explanation of what it does.
Also, determine if the regex is syntactically valid.

Regex: \`{{{regex}}}\`

Provide your analysis.`,
});

const debugRegexFlow = ai.defineFlow(
  {
    name: 'debugRegexFlow',
    inputSchema: DebugRegexInputSchema,
    outputSchema: DebugRegexOutputSchema,
  },
  async input => {
    try {
        new RegExp(input.regex);
    } catch (e) {
        return {
            isValid: false,
            explanation: 'This regular expression is not valid. ' + (e as Error).message,
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
