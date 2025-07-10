'use server';

/**
 * @fileOverview A Genkit flow to visualize user trust and contribution patterns.
 *
 * @exports visualizeTrust - An async function that gets user data.
 * @exports VisualizeTrustInput - The input type for the function.
 * @exports VisualizeTrustOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualizeTrustInputSchema = z.object({
  username: z.string().describe('The Wikimedia username to analyze.'),
});
export type VisualizeTrustInput = z.infer<typeof VisualizeTrustInputSchema>;

const NamespaceStatSchema = z.object({
    name: z.string().describe("The name of the namespace (e.g., 'Main', 'User')."),
    edits: z.number().describe("The number of edits in this namespace."),
});

const CategoryStatSchema = z.object({
    name: z.string().describe("The name of the category."),
    pages: z.number().describe("The number of pages edited in this category.")
});

const VisualizeTrustOutputSchema = z.object({
  username: z.string(),
  project: z.string().describe("The user's home project (e.g., 'hi.wikipedia.org')."),
  joinDate: z.string().describe("The date the user registered."),
  totalEdits: z.number(),
  revertRate: z.number().min(0).max(1).describe("The percentage of the user's edits that were reverted."),
  topCategories: z.array(CategoryStatSchema).describe("The top categories the user edits in."),
});
export type VisualizeTrustOutput = z.infer<typeof VisualizeTrustOutputSchema>;


const getUserDataTool = ai.defineTool(
  {
    name: 'getWikimediaUserData',
    description: 'Fetches contribution statistics for a given Wikimedia username.',
    inputSchema: z.object({ username: z.string() }),
    outputSchema: z.object({
      project: z.string(),
      joinDate: z.string(),
      totalEdits: z.number(),
      revertRate: z.number(),
      topCategories: z.array(CategoryStatSchema),
    }),
  },
  async ({ username }) => {
    // This is a mock. In a real app, this would call the MediaWiki API.
    console.log(`Simulating API call for user: ${username}`);
    // Let's return different data for a known user.
    if (username.toLowerCase().includes("dev jadiya")) {
        return {
            project: 'hi.wikipedia.org',
            joinDate: '2022-01-15',
            totalEdits: 1230,
            revertRate: 0.13,
            topCategories: [
                { name: 'Cybersecurity', pages: 40 },
                { name: 'Programming', pages: 25 },
                { name: 'Indian History', pages: 12 },
            ],
        };
    }
    // Default mock data for other users.
    return {
      project: 'en.wikipedia.org',
      joinDate: '2023-05-20',
      totalEdits: 542,
      revertRate: 0.08,
      topCategories: [
          { name: 'Music', pages: 50 },
          { name: 'Technology', pages: 30 },
          { name: 'Sports', pages: 15 },
      ],
    };
  }
);


const prompt = ai.definePrompt({
  name: 'visualizeTrustPrompt',
  tools: [getUserDataTool],
  input: { schema: VisualizeTrustInputSchema },
  output: { schema: VisualizeTrustOutputSchema },
  prompt: `You are an assistant that fetches Wikimedia user data.
Use the \`getWikimediaUserData\` tool to get the contribution statistics for the username: "{{{username}}}".
Return the data exactly as the tool provides it, but add the username to the final output.`,
});

const visualizeTrustFlow = ai.defineFlow(
  {
    name: 'visualizeTrustFlow',
    inputSchema: VisualizeTrustInputSchema,
    outputSchema: VisualizeTrustOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function visualizeTrust(input: VisualizeTrustInput): Promise<VisualizeTrustOutput> {
    return visualizeTrustFlow(input);
}
