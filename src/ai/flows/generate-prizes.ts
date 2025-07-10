
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating prize ideas for a competition category.
 *
 * @exports generatePrizes - An async function that takes a category and returns prize ideas.
 * @exports GeneratePrizesInput - The input type for the generatePrizes function.
 * @exports GeneratePrizesOutput - The output type for the generatePrizes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePrizesInputSchema = z.object({
  category: z.string().describe('The competition category to generate prize ideas for.'),
});
export type GeneratePrizesInput = z.infer<typeof GeneratePrizesInputSchema>;

const PrizeIdeaSchema = z.object({
    name: z.string().describe("The name of the prize idea."),
    description: z.string().describe("A brief description of the prize idea."),
    icon: z.enum(['Telescope', 'Microscope', 'FlaskConical', 'Camera', 'BookOpenCheck']).describe("An icon representing the prize idea category.")
});

const GeneratePrizesOutputSchema = z.object({
  prizes: z
    .array(PrizeIdeaSchema)
    .describe('A list of 3 creative and relevant prize ideas for the given category.'),
});
export type GeneratePrizesOutput = z.infer<typeof GeneratePrizesOutputSchema>;

export async function generatePrizes(input: GeneratePrizesInput): Promise<GeneratePrizesOutput> {
  return generatePrizesFlow(input);
}

const generatePrizesPrompt = ai.definePrompt({
  name: 'generatePrizesPrompt',
  input: {schema: GeneratePrizesInputSchema},
  output: {schema: GeneratePrizesOutputSchema},
  prompt: `You are a creative director for a science photography competition.
  
  Brainstorm 3 unique, tangible, and exciting prize ideas for the category: "{{{category}}}".

  For each idea, provide a name, a brief description, and select the most appropriate icon from the following list: 'Telescope', 'Microscope', 'FlaskConical', 'Camera', 'BookOpenCheck'.
  
  The prizes should be thematically related to the category. For example, for 'Astronomy', a good prize would be a telescope, not a microscope.
  
  Generate the prize ideas now.`,
});

const generatePrizesFlow = ai.defineFlow(
  {
    name: 'generatePrizesFlow',
    inputSchema: GeneratePrizesInputSchema,
    outputSchema: GeneratePrizesOutputSchema,
  },
  async input => {
    const {output} = await generatePrizesPrompt(input);
    return output!;
  }
);
