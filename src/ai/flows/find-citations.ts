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
import {format} from 'date-fns';

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
        description: 'Finds a reliable source for a given statement by searching the web.',
        inputSchema: z.object({
            query: z.string().describe("The statement to search for."),
        }),
        outputSchema: z.object({
            url: z.string().url().describe("The URL of the top search result."),
            title: z.string().describe("The title of the page found."),
        }),
    },
    async ({ query }) => {
        // This is a mock. A real implementation would use a search API.
        console.log(`Simulating search for: ${query}`);
        // Let's make the mock a bit more realistic based on the query.
        if (query.toLowerCase().includes("sun")) {
             return {
                url: 'https://science.nasa.gov/sun/facts/',
                title: 'Sun Fact Sheet - NASA',
            };
        }
        if (query.toLowerCase().includes("vidisha")) {
             return {
                url: 'https://vidisha.nic.in/en/history/',
                title: 'History of Vidisha - Official District Website',
            };
        }
        if (query.includes("कारखाना")) {
            return {
                url: 'https://example-hindi-encylopedia.com/factory-article',
                title: 'कारखानों का इतिहास और विकास',
            }
        }
        // Generic fallback for any other query
        return {
            url: 'https://www.example.com/source-for-statement',
            title: 'A Reliable Source for Your Statement',
        };
    }
);


const prompt = ai.definePrompt({
  name: 'findCitationPrompt',
  input: {schema: FindCitationInputSchema},
  output: {schema: FindCitationOutputSchema},
  tools: [findSourceTool],
  prompt: `You are a Wikipedia editor who is an expert at finding reliable sources.

1.  Take the user's statement: "{{{statement}}}"
2.  Use the findSourceTool with the user's statement as the query to find a relevant source online.
3.  Analyze the result from the tool. Based on the title and URL, determine how likely it is that this source supports the original statement. Provide a confidence score between 0.0 and 1.0.
4.  Create a complete {{cite web}} template using the information from the tool. Use today's date for the access-date. Today's date is ${format(new Date(), 'yyyy-MM-dd')}.
5.  Return the source URL, title, formatted citation, and your confidence score.`,
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
