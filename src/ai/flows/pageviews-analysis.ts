'use server';

/**
 * @fileOverview A Genkit flow to analyze Wikimedia pageviews.
 *
 * @exports getPageviewsData - An async function that gets pageview data.
 * @exports PageviewsInput - The input type for the function.
 * @exports PageviewsOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getPageviews } from '@/services/wikimedia';

const PageviewsInputSchema = z.object({
  project: z.string().describe('The Wikimedia project (e.g., en.wikipedia.org).'),
  pageName: z.string().describe('The name of the page.'),
  startDate: z.string().describe('The start date in YYYY-MM-DD format.'),
  endDate: z.string().describe('The end date in YYYY-MM-DD format.'),
  platform: z.enum(['all-access', 'desktop', 'mobile-app', 'mobile-web']).describe('The platform to get views for.'),
  agent: z.enum(['all-agents', 'user', 'spider', 'automated']).describe('The agent type.'),
});
export type PageviewsInput = z.infer<typeof PageviewsInputSchema>;


const PageviewItemSchema = z.object({
    date: z.string().describe("The date of the pageview count, in YYYY-MM-DD format."),
    views: z.number().describe("The number of views for that day."),
});

const PageviewsOutputSchema = z.object({
    pageviews: z.array(PageviewItemSchema).describe('A list of daily pageview counts for the requested page.'),
});
export type PageviewsOutput = z.infer<typeof PageviewsOutputSchema>;

const getPageviewsTool = ai.defineTool(
  {
    name: 'getPageviewsData',
    description: 'Fetches daily pageview statistics for a given Wikimedia page.',
    inputSchema: PageviewsInputSchema,
    outputSchema: PageviewsOutputSchema,
  },
  async (input) => {
    return await getPageviews(input);
  }
);

const prompt = ai.definePrompt({
  name: 'pageviewsAnalysisPrompt',
  tools: [getPageviewsTool],
  input: { schema: PageviewsInputSchema },
  output: { schema: PageviewsOutputSchema },
  prompt: `You are an assistant that fetches Wikimedia pageview data.
Use the \`getPageviewsData\` tool with the provided parameters to get the statistics.
Return the data exactly as the tool provides it.

Project: {{{project}}}
Page: {{{pageName}}}
Start Date: {{{startDate}}}
End Date: {{{endDate}}}
Platform: {{{platform}}}
Agent: {{{agent}}}
`,
});

const pageviewsAnalysisFlow = ai.defineFlow(
  {
    name: 'pageviewsAnalysisFlow',
    inputSchema: PageviewsInputSchema,
    outputSchema: PageviewsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function getPageviewsData(input: PageviewsInput): Promise<PageviewsOutput> {
    return pageviewsAnalysisFlow(input);
}
