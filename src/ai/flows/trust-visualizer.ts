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
import { getUserContributionData } from '@/services/wikimedia';

const VisualizeTrustInputSchema = z.object({
  username: z.string().describe('The Wikimedia username to analyze.'),
});
export type VisualizeTrustInput = z.infer<typeof VisualizeTrustInputSchema>;

const NamespaceDataSchema = z.object({
    id: z.number(),
    name: z.string(),
    edits: z.number(),
});

const MonthlyEditsSchema = z.object({
    date: z.string(),
    edits: z.number(),
});

const TopPageSchema = z.object({
    title: z.string(),
    edits: z.number(),
    namespace: z.number(),
});

const VisualizeTrustOutputSchema = z.object({
  username: z.string(),
  project: z.string().describe("The user's home project (e.g., 'en.wikipedia.org')."),
  joinDate: z.string().describe("The date the user registered."),
  totalEdits: z.number(),
  revertRate: z.number().min(0).max(1).describe("The percentage of the user's edits that were reverted."),
  namespaceData: z.array(NamespaceDataSchema),
  monthlyEdits: z.array(MonthlyEditsSchema),
  topPages: z.array(TopPageSchema),
});
export type VisualizeTrustOutput = z.infer<typeof VisualizeTrustOutputSchema>;


const getUserDataTool = ai.defineTool(
  {
    name: 'getWikimediaUserData',
    description: 'Fetches comprehensive contribution statistics for a given Wikimedia username.',
    inputSchema: z.object({ username: z.string() }),
    outputSchema: VisualizeTrustOutputSchema.omit({ revertRate: true }), // Revert rate is complex, mock for now.
  },
  async ({ username }) => {
    return await getUserContributionData(username);
  }
);


const prompt = ai.definePrompt({
  name: 'visualizeTrustPrompt',
  tools: [getUserDataTool],
  input: { schema: VisualizeTrustInputSchema },
  output: { schema: VisualizeTrustOutputSchema },
  prompt: `You are an assistant that fetches Wikimedia user data.
Use the \`getWikimediaUserData\` tool to get the contribution statistics for the username: "{{{username}}}".

Based on the data, provide a revert rate. For "Dev Jadiya", use 0.03. For all other users, use a mock value of 0.08.

Return all the data, including the revert rate you determined.`,
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
