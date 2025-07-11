
'use server';

/**
 * @fileOverview A Genkit flow to predict pageviews for Wikipedia articles.
 *
 * @exports predictPageviews - An async function that takes historical data and returns a prediction.
 * @exports PredictPageviewsInput - The input type for the function.
 * @exports PredictPageviewsOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format, addMonths, eachDayOfInterval } from 'date-fns';

const PageviewDataSchema = z.object({
    title: z.string(),
    pageviews: z.array(z.object({ date: z.string(), views: z.number() })),
    totalViews: z.number(),
    averageDailyViews: z.number(),
});

const PredictPageviewsInputSchema = z.object({
  historicalData: z.array(PageviewDataSchema).describe('An array of historical pageview data for multiple articles over the last year.'),
});
export type PredictPageviewsInput = z.infer<typeof PredictPageviewsInputSchema>;


const PredictionSchema = z.object({
    title: z.string().describe("The title of the article."),
    analysis: z.string().describe("A brief, 1-2 sentence analysis of the article's historical trend and the reason for the future prediction (e.g., 'Due to recurring annual interest, pageviews are expected to spike in December.')"),
    predictedViews: z.array(z.object({
        month: z.string().describe("The predicted month in 'YYYY-MM' format."),
        views: z.number().describe("The predicted total pageviews for that month.")
    })).length(3).describe("An array of predicted pageviews for the next 3 months."),
});

const PredictPageviewsOutputSchema = z.object({
  predictions: z.array(PredictionSchema),
  chartData: z.array(z.record(z.union([z.string(), z.number()]))).describe("Data formatted for a Recharts line chart, including historical and predicted values."),
});
export type PredictPageviewsOutput = z.infer<typeof PredictPageviewsOutputSchema>;

const prompt = ai.definePrompt({
    name: 'pageviewPredictionPrompt',
    input: { schema: PredictPageviewsInputSchema },
    output: { schema: z.object({ predictions: z.array(PredictionSchema) }) },
    prompt: `You are a data analyst specializing in time-series forecasting for Wikipedia pageviews. You will be given historical daily pageview data for one or more articles covering the last 12 months.

Your task is to:
1.  Analyze the historical trends for each article. Look for seasonality, recent growth or decline, and any obvious patterns.
2.  For each article, provide a brief (1-2 sentence) analysis explaining the trend.
3.  For each article, generate a realistic pageview prediction for the next 3 months. The prediction should be a single number representing the total views for each month.

Historical Data:
{{{json historicalData}}}

Provide your detailed analysis and predictions for all articles now.`
});


export async function predictPageviews(input: PredictPageviewsInput): Promise<PredictPageviewsOutput> {
  const { output } = await prompt(input);
  if (!output) {
    throw new Error("Failed to get a prediction from the AI.");
  }
  
  const { predictions } = output;
  const chartData = formatDataForChart(input.historicalData, predictions);
  
  return { predictions, chartData };
}

// Helper function to transform data for Recharts
function formatDataForChart(historicalData: z.infer<typeof PredictPageviewsInputSchema>['historicalData'], predictions: PredictionSchema[]): any[] {
  const allDates = new Set<string>();
  const dataByDate: Record<string, Record<string, number | string>> = {};

  // Process historical data
  historicalData.forEach(article => {
    article.pageviews.forEach(day => {
      const month = format(new Date(day.date), 'MMM yyyy');
      allDates.add(month);
      if (!dataByDate[month]) dataByDate[month] = { date: month };
      if (!dataByDate[month][article.title]) dataByDate[month][article.title] = 0;
      (dataByDate[month][article.title] as number) += day.views;
    });
  });
  
  // Process predicted data
  predictions.forEach(article => {
    article.predictedViews.forEach(pred => {
      const month = format(new Date(pred.month), 'MMM yyyy');
      allDates.add(month);
      if (!dataByDate[month]) dataByDate[month] = { date: month };
      dataByDate[month][`${article.title} (predicted)`] = pred.views;
    });
  });

  const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return sortedDates.map(date => dataByDate[date]);
}
