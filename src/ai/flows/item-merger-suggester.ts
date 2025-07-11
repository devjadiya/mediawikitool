'use server';

/**
 * @fileOverview A Genkit flow to suggest if two Wikidata items should be merged.
 *
 * @exports itemMergerSuggester - An async function that compares two Wikidata items.
 * @exports ItemMergerSuggesterInput - The input type for the function.
 * @exports ItemMergerSuggesterOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ItemMergerSuggesterInputSchema = z.object({
  item1Id: z.string().regex(/^Q\d+$/, "Please enter a valid Wikidata Q-ID (e.g., Q42)."),
  item2Id: z.string().regex(/^Q\d+$/, "Please enter a valid Wikidata Q-ID (e.g., Q42)."),
});
export type ItemMergerSuggesterInput = z.infer<typeof ItemMergerSuggesterInputSchema>;

const StatementComparisonSchema = z.object({
    property: z.string().describe("The property being compared (e.g., 'instance of', 'date of birth')."),
    item1Value: z.string().describe("The value of the statement for the first item."),
    item2Value: z.string().describe("The value of the statement for the second item."),
    areConsistent: z.boolean().describe("Whether the values for this property are consistent or conflicting.")
});

const ItemMergerSuggesterOutputSchema = z.object({
  recommendation: z.enum(['Merge', 'Do Not Merge', 'Uncertain']).describe("The AI's final recommendation."),
  confidence: z.number().min(0).max(1).describe("The confidence score (0-1) for the recommendation."),
  reasoning: z.string().describe("A summary of the reasoning for the recommendation, highlighting key similarities or conflicts."),
  comparison: z.array(StatementComparisonSchema).describe("A list of key statements compared between the two items.")
});
export type ItemMergerSuggesterOutput = z.infer<typeof ItemMergerSuggesterOutputSchema>;

const WIKIDATA_API_ENDPOINT = 'https://www.wikidata.org/w/api.php';

async function getItemData(qId: string) {
    const url = new URL(WIKIDATA_API_ENDPOINT);
    url.searchParams.set('action', 'wbgetentities');
    url.searchParams.set('ids', qId);
    url.searchParams.set('format', 'json');
    url.searchParams.set('props', 'info|labels|descriptions|claims');
    url.searchParams.set('origin', '*');

    const response = await fetch(url.toString());
    const data = await response.json();
    return data.entities[qId];
}


export async function itemMergerSuggester(input: ItemMergerSuggesterInput): Promise<ItemMergerSuggesterOutput> {
  const [item1Data, item2Data] = await Promise.all([
    getItemData(input.item1Id),
    getItemData(input.item2Id),
  ]);

  if (!item1Data || !item2Data) {
    throw new Error("Could not fetch data for one or both Wikidata items.");
  }
  
  // Create simplified text representations for the prompt
  const formatItemForPrompt = (item: any) => {
    const label = item.labels?.en?.value || 'No English label';
    const description = item.descriptions?.en?.value || 'No English description';
    const claims = Object.values(item.claims || {}).flat().map((claim: any) => {
        // This is a simplification; a real tool would need to resolve property and value IDs to labels.
        // For the AI's purpose, the raw data structure is often sufficient.
        const propertyId = claim.mainsnak.property;
        const value = claim.mainsnak.datavalue?.value;
        let valueStr = 'Complex Value';
        if(typeof value === 'string') valueStr = value;
        if(typeof value === 'object' && value !== null) valueStr = JSON.stringify(value);
        return `${propertyId}: ${valueStr}`;
    }).join('\n');
    return `ID: ${item.id}\nLabel: ${label}\nDescription: ${description}\nClaims:\n${claims}`;
  }
  
  const item1Text = formatItemForPrompt(item1Data);
  const item2Text = formatItemForPrompt(item2Data);

  const prompt = ai.definePrompt({
    name: 'itemMergerPrompt',
    input: { schema: z.object({ item1Text: z.string(), item2Text: z.string() }) },
    output: { schema: ItemMergerSuggesterOutputSchema },
    prompt: `You are an expert Wikidata editor specializing in identifying and merging duplicate items. Analyze the data for the two Wikidata items provided below.

Your task is to:
1.  Compare the labels, descriptions, and claims for both items.
2.  Identify key statements that are identical, similar, or conflicting.
3.  Based on your analysis, make a recommendation: 'Merge', 'Do Not Merge', or 'Uncertain'.
4.  Provide a confidence score for your recommendation.
5.  Write a brief reasoning for your decision, referencing specific claims.
6.  Create a comparison table of the most important statements.

Item 1 Data:
---
{{{item1Text}}}
---

Item 2 Data:
---
{{{item2Text}}}
---

Provide your full analysis now.`,
  });

  const { output } = await prompt({ item1Text, item2Text });
  return output!;
}
