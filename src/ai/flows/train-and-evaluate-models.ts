'use server';

/**
 * @fileOverview Trains and evaluates multiple machine learning models for electricity demand forecasting.
 *
 * - trainAndEvaluateModels - Trains and evaluates specified ML models.
 * - TrainAndEvaluateModelsInput - Input type for trainAndEvaluateModels.
 * - ModelEvaluationResults - Output type for trainAndEvaluateModels.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportedModelsSchema = z.enum([
  'Linear Regression',
  'ARIMA',
  'Random Forest',
  'XGBoost',
  'LightGBM',
  'LSTM',
  'GRU',
  'TCN',
  'CNN+LSTM',
]);

const TrainAndEvaluateModelsInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical electricity demand data, along with relevant external variables (temperature, humidity, holidays, etc.) in CSV format.'
    ),
  modelsToTrain: z
    .array(SupportedModelsSchema)
    .describe('List of machine learning models to train and evaluate.'),
});

export type TrainAndEvaluateModelsInput = z.infer<
  typeof TrainAndEvaluateModelsInputSchema
>;

const ModelEvaluationResultsSchema = z.object({
  results: z.array(
    z.object({
      modelName: z.string(),
      evaluationMetrics: z.record(z.string(), z.number()).describe('Evaluation metrics like MAE, RMSE, etc.'),
      comments: z.string().optional(),
    })
  ),
});

export type ModelEvaluationResults = z.infer<typeof ModelEvaluationResultsSchema>;

export async function trainAndEvaluateModels(
  input: TrainAndEvaluateModelsInput
): Promise<ModelEvaluationResults> {
  return trainAndEvaluateModelsFlow(input);
}

const trainAndEvaluateModelsPrompt = ai.definePrompt({
  name: 'trainAndEvaluateModelsPrompt',
  input: {schema: TrainAndEvaluateModelsInputSchema},
  output: {schema: ModelEvaluationResultsSchema},
  prompt: `You are an expert in training and evaluating machine learning models for time series forecasting, specifically for electricity demand.

You will receive historical electricity demand data and a list of models to train and evaluate.

Your task is to train each of the specified models on the historical data, evaluate their performance, and return the evaluation metrics for each model.

The historical data is provided as a CSV string:

{{historicalData}}

The models to train and evaluate are:

{{#each modelsToTrain}}
- {{this}}
{{/each}}

Present the results in JSON format. For each model, include the model name and a dictionary of evaluation metrics (e.g., MAE, RMSE). Add any helpful comments regarding the evaluation and training process.

Ensure that the returned JSON is valid and can be parsed without errors.  The keys for evaluationMetrics MUST be quoted strings.

Example of the output format:

{
  "results": [
    {
      "modelName": "Linear Regression",
      "evaluationMetrics": {
        "MAE": 123.45,
        "RMSE": 67.89
      },
      "comments": "Linear regression performed adequately on this dataset."
    },
    {
      "modelName": "Random Forest",
      "evaluationMetrics": {
        "MAE": 98.76,
        "RMSE": 54.32
      },
      "comments": "Random forest showed improved performance compared to linear regression."
    }
  ]
}
`,
});

const trainAndEvaluateModelsFlow = ai.defineFlow(
  {
    name: 'trainAndEvaluateModelsFlow',
    inputSchema: TrainAndEvaluateModelsInputSchema,
    outputSchema: ModelEvaluationResultsSchema,
  },
  async input => {
    const {output} = await trainAndEvaluateModelsPrompt(input);
    return output!;
  }
);
