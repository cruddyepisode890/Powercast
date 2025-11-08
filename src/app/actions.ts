'use server';

import { generateDemandForecasts, GenerateDemandForecastsInput } from '@/ai/flows/generate-demand-forecasts';
import { suggestExternalDataSources, SuggestExternalDataSourcesInput } from '@/ai/flows/suggest-external-data-sources';
import { trainAndEvaluateModels, TrainAndEvaluateModelsInput } from '@/ai/flows/train-and-evaluate-models';

async function handleAction<T_Input, T_Output>(
  action: (input: T_Input) => Promise<T_Output>,
  input: T_Input
): Promise<{ success: boolean; data?: T_Output; error?: string }> {
  try {
    const data = await action(input);
    return { success: true, data };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || 'An unexpected error occurred.' };
  }
}

export const trainModelsAction = (input: TrainAndEvaluateModelsInput) =>
  handleAction(trainAndEvaluateModels, input);

export const generateForecastAction = (input: GenerateDemandForecastsInput) =>
  handleAction(generateDemandForecasts, input);

export const suggestDataSourcesAction = (input: SuggestExternalDataSourcesInput) =>
  handleAction(suggestExternalDataSources, input);
