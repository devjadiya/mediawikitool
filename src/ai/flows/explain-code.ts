'use server';

/**
 * @fileOverview A Genkit flow to explain a code snippet.
 *
 * @exports explainCode - An async function that explains code.
 * @exports ExplainCodeInput - The input type for the explainCode function.
 * @exports ExplainCodeOutput - The output type for the explainCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to explain.'),
  language: z.enum(['Lua', 'JavaScript']).describe('The programming language of the snippet.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe('A high-level summary of what the code does.'),
  lineByLine: z.array(z.object({
    line: z.number(),
    explanation: z.string(),
  })).describe('A line-by-line explanation of the code.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {schema: ExplainCodeInputSchema},
  output: {schema: ExplainCodeOutputSchema},
  prompt: `You are an expert programmer who specializes in code used on Wikimedia projects.
Analyze the following {{{language}}} code snippet. Provide a high-level summary and then a detailed line-by-line explanation.

Code:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

Provide your analysis.`,
});

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
