'use server';

/**
 * @fileOverview Electricity demand forecasting using trained machine learning models.
 *
 * - generateDemandForecasts - A function to generate electricity demand forecasts.
 * - GenerateDemandForecastsInput - The input type for the generateDemandForecasts function.
 * - GenerateDemandForecastsOutput - The return type for the generateDemandForecasts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDemandForecastsInputSchema = z.object({
  modelType: z
    .string()
    .describe(
      'The type of machine learning model to use for forecasting (e.g., Linear Regression, Random Forest, LSTM).'
    ),
  historicalDataSummary: z
    .string()
    .describe(
      'A summary of the historical electricity demand data and external variables used for training the model.'
    ),
  externalFactors: z
    .string()
    .describe(
      'Description of external factors that will be used to improve demand forecasts.'
    ),
  forecastHorizon: z
    .string()
    .describe(
      'The forecast horizon (e.g., hourly, daily) for generating electricity demand forecasts.'
    ),
});
export type GenerateDemandForecastsInput = z.infer<typeof GenerateDemandForecastsInputSchema>;

const GenerateDemandForecastsOutputSchema = z.object({
  forecast: z.string().describe('The generated electricity demand forecast.'),
  modelExplanation: z
    .string()
    .describe('Explanation of which external factors influenced the forecast.'),
});
export type GenerateDemandForecastsOutput = z.infer<typeof GenerateDemandForecastsOutputSchema>;

export async function generateDemandForecasts(
  input: GenerateDemandForecastsInput
): Promise<GenerateDemandForecastsOutput> {
  return generateDemandForecastsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDemandForecastsPrompt',
  input: {schema: GenerateDemandForecastsInputSchema},
  output: {schema: GenerateDemandForecastsOutputSchema},
  prompt: `You are an expert in electricity demand forecasting. Based on the provided information about the trained machine learning model, historical data, and desired forecast horizon, generate an electricity demand forecast.

  Model Type: {{{modelType}}}
  Historical Data Summary: {{{historicalDataSummary}}}
  External Factors: {{{externalFactors}}}
  Forecast Horizon: {{{forecastHorizon}}}

  Provide a concise forecast and explain the influential external factors.
  `,
});

const generateDemandForecastsFlow = ai.defineFlow(
  {
    name: 'generateDemandForecastsFlow',
    inputSchema: GenerateDemandForecastsInputSchema,
    outputSchema: GenerateDemandForecastsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
