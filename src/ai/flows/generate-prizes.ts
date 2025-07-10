'use server';

/**
 * @fileOverview A Genkit flow to generate creative prize ideas for a science competition.
 *
 * @exports generatePrizes - An async function that takes a category and returns prize ideas.
 * @exports GeneratePrizesInput - The input type for the generatePrizes function.
 * @exports GeneratePrizesOutput - The output type for the generatePrizes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePrizesInputSchema = z.object({
  category: z.string().describe('The science competition category for which to generate prize ideas.'),
});
export type GeneratePrizesInput = z.infer<typeof GeneratePrizesInputSchema>;

const GeneratePrizesOutputSchema = z.object({
  prizes: z.array(z.object({
    name: z.string().describe('The name of the prize idea.'),
    description: z.string().describe('A brief description of the prize.'),
    icon: z.enum(['Telescope', 'Microscope', 'FlaskConical', 'Camera', 'BookOpenCheck']).describe('An icon representing the prize category.')
  })).describe('A list of 3 creative prize ideas.'),
});
export type GeneratePrizesOutput = z.infer<typeof GeneratePrizesOutputSchema>;

export async function generatePrizes(input: GeneratePrizesInput): Promise<GeneratePrizesOutput> {
  return generatePrizesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePrizesPrompt',
  input: {schema: GeneratePrizesInputSchema},
  output: {schema: GeneratePrizesOutputSchema},
  prompt: `You are a creative organizer for the Wiki Science Competition in India.

Brainstorm 3 unique and exciting prize ideas for the winning photograph in the "{{{category}}}" category. The prizes should be science-related and appealing to photographers, students, and researchers in India. For each prize, provide a name, a short description, and an appropriate icon.

Available icons are: Telescope, Microscope, FlaskConical, Camera, BookOpenCheck.`,
});

const generatePrizesFlow = ai.defineFlow(
  {
    name: 'generatePrizesFlow',
    inputSchema: GeneratePrizesInputSchema,
    outputSchema: GeneratePrizesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
