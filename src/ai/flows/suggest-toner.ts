'use server';
/**
 * @fileOverview This file defines a Genkit flow that suggests toner for a given HP printer model.
 *
 * - suggestTonerForHPPrinter - Suggests a toner cartridge for a given HP printer model.
 * - SuggestTonerInput - The input type for the suggestTonerForHPPrinter function.
 * - SuggestTonerOutput - The return type for the suggestTonerForHPPrinter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTonerInputSchema = z.object({
  modelNumber: z
    .string()
    .describe('The model number of the HP printer.'),
});
export type SuggestTonerInput = z.infer<typeof SuggestTonerInputSchema>;

const SuggestTonerOutputSchema = z.object({
  suggestedToner: z
    .string()
    .describe('The suggested toner cartridge model number for the printer.'),
});
export type SuggestTonerOutput = z.infer<typeof SuggestTonerOutputSchema>;

export async function suggestTonerForHPPrinter(
  input: SuggestTonerInput
): Promise<SuggestTonerOutput> {
  return suggestTonerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTonerPrompt',
  input: {schema: SuggestTonerInputSchema},
  output: {schema: SuggestTonerOutputSchema},
  prompt: `Based on the following HP printer model number, suggest the compatible toner cartridge. Provide only the toner model number.

Printer Model: {{{modelNumber}}}
`,
});

const suggestTonerFlow = ai.defineFlow(
  {
    name: 'suggestTonerFlow',
    inputSchema: SuggestTonerInputSchema,
    outputSchema: SuggestTonerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
