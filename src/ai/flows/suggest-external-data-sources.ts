// src/ai/flows/suggest-external-data-sources.ts
'use server';
/**
 * @fileOverview An LLM-powered tool that suggests relevant external data sources to improve the accuracy of electricity demand forecasts, and create a report discussing the usefulness of data that was tried.
 *
 * - suggestExternalDataSources - A function that suggests external data sources for electricity demand forecasts and creates a report.
 * - SuggestExternalDataSourcesInput - The input type for the suggestExternalDataSources function.
 * - SuggestExternalDataSourcesOutput - The return type for the suggestExternalDataSources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestExternalDataSourcesInputSchema = z.object({
  city: z.string().describe('The city for which electricity demand is being forecasted.'),
  historicalDataDescription: z
    .string()
    .describe(
      'A description of the historical electricity demand data already available, including its time range and any known issues.'
    ),
  forecastAccuracyData: z
    .string()
    .optional()
    .describe(
      'Report on forecast accuracy including an overview of what data has been tried, and any improvements to forecast accuracy realized.'
    ),
});
export type SuggestExternalDataSourcesInput = z.infer<typeof SuggestExternalDataSourcesInputSchema>;

const SuggestExternalDataSourcesOutputSchema = z.object({
  suggestedDataSources: z
    .string()
    .describe(
      'A list of suggested external data sources that could improve the accuracy of electricity demand forecasts, including a description of the data and how it could be used.'
    ),
  report: z
    .string()
    .describe(
      'A report discussing the usefulness of data that has been tried, and suggesting which sources appear promising, and which were unhelpful.'
    ),
});
export type SuggestExternalDataSourcesOutput = z.infer<typeof SuggestExternalDataSourcesOutputSchema>;

export async function suggestExternalDataSources(
  input: SuggestExternalDataSourcesInput
): Promise<SuggestExternalDataSourcesOutput> {
  return suggestExternalDataSourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExternalDataSourcesPrompt',
  input: {schema: SuggestExternalDataSourcesInputSchema},
  output: {schema: SuggestExternalDataSourcesOutputSchema},
  prompt: `You are an expert in electricity demand forecasting. Your goal is to suggest external data sources that can improve the accuracy of electricity demand forecasts for a given city, and to create a report discussing the usefulness of data that has been tried.

  The city for which electricity demand is being forecasted is: {{{city}}}
  Here is a description of the historical electricity demand data already available: {{{historicalDataDescription}}}

  {{#if forecastAccuracyData}}
  Here is an overview of what data has been tried, and any improvements to forecast accuracy realized:
  {{{forecastAccuracyData}}}
  {{/if}}

  Based on this information, suggest external data sources that could improve the accuracy of electricity demand forecasts, and create a report discussing the usefulness of data that has been tried, and suggesting which sources appear promising, and which were unhelpful.
  `,
});

const suggestExternalDataSourcesFlow = ai.defineFlow(
  {
    name: 'suggestExternalDataSourcesFlow',
    inputSchema: SuggestExternalDataSourcesInputSchema,
    outputSchema: SuggestExternalDataSourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
