'use server';

/**
 * @fileOverview A Genkit flow to suggest missing properties for a Wikidata item.
 *
 * @exports propertySuggester - An async function that suggests properties.
 * @exports PropertySuggesterInput - The input type for the function.
 * @exports PropertySuggesterOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PropertySuggesterInputSchema = z.object({
  qId: z.string().regex(/^Q\d+$/, "Please enter a valid Wikidata Q-ID (e.g., Q42)."),
});
export type PropertySuggesterInput = z.infer<typeof PropertySuggesterInputSchema>;

const SuggestedPropertySchema = z.object({
    propertyId: z.string().describe("The Wikidata P-ID of the suggested property (e.g., 'P31')."),
    propertyLabel: z.string().describe("The human-readable label for the property (e.g., 'instance of')."),
    reasoning: z.string().describe("A brief explanation for why this property is relevant and should be added.")
});

const PropertySuggesterOutputSchema = z.object({
  itemLabel: z.string().describe("The English label of the item being analyzed."),
  itemClass: z.string().optional().describe("The primary class of the item (e.g., 'human', 'city')."),
  suggestions: z.array(SuggestedPropertySchema).describe("A list of suggested properties to add to the item."),
});
export type PropertySuggesterOutput = z.infer<typeof PropertySuggesterOutputSchema>;

const WIKIDATA_API_ENDPOINT = 'https://www.wikidata.org/w/api.php';

async function getItemData(qId: string) {
    const url = new URL(WIKIDATA_API_ENDPOINT);
    url.searchParams.set('action', 'wbgetentities');
    url.searchParams.set('ids', qId);
    url.searchParams.set('format', 'json');
    url.searchParams.set('props', 'info|labels|claims');
    url.searchParams.set('origin', '*');

    const response = await fetch(url.toString());
    const data = await response.json();
    return data.entities[qId];
}


export async function propertySuggester(input: PropertySuggesterInput): Promise<PropertySuggesterOutput> {
  const itemData = await getItemData(input.qId);

  if (!itemData) {
    throw new Error("Could not fetch data for the Wikidata item.");
  }
  
  const existingProperties = Object.keys(itemData.claims || {});
  const itemLabel = itemData.labels?.en?.value || input.qId;
  const instanceOfClaim = itemData.claims?.P31?.[0]?.mainsnak?.datavalue?.value?.id;

  const prompt = ai.definePrompt({
    name: 'propertySuggesterPrompt',
    input: { schema: z.object({
        itemLabel: z.string(),
        instanceOf: z.string().optional(),
        existingProperties: z.array(z.string()),
    }) },
    output: { schema: PropertySuggesterOutputSchema },
    prompt: `You are an expert Wikidata editor. Your task is to suggest relevant, missing properties for a given Wikidata item.

The item is: "{{{itemLabel}}}"
It is an instance of: {{{instanceOf}}} (if available)
It already has the following properties: {{{existingProperties}}}

Based on the item's class (e.g., human, city, book), suggest 5-7 important properties that are currently missing. For each suggestion, provide the property ID, its label, and a brief reason why it's a good addition. Do not suggest properties that are already present.

Provide your suggestions now.`,
  });

  const { output } = await prompt({ 
      itemLabel,
      instanceOf: instanceOfClaim,
      existingProperties: existingProperties
  });
  return output!;
}
