'use server';

/**
 * @fileOverview A Genkit flow to generate a conventional commit message.
 *
 * @exports generateCommit - An async function that generates a commit message.
 * @exports GenerateCommitInput - The input type for the generateCommit function.
 * @exports GenerateCommitOutput - The output type for the generateCommit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommitInputSchema = z.object({
  diff: z.string().describe('The git diff of the changes.'),
});
export type GenerateCommitInput = z.infer<typeof GenerateCommitInputSchema>;

const GenerateCommitOutputSchema = z.object({
  commitMessage: z.string().describe('The generated conventional commit message.'),
});
export type GenerateCommitOutput = z.infer<typeof GenerateCommitOutputSchema>;

export async function generateCommit(input: GenerateCommitInput): Promise<GenerateCommitOutput> {
  return generateCommitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCommitPrompt',
  input: {schema: GenerateCommitInputSchema},
  output: {schema: GenerateCommitOutputSchema},
  prompt: `You are an expert developer who writes excellent, conventional commit messages.
Analyze the following git diff and generate a concise and descriptive conventional commit message.

The message should follow the format: <type>(<scope>): <subject>

Diff:
\`\`\`diff
{{{diff}}}
\`\`\`

Generate the commit message.`,
});

const generateCommitFlow = ai.defineFlow(
  {
    name: 'generateCommitFlow',
    inputSchema: GenerateCommitInputSchema,
    outputSchema: GenerateCommitOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
