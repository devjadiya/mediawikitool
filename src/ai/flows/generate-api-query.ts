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
  apiUrl: z.string().describe('The generated, ready-to-use MediaWiki Action API URL.'),
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

Here are your instructions:
1.  **Determine the Action:** Analyze the user's request to determine the most appropriate \`action\` parameter (e.g., \`query\`, \`parse\`, \`opensearch\`, \`feedrecentchanges\`). Do not default to \`action=query\` if the request implies something else.
2.  **Set Base URL:** The base URL should always be for the English Wikipedia: \`https://en.wikipedia.org/w/api.php\`.
3.  **Include Standard Parameters:** ALWAYS include \`format=json\` and \`origin=*\` in the URL for web compatibility.
4.  **Select Modules and Parameters:** Based on the action, select the correct modules (e.g., \`list\`, \`prop\`, \`meta\`) and their associated parameters to fulfill the user's request. Be precise. For example, for "recent changes," use \`action=query&list=recentchanges\`.
5.  **Provide a Clear Explanation:** Briefly explain what the generated query does and what its key parameters mean.

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
