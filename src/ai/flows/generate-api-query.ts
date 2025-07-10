'use server';

/**
 * @fileOverview A Genkit flow to generate a MediaWiki Action API query from a natural language description.
 *
 * @exports generateApiQuery - An async function that takes a task description and returns a generated API query.
 * @exports GenerateApiQueryInput - The input type for the generateApiQuery function.
 * @exports GenerateApiQueryOutput - The output type for the generateApiQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateApiQueryInputSchema = z.object({
  taskDescription: z.string().describe('A natural language description of the API task.'),
});
export type GenerateApiQueryInput = z.infer<typeof GenerateApiQueryInputSchema>;

const GenerateApiQueryOutputSchema = z.object({
  apiUrl: z.string().url().describe('The generated, ready-to-use MediaWiki Action API URL.'),
  explanation: z.string().describe('A brief explanation of what the generated query does and what its parameters mean.'),
});
export type GenerateApiQueryOutput = z.infer<typeof GenerateApiQueryOutputSchema>;

export async function generateApiQuery(input: GenerateApiQueryInput): Promise<GenerateApiQueryOutput> {
  return generateApiQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateApiQueryPrompt',
  input: {schema: GenerateApiQueryInputSchema},
  output: {schema: GenerateApiQueryOutputSchema},
  prompt: `You are an expert on the MediaWiki Action API. Your task is to convert a user's natural language request into a functional, complete MediaWiki API query URL.

- The base URL should be for the English Wikipedia: https://en.wikipedia.org/w/api.php
- ALWAYS include 'action=query', 'format=json', and 'origin=*' in the URL.
- Translate the user's goal into the correct 'list', 'prop', or 'meta' modules and their associated parameters.
- Provide a brief, clear explanation of the generated URL and its components.

User's Request: "{{{taskDescription}}}"

Generate the API query URL and explanation now.`,
});

const generateApiQueryFlow = ai.defineFlow(
  {
    name: 'generateApiQueryFlow',
    inputSchema: GenerateApiQueryInputSchema,
    outputSchema: GenerateApiQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
