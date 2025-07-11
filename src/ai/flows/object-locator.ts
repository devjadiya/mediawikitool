'use server';

/**
 * @fileOverview A Genkit flow to identify multiple objects in an image and return their bounding boxes.
 *
 * @exports locateObjects - An async function that takes an image and returns identified objects with coordinates.
 * @exports LocateObjectsInput - The input type for the locateObjects function.
 * @exports LocateObjectsOutput - The output type for the locateObjects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchWikidataEntities } from '@/services/wikimedia';

const LocateObjectsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An image to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  context: z.string().optional().describe('Optional user-provided context about the image.'),
});
export type LocateObjectsInput = z.infer<typeof LocateObjectsInputSchema>;


const LocatedObjectSchema = z.object({
    label: z.string().describe("The human-readable label for the identified object (e.g., 'Eiffel Tower', 'Tom Cat', 'Jerry Mouse')."),
    wikidataId: z.string().optional().describe("The corresponding Wikidata Q-ID for the object (e.g., 'Q243' for Eiffel Tower). This must only be provided if a suitable entity is found using the search tool."),
    box: z.array(z.number()).length(4).describe("The bounding box of the object in [x_min, y_min, x_max, y_max] format. Coordinates are normalized between 0 and 1.")
});

const LocateObjectsOutputSchema = z.object({
  objects: z.array(LocatedObjectSchema).describe('A list of objects identified in the image, with their bounding boxes and Wikidata IDs.'),
});
export type LocateObjectsOutput = z.infer<typeof LocateObjectsOutputSchema>;


const wikidataSearchTool = ai.defineTool(
  {
    name: 'searchWikidataEntities',
    description: 'Searches Wikidata for entities matching a query and returns a list of candidates with their descriptions, which are crucial for disambiguation.',
    inputSchema: z.object({
      query: z.string().describe("The search term (e.g., 'Tom Cat')."),
      description: z.string().optional().describe("A brief description for context (e.g., 'from the cartoon Tom and Jerry').")
    }),
    outputSchema: z.array(z.object({
      id: z.string(),
      label: z.string(),
      description: z.string().optional(),
    })),
  },
  async ({ query, description }) => {
    return await searchWikidataEntities(query, description);
  }
);


export async function locateObjects(input: LocateObjectsInput): Promise<LocateObjectsOutput> {
  return locateObjectsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'locateObjectsPrompt',
  input: {schema: LocateObjectsInputSchema},
  output: {schema: LocateObjectsOutputSchema},
  tools: [wikidataSearchTool],
  prompt: `You are an expert at analyzing images and identifying all significant objects within them, linking them to Wikidata. Your task is to perform object detection with high accuracy and proper entity linking.

Here is your precise workflow:
1.  Analyze the provided image carefully.
2.  Identify between 1 and 5 of the most significant, distinct objects. Do not identify objects that are not clearly visible or are ambiguous.
3.  For EACH object you identify, you MUST use the \`searchWikidataEntities\` tool to find its correct Wikidata entry. Use a descriptive query. For example, for a picture of Tom from "Tom and Jerry", search for "Tom Cat" with the description "from the cartoon Tom and Jerry".
4.  From the search results, carefully read the descriptions to select the correct entity. For example, for "Jerry", select the entity described as "mouse from Tom and Jerry", not a person or place with the same name.
5.  If you find a matching entity, include its \`wikidataId\` in the output. If no suitable entity is found, DO NOT include the \`wikidataId\` field.
6.  For EACH object, you MUST provide a precise bounding box in a normalized format [x_min, y_min, x_max, y_max]. The coordinates must be between 0 and 1 and accurately surround the object you have identified.
7.  Double-check your work to ensure the labels are correct, the Wikidata IDs are contextually accurate, and the bounding boxes are precisely placed.

Image: {{media url=photoDataUri}}
{{#if context}}
User-provided context: {{{context}}}
{{/if}}

Generate the object detection results now.`,
});

const locateObjectsFlow = ai.defineFlow(
  {
    name: 'locateObjectsFlow',
    inputSchema: LocateObjectsInputSchema,
    outputSchema: LocateObjectsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
