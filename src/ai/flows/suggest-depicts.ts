'use server';

/**
 * @fileOverview A Genkit flow to suggest structured data "depicts" statements for an image.
 *
 * @exports suggestDepicts - An async function that takes an image and returns Wikidata entity suggestions.
 * @exports SuggestDepictsInput - The input type for the suggestDepicts function.
 * @exports SuggestDepictsOutput - The output type for the suggestDepicts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDepictsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An image to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  context: z.string().optional().describe('Optional user-provided context about what is in the image.'),
});
export type SuggestDepictsInput = z.infer<typeof SuggestDepictsInputSchema>;


const DepictedItemSchema = z.object({
    label: z.string().describe("The human-readable label for the identified entity (e.g., 'Eiffel Tower')."),
    wikidataId: z.string().describe("The corresponding Wikidata Q-ID for the entity (e.g., 'Q243')."),
    reasoning: z.string().describe("A brief explanation of why this entity was identified in the image.")
});

const SuggestDepictsOutputSchema = z.object({
  depictedItems: z.array(DepictedItemSchema).describe('A list of entities depicted in the image, linked to their Wikidata items.'),
});
export type SuggestDepictsOutput = z.infer<typeof SuggestDepictsOutputSchema>;

export async function suggestDepicts(input: SuggestDepictsInput): Promise<SuggestDepictsOutput> {
  return suggestDepictsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDepictsPrompt',
  input: {schema: SuggestDepictsInputSchema},
  output: {schema: SuggestDepictsOutputSchema},
  prompt: `You are an expert at analyzing images and linking their content to Wikidata entities for Wikimedia Commons' Structured Data. Your task is to identify the main subjects (people, objects, concepts, places) in the given image and find their corresponding Wikidata Q-IDs.

- Identify between 1 and 5 key entities.
- For each entity, provide its common English label and its Wikidata Q-ID.
- Provide a brief justification for why you identified each entity.
- If you identify a very generic object like 'tree' or 'sky', try to be more specific if possible (e.g., 'Oak Tree' (Q12914) or 'Blue Sky' (Q1086383)). If not, use the general entity.

Image: {{media url=photoDataUri}}
{{#if context}}
User-provided context: {{{context}}}
{{/if}}

Generate the structured "depicts" statements now.`,
});

const suggestDepictsFlow = ai.defineFlow(
  {
    name: 'suggestDepictsFlow',
    inputSchema: SuggestDepictsInputSchema,
    outputSchema: SuggestDepictsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
