
'use server';

/**
 * @fileOverview A Genkit flow to predict which article an image would have the most impact on.
 *
 * @exports pageviewPredictor - An async function that takes an image and article titles.
 * @exports PageviewPredictorInput - The input type for the function.
 * @exports PageviewPredictorOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getPageviews } from '@/services/wikimedia';
import { format, subMonths } from 'date-fns';

const PageviewPredictorInputSchema = z.object({
    photoDataUri: z.string().describe("The image to analyze, as a data URI."),
    articleTitles: z.array(z.string()).min(2, "Please provide at least two article titles to compare."),
    project: z.string().default('en.wikipedia.org').describe("The Wikimedia project to search (e.g., 'en.wikipedia.org').")
});
export type PageviewPredictorInput = z.infer<typeof PageviewPredictorInputSchema>;

const ArticleAnalysisSchema = z.object({
    title: z.string(),
    totalViews: z.number().describe("Total pageviews over the last month."),
    averageDailyViews: z.number().describe("Average daily pageviews."),
    relevanceScore: z.number().min(0).max(1).describe("A score (0-1) indicating how relevant the image is to the article's topic."),
    pageviews: z.array(z.object({ date: z.string(), views: z.number() }))
});

const PageviewPredictorOutputSchema = z.object({
  recommendation: z.string().describe("The title of the article recommended for the image."),
  reasoning: z.string().describe("A brief explanation for the recommendation."),
  analysis: z.array(ArticleAnalysisSchema)
});
export type PageviewPredictorOutput = z.infer<typeof PageviewPredictorOutputSchema>;

// Tool to get pageviews for an article
const getPageviewsTool = ai.defineTool(
    {
        name: 'getPageviewsForArticle',
        description: 'Fetches the daily pageviews for a given Wikipedia article over the last 30 days.',
        inputSchema: z.object({ pageName: z.string(), project: z.string() }),
        outputSchema: z.object({
            pageviews: z.array(z.object({ date: z.string(), views: z.number() }))
        }),
    },
    async ({ pageName, project }) => {
        const endDate = new Date();
        const startDate = subMonths(endDate, 1);
        
        const params = {
            project,
            pageName,
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
            platform: 'all-access',
            agent: 'user'
        };
        return await getPageviews(params);
    }
);

const pageviewPredictorFlow = ai.defineFlow(
  {
    name: 'pageviewPredictorFlow',
    inputSchema: PageviewPredictorInputSchema,
    outputSchema: PageviewPredictorOutputSchema,
  },
  async (input) => {
    // 1. Fetch pageview data for all articles in parallel
    const pageviewData = await Promise.all(
        input.articleTitles.map(title => getPageviewsTool({
            pageName: title,
            project: input.project,
        }))
    );

    const promptInput = {
        photoDataUri: input.photoDataUri,
        articles: input.articleTitles.map((title, index) => {
            const views = pageviewData[index].pageviews;
            const totalViews = views.reduce((sum, day) => sum + day.views, 0);
            return {
                title,
                totalViews,
                averageDailyViews: Math.round(totalViews / (views.length || 1)),
            };
        })
    };

    // 2. Ask the LLM to analyze relevance and make a recommendation
    const llmResponse = await ai.generate({
        prompt: `You are an expert Wikipedia editor who specializes in illustrating articles with images to maximize reader engagement.
        
Your task is to recommend the best article for the provided image based on two factors:
1.  **Relevance**: How well does the image match the subject of the article?
2.  **Traffic**: How many views does the article get? An image has more impact on a high-traffic page.

**Image to analyze:**
{{media url=photoDataUri}}

**Article Data:**
{{#each articles}}
- **{{title}}**: 
  - Total Monthly Views: {{totalViews}}
  - Average Daily Views: {{averageDailyViews}}
{{/each}}

**Instructions:**
1.  For each article, determine a 'relevanceScore' from 0.0 (not relevant) to 1.0 (highly relevant) based on the image.
2.  Based on a combination of the relevance score and the pageview data, decide which article is the best fit for the image. The ideal choice is both highly relevant and has high traffic.
3.  Provide a final 'recommendation' and a brief 'reasoning' for your choice.
4.  Return the full analysis for all articles.`,
        input: promptInput,
        output: { schema: PageviewPredictorOutputSchema }
    });

    const result = llmResponse.output;

    // 3. Combine LLM analysis with the fetched pageview data
    if (result) {
        result.analysis.forEach((analysisItem, index) => {
            analysisItem.pageviews = pageviewData[index].pageviews;
        });
        return result;
    }

    throw new Error("Failed to get a valid response from the AI model.");
  }
);

export async function pageviewPredictor(input: PageviewPredictorInput): Promise<PageviewPredictorOutput> {
  return pageviewPredictorFlow(input);
}
