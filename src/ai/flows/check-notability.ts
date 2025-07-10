'use server';

/**
 * @fileOverview A Genkit flow to assist in checking if a topic meets Wikipedia's notability guidelines.
 *
 * @exports checkNotability - An async function that checks a topic.
 * @exports CheckNotabilityInput - The input type for the function.
 * @exports CheckNotabilityOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckNotabilityInputSchema = z.object({
  topic: z.string().describe('The topic or title of the potential new article.'),
});
export type CheckNotabilityInput = z.infer<typeof CheckNotabilityInputSchema>;

const SourceSchema = z.object({
    url: z.string().url().describe("The URL of the found source."),
    title: z.string().describe("The title of the source."),
    isIndependent: z.boolean().describe("Whether the source is independent of the subject."),
    isReliable: z.boolean().describe("Whether the source is considered reliable (e.g., mainstream news, academic journal).")
});

const CheckNotabilityOutputSchema = z.object({
  assessment: z.enum([
    'Likely Notable',
    'Possibly Notable',
    'Unlikely to be Notable'
  ]).describe("The AI's assessment of the topic's notability based on found sources."),
  reasoning: z.string().describe("A summary of the reasoning for the notability assessment."),
  sources: z.array(SourceSchema).describe("A list of up to 5 significant sources found that discuss the topic."),
});
export type CheckNotabilityOutput = z.infer<typeof CheckNotabilityOutputSchema>;

export async function checkNotability(input: CheckNotabilityInput): Promise<CheckNotabilityOutput> {
  return checkNotabilityFlow(input);
}

// This tool simulates searching for sources online.
const findSourcesTool = ai.defineTool(
    {
        name: 'findSourcesForNotability',
        description: 'Searches the web for reliable, independent sources that provide significant coverage of a topic.',
        inputSchema: z.object({ query: z.string() }),
        outputSchema: z.array(SourceSchema),
    },
    async ({ query }) => {
        // This is a mock. In a real app, this would use a search API.
        console.log(`Simulating search for sources about: ${query}`);
        if (query.toLowerCase().includes("sati")) {
            return [
                { url: 'https://www.example-times.com/sati-profile', title: 'Samrat Ashok Technological Institute: A Hub of Innovation - Example Times', isIndependent: true, isReliable: true },
                { url: 'https://www.education-quarterly.edu/research/sati-impact', title: 'A Study on Engineering Education in India - Education Quarterly', isIndependent: true, isReliable: true },
                { url: 'https://www.sati.ac.in/about', title: 'About Us - Official SATI Website', isIndependent: false, isReliable: true },
            ];
        }
        return [
            { url: 'https://www.example.com/mention', title: 'A brief mention of the topic', isIndependent: true, isReliable: true },
        ];
    }
);


const prompt = ai.definePrompt({
  name: 'checkNotabilityPrompt',
  input: {schema: CheckNotabilityInputSchema},
  output: {schema: CheckNotabilityOutputSchema},
  tools: [findSourcesTool],
  prompt: `You are an expert Wikipedia editor specializing in notability guidelines. Your task is to assess whether a given topic is likely to be notable enough for its own article.

The General Notability Guideline requires "significant coverage" in "reliable sources" that are "independent of the subject".

1.  Use the \`findSourcesForNotability\` tool to search for sources about the topic: "{{{topic}}}".
2.  Analyze the sources provided by the tool. Evaluate if they constitute significant coverage and are reliable and independent.
3.  Based on your analysis, provide an overall assessment: 'Likely Notable', 'Possibly Notable', or 'Unlikely to be Notable'.
4.  Write a brief reasoning for your assessment, referencing the quality and quantity of the sources.
5.  List the sources you found.

Provide your complete analysis now.`,
});

const checkNotabilityFlow = ai.defineFlow(
  {
    name: 'checkNotabilityFlow',
    inputSchema: CheckNotabilityInputSchema,
    outputSchema: CheckNotabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
