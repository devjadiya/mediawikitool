'use server';

/**
 * @fileOverview A Genkit flow to find where a source is cited on Wikipedia.
 *
 * @exports citedInFinder - An async function that finds citations of a source.
 * @exports CitedInFinderInput - The input type for the function.
 * @exports CitedInFinderOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CitedInFinderInputSchema = z.object({
  sourceIdentifier: z.string().describe('The source to search for, which can be a URL, DOI, or book title.'),
});
export type CitedInFinderInput = z.infer<typeof CitedInFinderInputSchema>;

const CitationLocationSchema = z.object({
    pageTitle: z.string().describe("The title of the Wikipedia article where the source is cited."),
    pageUrl: z.string().url().describe("The URL of the Wikipedia article."),
    context: z.string().describe("The sentence or phrase where the citation is used."),
});

const CitedInFinderOutputSchema = z.object({
  summary: z.string().describe("A summary of the findings."),
  citations: z.array(CitationLocationSchema).describe("A list of locations where the source is cited."),
});
export type CitedInFinderOutput = z.infer<typeof CitedInFinderOutputSchema>;

export async function citedInFinder(input: CitedInFinderInput): Promise<CitedInFinderOutput> {
  return citedInFinderFlow(input);
}

// In a real app, this would use a complex search tool like the Wikimedia API's search functionality
// or an external search index. For this demo, we simulate it.
const searchForCitationsTool = ai.defineTool(
    {
        name: 'searchForCitations',
        description: 'Searches across Wikipedia for articles that cite a specific source.',
        inputSchema: z.object({ query: z.string() }),
        outputSchema: z.array(CitationLocationSchema),
    },
    async ({ query }) => {
        console.log(`Simulating search for citations of: ${query}`);
        if (query.toLowerCase().includes("nature.com")) {
            return [
                { pageTitle: 'CRISPR', pageUrl: 'https://en.wikipedia.org/wiki/CRISPR', context: '...as demonstrated in a landmark 2012 paper.' },
                { pageTitle: 'Genetic engineering', pageUrl: 'https://en.wikipedia.org/wiki/Genetic_engineering', context: 'Recent advances in gene editing were published in Nature.' },
            ];
        }
        return [];
    }
);


const prompt = ai.definePrompt({
  name: 'citedInFinderPrompt',
  input: {schema: CitedInFinderInputSchema},
  output: {schema: CitedInFinderOutputSchema},
  tools: [searchForCitationsTool],
  prompt: `You are a research assistant tasked with finding where a specific source is cited on Wikipedia.

1.  Use the \`searchForCitations\` tool to search for the source: "{{{sourceIdentifier}}}".
2.  Analyze the results from the tool.
3.  Provide a brief summary of how many articles you found citing the source.
4.  List the pages where the citation was found, including the context.

Provide your full analysis now.`,
});

const citedInFinderFlow = ai.defineFlow(
  {
    name: 'citedInFinderFlow',
    inputSchema: CitedInFinderInputSchema,
    outputSchema: CitedInFinderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
