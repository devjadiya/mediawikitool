'use server';

/**
 * @fileOverview A Genkit flow to generate a SPARQL query for Wikidata from natural language.
 *
 * @exports sparqlQueryBuilder - An async function that takes a natural language query and returns a SPARQL query.
 * @exports SparqlQueryBuilderInput - The input type for the function.
 * @exports SparqlQueryBuilderOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SparqlQueryBuilderInputSchema = z.object({
  naturalLanguageQuery: z.string().describe('A natural language description of the data to be queried from Wikidata.'),
});
export type SparqlQueryBuilderInput = z.infer<typeof SparqlQueryBuilderInputSchema>;

const SparqlQueryBuilderOutputSchema = z.object({
  sparqlQuery: z.string().describe('The generated, ready-to-use SPARQL query for the Wikidata Query Service.'),
  explanation: z.string().describe('A brief explanation of what the generated query does and how it works.'),
});
export type SparqlQueryBuilderOutput = z.infer<typeof SparqlQueryBuilderOutputSchema>;

export async function sparqlQueryBuilder(input: SparqlQueryBuilderInput): Promise<SparqlQueryBuilderOutput> {
  return sparqlQueryBuilderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sparqlQueryBuilderPrompt',
  input: {schema: SparqlQueryBuilderInputSchema},
  output: {schema: SparqlQueryBuilderOutputSchema},
  prompt: `You are an expert in Wikidata and the SPARQL query language. Your task is to convert a user's natural language request into a functional, commented SPARQL query that can be run on the Wikidata Query Service (https://query.wikidata.org/).

**CRITICAL INSTRUCTIONS:**
1.  **Handle Chained Properties:** You must understand nested relationships. For example, to find paintings in a specific country, you must first find the painting's collection/museum (P195) and THEN find the location/country of that collection (P276 or P17). Use property paths like \`wdt:P195/wdt:P17 wd:Q55\` to traverse these relationships.
2.  **Handle Units:** When dealing with properties that have quantities (like length, height, population), you MUST be aware of different units. For example, a river's length (P2043) could be in kilometers or meters. Your query must handle this to produce correct sorted results. Often this means filtering for a specific unit (like kilometers, wd:Q828224) or converting values.
3.  **Be Specific:** For broad queries like "longest rivers" or "tallest buildings", add filters to ensure you are querying for major, significant items, not minor or obscure ones. For example, you might check that an item has a sitelink to the English Wikipedia.
4.  **Comment your code:** Add comments to the query to explain complex parts, especially any filters or unit handling.
5.  **Provide an Explanation:** Provide a separate, brief, natural-language explanation of what the query does and how it works.

User's Request: "{{{naturalLanguageQuery}}}"

Generate the SPARQL query and explanation now.`,
});

const sparqlQueryBuilderFlow = ai.defineFlow(
  {
    name: 'sparqlQueryBuilderFlow',
    inputSchema: SparqlQueryBuilderInputSchema,
    outputSchema: SparqlQueryBuilderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
