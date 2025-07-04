'use server';

/**
 * @fileOverview An AI agent that optimizes daily driving targets based on historical data.
 *
 * - optimizeDrivingTarget - A function that suggests an optimal daily driving target.
 * - OptimizeDrivingTargetInput - The input type for the optimizeDrivingTarget function.
 * - OptimizeDrivingTargetOutput - The return type for the optimizeDrivingTarget function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeDrivingTargetInputSchema = z.object({
  pastTripData: z
    .string()
    .describe('Historical trip data including dates, times, locations, and earnings for each trip.'),
  pastExpenseData: z
    .string()
    .describe('Historical expense data including dates, categories, and amounts for each expense.'),
  desiredIncome: z.number().describe('The desired daily income.'),
  desiredWorkHours: z.number().describe('The desired daily work hours.'),
});
export type OptimizeDrivingTargetInput = z.infer<typeof OptimizeDrivingTargetInputSchema>;

const OptimizeDrivingTargetOutputSchema = z.object({
  suggestedTarget: z
    .number()
    .describe('The suggested optimal daily driving target in terms of earnings.'),
  estimatedWorkHours: z
    .number()
    .describe('The estimated work hours required to achieve the suggested target.'),
  reasoning:
    z.string()
      .describe('The reasoning behind the suggested target, explaining how it was calculated based on past data and desired balance.'),
});
export type OptimizeDrivingTargetOutput = z.infer<typeof OptimizeDrivingTargetOutputSchema>;

export async function optimizeDrivingTarget(input: OptimizeDrivingTargetInput): Promise<OptimizeDrivingTargetOutput> {
  return optimizeDrivingTargetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeDrivingTargetPrompt',
  input: {schema: OptimizeDrivingTargetInputSchema},
  output: {schema: OptimizeDrivingTargetOutputSchema},
  prompt: `You are an AI assistant designed to help drivers optimize their daily driving targets.

  Based on the driver’s past trip data, expense data, desired income, and desired work hours, suggest an optimal daily driving target and estimate the work hours required to achieve it.
  Explain the reasoning behind the suggested target, taking into account the driver’s past performance and desired work-life balance.

  Past Trip Data: {{{pastTripData}}}
  Past Expense Data: {{{pastExpenseData}}}
  Desired Income: {{{desiredIncome}}}
  Desired Work Hours: {{{desiredWorkHours}}}
  `,
});

const optimizeDrivingTargetFlow = ai.defineFlow(
  {
    name: 'optimizeDrivingTargetFlow',
    inputSchema: OptimizeDrivingTargetInputSchema,
    outputSchema: OptimizeDrivingTargetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
