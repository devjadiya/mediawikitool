'use server';

/**
 * @fileOverview A Genkit flow to draft a short article on a given topic.
 *
 * @exports draftArticle - An async function that drafts an article.
 * @exports DraftArticleInput - The input type for the draftArticle function.
 * @exports DraftArticleOutput - The output type for the draftArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftArticleInputSchema = z.object({
  topic: z.string().describe('The topic for the new article.'),
});
export type DraftArticleInput = z.infer<typeof DraftArticleInputSchema>;

const DraftArticleOutputSchema = z.object({
  title: z.string().describe('The suggested title for the article.'),
  wikitext: z.string().describe('The drafted article content in wikitext format, including an intro and at least one sourced paragraph.'),
});
export type DraftArticleOutput = z.infer<typeof DraftArticleOutputSchema>;

export async function draftArticle(input: DraftArticleInput): Promise<DraftArticleOutput> {
  return draftArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftArticlePrompt',
  input: {schema: DraftArticleInputSchema},
  output: {schema: DraftArticleOutputSchema},
  prompt: `You are a Wikipedia editor creating a new article.
Based on the topic "{{{topic}}}", draft a short, encyclopedic starter article.

The article must include:
1.  A suitable title.
2.  A lead section (one paragraph).
3.  At least one body paragraph with a citation from a reliable source.
4.  All content must be in proper wikitext format.
5.  IMPORTANT: The generated article (title and wikitext) must be in the same language as the input topic. For example, if the topic is in Hindi, the entire article must be in Hindi.

Draft the article now.`,
});

const draftArticleFlow = ai.defineFlow(
  {
    name: 'draftArticleFlow',
    inputSchema: DraftArticleInputSchema,
    outputSchema: DraftArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
