'use server';

/**
 * @fileOverview A daily earning target suggestion AI agent.
 *
 * - suggestDailyTarget - A function that suggests daily earning targets.
 * - SuggestDailyTargetInput - The input type for the suggestDailyTarget function.
 * - SuggestDailyTargetOutput - The return type for the suggestDailyTarget function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDailyTargetInputSchema = z.object({
  pastPerformance: z
    .string()
    .describe('The driver’s past performance data, including daily earnings for the last month.'),
  currentMarketConditions: z
    .string()
    .describe('Information about current market conditions, such as demand and surge pricing.'),
  desiredIncome: z.number().describe('The desired income for the day.'),
});
export type SuggestDailyTargetInput = z.infer<typeof SuggestDailyTargetInputSchema>;

const SuggestDailyTargetOutputSchema = z.object({
  suggestedTarget: z
    .number()
    .describe('The suggested daily earnings target based on past performance and market conditions.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested target, explaining how it was calculated.'),
});
export type SuggestDailyTargetOutput = z.infer<typeof SuggestDailyTargetOutputSchema>;

export async function suggestDailyTarget(input: SuggestDailyTargetInput): Promise<SuggestDailyTargetOutput> {
  return suggestDailyTargetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDailyTargetPrompt',
  input: {schema: SuggestDailyTargetInputSchema},
  output: {schema: SuggestDailyTargetOutputSchema},
  prompt: `You are an AI assistant that suggests daily earning targets for drivers.

  Based on the driver’s past performance, current market conditions, and desired income, suggest a daily earnings target.
  Explain the reasoning behind the suggested target.

  Past Performance: {{{pastPerformance}}}
  Current Market Conditions: {{{currentMarketConditions}}}
  Desired Income: {{{desiredIncome}}}
  `,
});

const suggestDailyTargetFlow = ai.defineFlow(
  {
    name: 'suggestDailyTargetFlow',
    inputSchema: SuggestDailyTargetInputSchema,
    outputSchema: SuggestDailyTargetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
