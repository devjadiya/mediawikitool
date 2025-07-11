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

const LocateObjectsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An image to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type LocateObjectsInput = z.infer<typeof LocateObjectsInputSchema>;


const LocatedObjectSchema = z.object({
    label: z.string().describe("The human-readable label for the identified object (e.g., 'Eiffel Tower', 'Tom Cat', 'Jerry Mouse')."),
    box: z.array(z.number()).length(4).describe("The bounding box of the object in [x_min, y_min, x_max, y_max] format. Coordinates are normalized between 0 and 1.")
});

const LocateObjectsOutputSchema = z.object({
  objects: z.array(LocatedObjectSchema).describe('A list of objects identified in the image, with their bounding boxes.'),
});
export type LocateObjectsOutput = z.infer<typeof LocateObjectsOutputSchema>;


export async function locateObjects(input: LocateObjectsInput): Promise<LocateObjectsOutput> {
  return locateObjectsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'locateObjectsPrompt',
  input: {schema: LocateObjectsInputSchema},
  output: {schema: LocateObjectsOutputSchema},
  prompt: `You are an expert at analyzing images and identifying all significant objects within them.

Here is your precise workflow:
1.  Analyze the provided image carefully.
2.  Identify between 1 and 5 of the most significant, distinct objects. Do not identify objects that are not clearly visible or are ambiguous.
3.  For EACH object, you MUST provide a precise bounding box in a normalized format [x_min, y_min, x_max, y_max]. The coordinates must be between 0 and 1 and accurately surround the object you have identified.
4.  Provide a simple label for each object. Do not provide Wikidata IDs.

Image: {{media url=photoDataUri}}

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
