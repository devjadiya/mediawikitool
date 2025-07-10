'use server';

/**
 * @fileOverview A Genkit flow to generate a simple SVG icon.
 *
 * @exports generateSvg - An async function that generates an SVG.
 * @exports GenerateSvgInput - The input type for the generateSvg function.
 * @exports GenerateSvgOutput - The output type for the generateSvg function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSvgInputSchema = z.object({
  description: z.string().describe('A description of the SVG icon to generate.'),
});
export type GenerateSvgInput = z.infer<typeof GenerateSvgInputSchema>;

const GenerateSvgOutputSchema = z.object({
  svgCode: z.string().describe('The full code for the generated SVG.'),
});
export type GenerateSvgOutput = z.infer<typeof GenerateSvgOutputSchema>;

export async function generateSvg(input: GenerateSvgInput): Promise<GenerateSvgOutput> {
  return generateSvgFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSvgPrompt',
  input: {schema: GenerateSvgInputSchema},
  output: {schema: GenerateSvgOutputSchema},
  prompt: `You are a designer who creates simple, clean, single-color SVG icons suitable for use on Wikimedia projects.
Based on the following description, generate the complete SVG code. The SVG should be 24x24 and use "currentColor" for the fill so it can be styled with CSS.

Description: "{{{description}}}"

Generate the SVG code.`,
});

const generateSvgFlow = ai.defineFlow(
  {
    name: 'generateSvgFlow',
    inputSchema: GenerateSvgInputSchema,
    outputSchema: GenerateSvgOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
