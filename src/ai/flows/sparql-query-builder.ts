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

- The query should be efficient and well-formed.
- Add comments to the query to explain complex parts.
- Provide a separate, brief, natural-language explanation of what the query does.

User's Request: "{{{naturalLanguageQuery}}}"

Generate the SPARQL query and explanation.`,
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
