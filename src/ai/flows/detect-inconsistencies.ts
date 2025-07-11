'use server';

/**
 * @fileOverview A Genkit flow to detect factual inconsistencies between two articles.
 *
 * @exports detectInconsistencies - An async function that compares two articles.
 * @exports DetectInconsistenciesInput - The input type for the function.
 * @exports DetectInconsistenciesOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { extract } from '@extractus/article-extractor'

const DetectInconsistenciesInputSchema = z.object({
  url1: z.string().url("Please provide a valid URL for the first article."),
  url2: z.string().url("Please provide a valid URL for the second article."),
});
export type DetectInconsistenciesInput = z.infer<typeof DetectInconsistenciesInputSchema>;

const FactSchema = z.object({
    label: z.string().describe("The label for the fact being compared (e.g., 'Population', 'Founded Date')."),
    value1: z.string().describe("The value of the fact from the first article."),
    value2: z.string().describe("The value of the fact from the second article."),
    isConsistent: z.boolean().describe("Whether the values are consistent or not.")
});

const DetectInconsistenciesOutputSchema = z.object({
  summary: z.string().describe("A high-level summary of the comparison and any major discrepancies found."),
  facts: z.array(FactSchema).describe("A list of key facts compared between the two articles."),
});
export type DetectInconsistenciesOutput = z.infer<typeof DetectInconsistenciesOutputSchema>;


const extractArticleTool = ai.defineTool(
    {
        name: 'extractArticleContent',
        description: 'Extracts the main content and title from a given URL.',
        inputSchema: z.object({ url: z.string().url() }),
        outputSchema: z.object({
            title: z.string().optional(),
            content: z.string().optional()
        }).nullable(),
    },
    async ({ url }) => {
        try {
            const article = await extract(url);
            return { title: article?.title, content: article?.content };
        } catch (e) {
            console.error(`Failed to extract article from ${url}`, e);
            // Return null to indicate failure
            return null;
        }
    }
);


const prompt = ai.definePrompt({
    name: 'detectInconsistenciesPrompt',
    input: { schema: z.object({
        article1: z.object({ title: z.string(), content: z.string() }),
        article2: z.object({ title: z.string(), content: z.string() })
    })},
    output: { schema: DetectInconsistenciesOutputSchema },
    prompt: `You are an expert data analyst specializing in comparing documents for factual inconsistencies. You will be given content from two articles on the same topic from different language Wikipedias.

Your task is to:
1.  Read the content from both articles.
2.  Identify key numerical and named-entity facts (e.g., dates, population figures, key personnel, locations).
3.  Compare these facts side-by-side.
4.  For each comparison, determine if the facts are consistent. Small variations in formatting are okay (e.g., "1.2 million" vs "1,200,000"), but significant differences are not.
5.  Provide a high-level summary of your findings.

Article 1 Title: {{{article1.title}}}
Article 1 Content: {{{article1.content}}}

Article 2 Title: {{{article2.title}}}
Article 2 Content: {{{article2.content}}}

Provide your detailed analysis now.`
});


export async function detectInconsistencies(input: DetectInconsistenciesInput): Promise<DetectInconsistenciesOutput> {
  const [article1Result, article2Result] = await Promise.all([
      extractArticleTool({url: input.url1}),
      extractArticleTool({url: input.url2})
  ]);

  if (!article1Result || !article2Result || !article1Result.content || !article2Result.content) {
      throw new Error("Could not extract content from one or both URLs. Please check the URLs and try again.");
  }
  
  const article1 = {
      title: article1Result.title || '',
      content: article1Result.content || '',
  }

  const article2 = {
      title: article2Result.title || '',
      content: article2Result.content || '',
  }

  const {output} = await prompt({ article1, article2 });
  return output!;
}
