'use server';
/**
 * @fileOverview This file defines a Genkit flow that analyzes asset notes and suggests values for other asset fields.
 *
 * - suggestAssetDetailsFromNotes - Analyzes the notes provided and suggests values for asset details.
 * - SuggestAssetDetailsInput - The input type for the suggestAssetDetailsFromNotes function.
 * - SuggestAssetDetailsOutput - The return type for the suggestAssetDetailsFromNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAssetDetailsInputSchema = z.object({
  notes: z
    .string()
    .describe('The notes provided by the user for the asset being added.'),
});
export type SuggestAssetDetailsInput = z.infer<typeof SuggestAssetDetailsInputSchema>;

const SuggestAssetDetailsOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .optional()
    .describe('Suggested category for the asset based on the notes.'),
  suggestedManufacturer: z
    .string()
    .optional()
    .describe('Suggested manufacturer for the asset based on the notes.'),
});
export type SuggestAssetDetailsOutput = z.infer<typeof SuggestAssetDetailsOutputSchema>;

export async function suggestAssetDetailsFromNotes(
  input: SuggestAssetDetailsInput
): Promise<SuggestAssetDetailsOutput> {
  return suggestAssetDetailsFromNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAssetDetailsPrompt',
  input: {schema: SuggestAssetDetailsInputSchema},
  output: {schema: SuggestAssetDetailsOutputSchema},
  prompt: `Based on the following notes for an asset, suggest a category and manufacturer for the asset. If you cannot determine the category or manufacturer, leave those fields blank.

Notes: {{{notes}}}

Please provide the category and manufacturer suggestions in JSON format.`,
});

const suggestAssetDetailsFromNotesFlow = ai.defineFlow(
  {
    name: 'suggestAssetDetailsFromNotesFlow',
    inputSchema: SuggestAssetDetailsInputSchema,
    outputSchema: SuggestAssetDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
