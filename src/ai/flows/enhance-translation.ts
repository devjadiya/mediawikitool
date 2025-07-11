'use server';

/**
 * @fileOverview A Genkit flow to enhance a translation by finding missing sections and translating them.
 *
 * @exports enhanceTranslation - An async function that compares two articles and provides translated content for missing sections.
 * @exports EnhanceTranslationInput - The input type for the function.
 * @exports EnhanceTranslationOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { extract } from '@extractus/article-extractor'

const EnhanceTranslationInputSchema = z.object({
  sourceUrl: z.string().url("Please provide a valid URL for the source (English) article."),
  targetUrl: z.string().url("Please provide a valid URL for the target (Hindi) article."),
});
export type EnhanceTranslationInput = z.infer<typeof EnhanceTranslationInputSchema>;

const TranslatedSectionSchema = z.object({
    title: z.string().describe("The heading or title of the missing section."),
    translatedContent: z.string().describe("The translated content of the section in well-formatted Hindi wikitext."),
    originalContent: z.string().describe("The original English content of the section for comparison.")
});

const EnhanceTranslationOutputSchema = z.object({
  summary: z.string().describe("A high-level summary of the translation enhancement recommendations."),
  suggestedSections: z.array(TranslatedSectionSchema).describe("A list of translated sections suggested for addition to the target article."),
});
export type EnhanceTranslationOutput = z.infer<typeof EnhanceTranslationOutputSchema>;


const extractArticleTool = ai.defineTool(
    {
        name: 'extractArticleContent',
        description: 'Extracts the main content and title from a given URL.',
        inputSchema: z.object({ url: z.string().url() }),
        outputSchema: z.object({
            title: z.string().optional(),
            content: z.string().optional()
        }),
    },
    async ({ url }) => {
        try {
            const article = await extract(url);
            return { title: article?.title, content: article?.content };
        } catch (e) {
            console.error(`Failed to extract article from ${url}`, e);
            return { title: '', content: `Failed to extract content from URL: ${url}.` };
        }
    }
);

const PromptInputSchema = z.object({
  sourceArticle: z.object({ title: z.string(), content: z.string() }),
  targetArticle: z.object({ title: z.string(), content: z.string() })
});

const prompt = ai.definePrompt({
    name: 'enhanceTranslationPrompt',
    input: { schema: PromptInputSchema },
    output: { schema: EnhanceTranslationOutputSchema },
    prompt: `You are an expert Wikipedia editor and translator. Your task is to enhance a Hindi Wikipedia article by comparing it to its English counterpart and translating missing sections.

Here is your process:
1.  Analyze the headings and structure of both the English source article and the Hindi target article.
2.  Identify major sections (using H2 or '==' headings as a guide) that exist in the English article but are completely missing from the Hindi article.
3.  For each missing section you identify, translate the full content of that section from English to high-quality, fluent Hindi. Ensure all wikitext formatting (like links [[...]], templates {{...}}, and bold/italics) is preserved correctly.
4.  Provide a summary of the sections you have identified and translated.
5.  Return a list of these suggested new sections, including the section title, the original English content, and the newly translated Hindi wikitext.

Source (English) Article Title: {{{sourceArticle.title}}}
Source (English) Content:
{{{sourceArticle.content}}}

Target (Hindi) Article Title: {{{targetArticle.title}}}
Target (Hindi) Content:
{{{targetArticle.content}}}

Provide your detailed translation enhancement analysis now.`
});


export async function enhanceTranslation(input: EnhanceTranslationInput): Promise<EnhanceTranslationOutput> {
  const [sourceArticleResult, targetArticleResult] = await Promise.all([
      extractArticleTool({url: input.sourceUrl}),
      extractArticleTool({url: input.targetUrl})
  ]);

  if (!sourceArticleResult.content || !targetArticleResult.content) {
      throw new Error("Could not extract content from one or both URLs. Please check the URLs and try again.");
  }
  
  const sourceArticle = {
      title: sourceArticleResult.title || '',
      content: sourceArticleResult.content || '',
  }

  const targetArticle = {
      title: targetArticleResult.title || '',
      content: targetArticleResult.content || '',
  }

  const {output} = await prompt({ sourceArticle, targetArticle });
  return output!;
}
