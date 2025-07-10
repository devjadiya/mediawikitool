'use server';

/**
 * @fileOverview A Genkit flow to fact-check a block of text.
 *
 * @exports factCheckText - An async function that checks claims in a text.
 * @exports FactCheckTextInput - The input type for the factCheckText function.
 * @exports FactCheckTextOutput - The output type for the factCheckText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FactCheckTextInputSchema = z.object({
  text: z.string().describe('A block of text containing claims to be fact-checked.'),
});
export type FactCheckTextInput = z.infer<typeof FactCheckTextInputSchema>;

const ClaimSchema = z.object({
    claim: z.string().describe("A single, verifiable claim extracted from the text."),
    source: z.string().url().optional().describe("The URL of a reliable source found to verify the claim."),
    status: z.enum(['Supported', 'Unsupported', 'Contradicted']).describe("The verification status of the claim."),
    reasoning: z.string().describe("A brief explanation of why the claim has the given status based on the source.")
});

const FactCheckTextOutputSchema = z.object({
  claims: z.array(ClaimSchema).describe('An array of fact-checked claims from the text.'),
});
export type FactCheckTextOutput = z.infer<typeof FactCheckTextOutputSchema>;

export async function factCheckText(input: FactCheckTextInput): Promise<FactCheckTextOutput> {
  return factCheckTextFlow(input);
}

const findSourceTool = ai.defineTool(
    {
        name: 'findSourceForClaim',
        description: 'Searches the web to find a reliable source to verify a specific claim.',
        inputSchema: z.object({
            claim: z.string(),
        }),
        outputSchema: z.object({
            url: z.string().url(),
            title: z.string(),
            snippet: z.string(),
        }),
    },
    async ({ claim }) => {
        // This is a mock. A real implementation would use a search API.
        console.log(`Simulating search for claim: ${claim}`);
         if (claim.toLowerCase().includes("moon")) {
             return {
                url: 'https://science.nasa.gov/moon/facts/',
                title: 'Moon Fact Sheet - NASA',
                snippet: 'The Moon is Earth\'s only natural satellite. It is the fifth largest satellite in the Solar System.'
            };
        }
        return {
            url: 'https://www.example.com/source-for-claim',
            title: 'A Generic Source for a Claim',
            snippet: 'This source provides some generic information which may or may not be related to the claim.'
        };
    }
);

const prompt = ai.definePrompt({
  name: 'factCheckPrompt',
  input: {schema: FactCheckTextInputSchema},
  output: {schema: FactCheckTextOutputSchema},
  tools: [findSourceTool],
  prompt: `You are an expert fact-checker for Wikipedia. Your task is to analyze the provided text, identify each individual factual claim, and verify it using reliable sources.

Here is the process:
1.  Read the user's text and break it down into a list of distinct, verifiable claims.
2.  For each claim, use the \`findSourceForClaim\` tool to find a relevant source online.
3.  Analyze the search result (title and snippet) returned by the tool.
4.  Determine if the source supports the claim, contradicts it, or if you cannot determine a clear relationship (unsupported).
5.  For each claim, provide the claim itself, the verification status ('Supported', 'Unsupported', or 'Contradicted'), the source URL you found, and a brief reasoning for your determination.

User's Text:
{{{text}}}

Provide your detailed analysis now.`,
});

const factCheckTextFlow = ai.defineFlow(
  {
    name: 'factCheckTextFlow',
    inputSchema: FactCheckTextInputSchema,
    outputSchema: FactCheckTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
