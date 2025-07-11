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
    label: z.string().describe("The human-readable label for the identified object (e.g., 'Eiffel Tower')."),
    wikidataId: z.string().optional().describe("The corresponding Wikidata Q-ID for the object (e.g., 'Q243'), if a specific entity can be found."),
    box: z.array(z.number()).length(4).describe("The bounding box of the object in [x_min, y_min, x_max, y_max] format. Coordinates are normalized between 0 and 1.")
});

const LocateObjectsOutputSchema = z.object({
  objects: z.array(LocatedObjectSchema).describe('A list of objects identified in the image, with their bounding boxes and Wikidata IDs.'),
});
export type LocateObjectsOutput = z.infer<typeof LocateObjectsOutputSchema>;

export async function locateObjects(input: LocateObjectsInput): Promise<LocateObjectsOutput> {
  return locateObjectsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'locateObjectsPrompt',
  input: {schema: LocateObjectsInputSchema},
  output: {schema: LocateObjectsOutputSchema},
  prompt: `You are an expert at analyzing images and identifying all significant objects within them. Your task is to perform object detection on the given image.

- For each distinct object you identify, provide its common English label and its bounding box.
- If you can identify a specific, unique entity, provide its corresponding Wikidata Q-ID. If the object is generic (like 'sky' or 'tree'), do not provide a wikidataId.
- The bounding box must be in a normalized format [x_min, y_min, x_max, y_max], where each coordinate is a value between 0 and 1 representing its position relative to the image dimensions.
- Identify as many distinct objects as possible.

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
