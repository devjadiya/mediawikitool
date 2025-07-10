'use server';

/**
 * @fileOverview A Genkit flow to suggest sections for expanding a stub article.
 *
 * @exports expandStub - An async function that suggests expansion sections.
 * @exports ExpandStubInput - The input type for the expandStub function.
 * @exports ExpandStubOutput - The output type for the expandStub function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpandStubInputSchema = z.object({
  articleTitle: z.string().describe('The title of the stub article.'),
  existingContent: z.string().describe('The current content of the stub article.'),
});
export type ExpandStubInput = z.infer<typeof ExpandStubInputSchema>;

const ExpandStubOutputSchema = z.object({
  suggestedSections: z.array(z.object({
    title: z.string().describe('The suggested section title (e.g., "History", "Reception").'),
    reasoning: z.string().describe('A brief explanation of why this section would be a good addition.'),
    keyPoints: z.array(z.string()).describe('A few bullet points of information that could be included in this section.'),
  })).describe('A list of suggested sections to add to the article.'),
});
export type ExpandStubOutput = z.infer<typeof ExpandStubOutputSchema>;

export async function expandStub(input: ExpandStubInput): Promise<ExpandStubOutput> {
  return expandStubFlow(input);
}

const prompt = ai.definePrompt({
  name: 'expandStubPrompt',
  input: {schema: ExpandStubInputSchema},
  output: {schema: ExpandStubOutputSchema},
  prompt: `You are an experienced Wikipedia editor who excels at expanding stub articles.
Given the article title and its existing content, suggest 3-5 new sections that could be added to expand it into a more comprehensive article.

For each suggested section, provide a title, a brief reasoning for its inclusion, and a few key points that should be covered.

Article Title: {{{articleTitle}}}

Existing Content:
{{{existingContent}}}

Provide your suggestions for expansion.`,
});

const expandStubFlow = ai.defineFlow(
  {
    name: 'expandStubFlow',
    inputSchema: ExpandStubInputSchema,
    outputSchema: ExpandStubOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
