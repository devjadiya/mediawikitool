'use server';

/**
 * @fileOverview A Genkit flow to generate a formatted Wikidata reference from a URL.
 *
 * @exports referenceResolver - An async function that takes a Q-ID and URL and returns a formatted reference.
 * @exports ReferenceResolverInput - The input type for the function.
 * @exports ReferenceResolverOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { extract } from '@extractus/article-extractor'

const ReferenceResolverInputSchema = z.object({
  qId: z.string().regex(/^Q\d+$/, "Please enter a valid Wikidata Q-ID (e.g., Q42)."),
  url: z.string().url("Please provide a valid URL for the source."),
});
export type ReferenceResolverInput = z.infer<typeof ReferenceResolverInputSchema>;

const ReferenceResolverOutputSchema = z.object({
  wikitext: z.string().describe("The fully formatted <ref>{{cite web|...}}</ref> wikitext."),
  summary: z.string().describe("A summary of the extracted reference details."),
});
export type ReferenceResolverOutput = z.infer<typeof ReferenceResolverOutputSchema>;


const extractArticleTool = ai.defineTool(
    {
        name: 'extractArticleContentForReference',
        description: 'Extracts the main content, title, author, and publication date from a given URL.',
        inputSchema: z.object({ url: z.string().url() }),
        outputSchema: z.object({
            title: z.string().optional(),
            author: z.string().optional(),
            published: z.string().optional(), // Publication date
            content: z.string().optional()
        }),
    },
    async ({ url }) => {
        try {
            const article = await extract(url);
            return { 
                title: article?.title,
                author: article?.author,
                published: article?.published,
                content: article?.content?.substring(0, 500) // Provide a snippet for context
            };
        } catch (e) {
            console.error(`Failed to extract article from ${url}`, e);
            return { title: '', content: `Failed to extract content from URL: ${url}.` };
        }
    }
);


const prompt = ai.definePrompt({
    name: 'referenceResolverPrompt',
    input: { schema: z.object({
        qId: z.string(),
        url: z.string().url(),
        article: z.object({
            title: z.any(),
            author: z.any(),
            published: z.any(),
            content: z.any(),
        })
    })},
    output: { schema: ReferenceResolverOutputSchema },
    prompt: `You are an expert at creating citations for Wikidata. A user wants to add a reference for item {{{qId}}}.

1.  Analyze the extracted metadata from the source URL: {{{url}}}.
    - Title: {{{article.title}}}
    - Author: {{{article.author}}}
    - Published Date: {{{article.published}}}
    - Content Snippet: {{{article.content}}}
2.  Using this information, create a complete, well-formatted wikitext reference. The format should be: \`<ref>{{cite web|url=...|title=...|author=...|date=...|website=...|access-date=...}}</ref>\`.
3.  The 'website' should be the domain name of the URL.
4.  The 'access-date' should be today's date in YYYY-MM-DD format.
5.  Provide a brief summary of the information you extracted.

Provide the reference and summary.`,
});


export async function referenceResolver(input: ReferenceResolverInput): Promise<ReferenceResolverOutput> {
  const article = await extractArticleTool({url: input.url});

  if (!article.title) {
      throw new Error("Could not extract a title from the URL. Please try a different source.");
  }
  
  const {output} = await prompt({ 
      qId: input.qId,
      url: input.url,
      article
  });
  return output!;
}
