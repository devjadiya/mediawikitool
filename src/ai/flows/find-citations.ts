'use server';

/**
 * @fileOverview A Genkit flow to find a reliable source for a given statement.
 *
 * @exports findCitation - An async function that finds a citation.
 * @exports FindCitationInput - The input type for the findCitation function.
 * @exports FindCitationOutput - The output type for the findCitation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindCitationInputSchema = z.object({
  statement: z.string().describe('The statement that needs a citation.'),
});
export type FindCitationInput = z.infer<typeof FindCitationInputSchema>;

const FindCitationOutputSchema = z.object({
  sourceUrl: z.string().url().describe('The URL of the reliable source found.'),
  title: z.string().describe('The title of the source.'),
  formattedCitation: z.string().describe('A pre-formatted {{cite web}} template for the source.'),
  confidence: z.number().min(0).max(1).describe('A confidence score (0-1) on whether the source supports the statement.'),
});
export type FindCitationOutput = z.infer<typeof FindCitationOutputSchema>;

export async function findCitation(input: FindCitationInput): Promise<FindCitationOutput> {
  return findCitationFlow(input);
}

// In a real implementation, this would be a tool that searches the web.
// For this prototype, we'll simulate a search.
const findSourceTool = ai.defineTool(
    {
        name: 'findSourceTool',
        description: 'Finds a reliable source for a given statement.',
        inputSchema: z.object({
            statement: z.string(),
        }),
        outputSchema: z.object({
            url: z.string().url(),
            title: z.string(),
        }),
    },
    async ({ statement }) => {
        // This is a mock. A real implementation would use a search API.
        return {
            url: 'https://www.example.com/source-for-statement',
            title: 'A Reliable Source for the Statement',
        };
    }
);


const prompt = ai.definePrompt({
  name: 'findCitationPrompt',
  input: {schema: FindCitationInputSchema},
  output: {schema: FindCitationOutputSchema},
  tools: [findSourceTool],
  prompt: `You are a Wikipedia editor who is an expert at finding reliable sources. For the statement "{{{statement}}}", find the best possible source and format it as a citation. Use the findSourceTool to perform the search. Then, evaluate the source to determine if it truly supports the statement and provide a confidence score. Finally, create a {{cite web}} template.`,
});

const findCitationFlow = ai.defineFlow(
  {
    name: 'findCitationFlow',
    inputSchema: FindCitationInputSchema,
    outputSchema: FindCitationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
