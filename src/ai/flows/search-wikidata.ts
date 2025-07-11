'use server';

/**
 * @fileOverview A flow to search Wikidata for entities. This is now a direct wrapper around a server action.
 *
 * @exports searchWikidata - An async function that takes a query and returns potential Wikidata entities.
 * @exports WikidataSearchInput - The input type for the function.
 * @exports WikidataSearchOutput - The output type for the function.
 */

import {z} from 'genkit';
import { searchWikidataEntities } from '@/app/actions/wikimedia';

const WikidataSearchInputSchema = z.object({
  query: z.string().describe('The search query for the Wikidata entity.'),
  context: z.array(z.string()).optional().describe("A list of other items identified in the same context, to help with disambiguation."),
});
export type WikidataSearchInput = z.infer<typeof WikidataSearchInputSchema>;

const WikidataEntitySchema = z.object({
    id: z.string().describe("The Wikidata Q-ID of the entity."),
    label: z.string().describe("The primary label of the entity."),
    description: z.string().optional().describe("A brief description of the entity to help with disambiguation."),
});

const WikidataSearchOutputSchema = z.object({
  results: z.array(WikidataEntitySchema).describe('A list of up to 5 potential matching Wikidata entities.'),
});
export type WikidataSearchOutput = z.infer<typeof WikidataSearchOutputSchema>;

export async function searchWikidata(input: WikidataSearchInput): Promise<WikidataSearchOutput> {
  // The context can be used to refine the search term in the future if needed.
  // For now, we do a direct search for simplicity and reliability.
  const searchTerm = input.context ? `${input.query} (${input.context.join(", ")})` : input.query;
  const results = await searchWikidataEntities({ searchTerm: input.query, limit: 5 });
  return { results };
}
