'use client';

import type { GenerateDemandForecastsOutput } from '@/ai/flows/generate-demand-forecasts';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface DemandForecastCardProps {
  onForecast: (model: string) => void;
  isForecasting: boolean;
  trainedModels: string[];
  forecastOutput: GenerateDemandForecastsOutput | null;
  disabled: boolean;
}

export function DemandForecastCard({ onForecast, isForecasting, trainedModels, forecastOutput, disabled }: DemandForecastCardProps) {
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (trainedModels.length > 0 && !trainedModels.includes(selectedModel || '')) {
      setSelectedModel(trainedModels[0]);
    }
  }, [trainedModels, selectedModel]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Demand Forecasting</CardTitle>
        <CardDescription>Generate a demand forecast using a trained model.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedModel} onValueChange={setSelectedModel} disabled={disabled || trainedModels.length === 0}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a trained model" />
            </SelectTrigger>
            <SelectContent>
              {trainedModels.map(model => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => selectedModel && onForecast(selectedModel)} disabled={disabled || isForecasting || !selectedModel} className="w-full sm:w-auto">
            {isForecasting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LineChart className="mr-2 h-4 w-4" />}
            {isForecasting ? 'Forecasting...' : 'Generate Forecast'}
          </Button>
        </div>

        {forecastOutput && (
          <Alert>
            <LineChart className="h-4 w-4" />
            <AlertTitle>Forecast Explanation</AlertTitle>
            <AlertDescription className="space-y-2">
              <div>
                <p className="font-semibold">Forecast:</p>
                <p>{forecastOutput.forecast}</p>
              </div>
              <div>
                <p className="font-semibold">Influential Factors:</p>
                <p>{forecastOutput.modelExplanation}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
