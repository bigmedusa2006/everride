'use server';
/**
 * @fileOverview An AI agent that summarizes trip notes.
 *
 * - summarizeTripNotes - A function that summarizes trip notes.
 * - SummarizeTripNotesInput - The input type for the summarizeTripNotes function.
 * - SummarizeTripNotesOutput - The return type for the summarizeTripNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTripNotesInputSchema = z.object({
  notes: z.string().describe('The trip notes to summarize.'),
});
export type SummarizeTripNotesInput = z.infer<typeof SummarizeTripNotesInputSchema>;

const SummarizeTripNotesOutputSchema = z.object({
  summary: z.string().describe('The summarized trip notes.'),
});
export type SummarizeTripNotesOutput = z.infer<typeof SummarizeTripNotesOutputSchema>;

export async function summarizeTripNotes(input: SummarizeTripNotesInput): Promise<SummarizeTripNotesOutput> {
  return summarizeTripNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTripNotesPrompt',
  input: {schema: SummarizeTripNotesInputSchema},
  output: {schema: SummarizeTripNotesOutputSchema},
  prompt: `Summarize the following trip notes in a concise and informative way:\n\n{{{notes}}}`,
});

const summarizeTripNotesFlow = ai.defineFlow(
  {
    name: 'summarizeTripNotesFlow',
    inputSchema: SummarizeTripNotesInputSchema,
    outputSchema: SummarizeTripNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
