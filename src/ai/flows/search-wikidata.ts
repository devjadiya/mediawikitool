'use server';

/**
 * @fileOverview A Genkit flow to search Wikidata for entities.
 *
 * @exports searchWikidata - An async function that takes a query and returns potential Wikidata entities.
 * @exports WikidataSearchInput - The input type for the function.
 * @exports WikidataSearchOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WikidataSearchInputSchema = z.object({
  query: z.string().describe('The search query for the Wikidata entity.'),
});
export type WikidataSearchInput = z.infer<typeof WikidataSearchInputSchema>;

const WikidataEntitySchema = z.object({
    id: z.string().describe("The Wikidata Q-ID of the entity."),
    label: z.string().describe("The primary label of the entity."),
    description: z.string().describe("A brief description of the entity to help with disambiguation."),
});

const WikidataSearchOutputSchema = z.object({
  results: z.array(WikidataEntitySchema).describe('A list of up to 5 potential matching Wikidata entities.'),
});
export type WikidataSearchOutput = z.infer<typeof WikidataSearchOutputSchema>;

export async function searchWikidata(input: WikidataSearchInput): Promise<WikidataSearchOutput> {
  return searchWikidataFlow(input);
}

const searchWikidataTool = ai.defineTool(
  {
    name: 'searchWikidataEntities',
    description: 'Searches the Wikidata database for entities matching a search term.',
    inputSchema: z.object({
      searchTerm: z.string(),
      limit: z.number().default(10),
    }),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        description: z.string().optional(),
      })
    ),
  },
  async ({ searchTerm, limit }) => {
    const url = new URL('https://www.wikidata.org/w/api.php');
    url.searchParams.set('action', 'wbsearchentities');
    url.searchParams.set('search', searchTerm);
    url.searchParams.set('language', 'en');
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.search?.map((item: any) => ({
        id: item.id,
        label: item.label,
        description: item.description,
      })) || [];
    } catch (error) {
      console.error('Failed to search Wikidata API:', error);
      return [];
    }
  }
);


const prompt = ai.definePrompt({
  name: 'searchWikidataPrompt',
  input: {schema: WikidataSearchInputSchema},
  output: {schema: WikidataSearchOutputSchema},
  tools: [searchWikidataTool],
  prompt: `You are an expert at finding the correct Wikidata entries for a given query.

1.  Use the \`searchWikidataEntities\` tool to search for the user's query: "{{{query}}}".
2.  Analyze the results from the tool.
3.  Return the top 3-5 most relevant results that are most likely to be what the user is looking for. Pay close attention to the descriptions to disambiguate. For example, for "Eiffel Tower", you should return the one in Paris, not replicas.

Provide your results now.`,
});

const searchWikidataFlow = ai.defineFlow(
  {
    name: 'searchWikidataFlow',
    inputSchema: WikidataSearchInputSchema,
    outputSchema: WikidataSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
