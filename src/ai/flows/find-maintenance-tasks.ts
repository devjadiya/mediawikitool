'use server';

/**
 * @fileOverview A Genkit flow to find maintenance tasks on Hindi Wikipedia.
 *
 * @exports findMaintenanceTasks - An async function that finds pages needing work.
 * @exports FindMaintenanceTasksInput - The input type for the function.
 * @exports FindMaintenanceTasksOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskTypeSchema = z.enum(['Uncategorizedpages', 'Shortpages']);

const FindMaintenanceTasksInputSchema = z.object({
  taskType: TaskTypeSchema.describe('The type of maintenance task to find.'),
  limit: z.number().min(1).max(50).default(10).describe('The number of pages to return.'),
});
export type FindMaintenanceTasksInput = z.infer<typeof FindMaintenanceTasksInputSchema>;

const PageTaskSchema = z.object({
    title: z.string().describe("The title of the article."),
    url: z.string().url().describe("The full URL to the article on Hindi Wikipedia."),
});

const FindMaintenanceTasksOutputSchema = z.object({
  pages: z.array(PageTaskSchema).describe('A list of pages that match the maintenance task criteria.'),
});
export type FindMaintenanceTasksOutput = z.infer<typeof FindMaintenanceTasksOutputSchema>;

// Tool to query special pages on hi.wikipedia.org
const queryWikiTool = ai.defineTool(
  {
    name: 'querySpecialPages',
    description: 'Queries special pages on Hindi Wikipedia to get lists of articles for maintenance tasks.',
    inputSchema: FindMaintenanceTasksInputSchema,
    outputSchema: FindMaintenanceTasksOutputSchema,
  },
  async ({ taskType, limit }) => {
    const apiUrl = new URL('https://hi.wikipedia.org/w/api.php');
    apiUrl.searchParams.set('action', 'query');
    apiUrl.searchParams.set('list', 'querypage');
    apiUrl.searchParams.set('qppage', taskType);
    apiUrl.searchParams.set('qplimit', limit.toString());
    apiUrl.searchParams.set('qptype', 'page'); // IMPORTANT: Filter for only pages, not other types
    apiUrl.searchParams.set('format', 'json');
    apiUrl.searchParams.set('origin', '*');

    try {
      const response = await fetch(apiUrl.toString());
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      const pages = data.query.querypage.results.map((page: any) => {
          const title = page.title;
          return {
              title: title,
              url: `https://hi.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
          };
      });
      return { pages };
    } catch (error) {
      console.error("Failed to query Wikipedia API:", error);
      return { pages: [] };
    }
  }
);


const prompt = ai.definePrompt({
  name: 'findMaintenanceTasksPrompt',
  input: { schema: FindMaintenanceTasksInputSchema },
  output: { schema: FindMaintenanceTasksOutputSchema },
  tools: [queryWikiTool],
  prompt: `You are an assistant for Wikipedia editors. Your job is to find pages on Hindi Wikipedia that need maintenance.

Use the \`querySpecialPages\` tool with the specified task type ("{{{taskType}}}") and limit ({{{limit}}}) to get a list of pages.

Return the exact list of pages provided by the tool.`,
});


const findMaintenanceTasksFlow = ai.defineFlow(
  {
    name: 'findMaintenanceTasksFlow',
    inputSchema: FindMaintenanceTasksInputSchema,
    outputSchema: FindMaintenanceTasksOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function findMaintenanceTasks(input: FindMaintenanceTasksInput): Promise<FindMaintenanceTasksOutput> {
    return findMaintenanceTasksFlow(input);
}
