'use client';

import type { ModelEvaluationResults, TrainAndEvaluateModelsInput } from '@/ai/flows/train-and-evaluate-models';
import type { GenerateDemandForecastsOutput, GenerateDemandForecastsInput } from '@/ai/flows/generate-demand-forecasts';
import { useState } from 'react';
import { generateForecastAction, trainModelsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { DataImportCard } from './data-import-card';
import { ModelTrainingCard } from './model-training-card';
import { DemandForecastCard } from './demand-forecast-card';
import { ForecastVisualizationCard, KPI, mockForecastData } from './forecast-visualization-card';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function DashboardClient() {
  const [historicalData, setHistoricalData] = useState('');
  const [trainingResults, setTrainingResults] = useState<ModelEvaluationResults | null>(null);
  const [forecastOutput, setForecastOutput] = useState<GenerateDemandForecastsOutput | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const [isTraining, setIsTraining] = useState(false);
  const [isForecasting, setIsForecasting] = useState(false);

  const { toast } = useToast();

  const handleDataImport = (data: string) => {
    setHistoricalData(data);
    setTrainingResults(null);
    setForecastOutput(null);
    setChartData([]);
    toast({
      title: 'Data Imported',
      description: 'You can now train your models.',
    });
  };

  const handleTrainModels = async (models: TrainAndEvaluateModelsInput['modelsToTrain']) => {
    if (!historicalData) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please import historical data first.',
      });
      return;
    }
    setIsTraining(true);
    const input = { historicalData, modelsToTrain: models };
    const result = await trainModelsAction(input);
    setIsTraining(false);
    
    if (result.success && result.data) {
      setTrainingResults(result.data);
      toast({
        title: 'Model Training Complete',
        description: 'Models have been trained and evaluated successfully.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Training Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
  };

  const handleGenerateForecast = async (modelType: string) => {
    if (!trainingResults) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please train a model first.',
      });
      return;
    }
    setIsForecasting(true);
    const input: GenerateDemandForecastsInput = {
      modelType,
      historicalDataSummary: 'Using previously imported data.',
      externalFactors: 'Weather, holidays, and economic indicators.',
      forecastHorizon: 'Daily for the next 7 days'
    };
    const result = await generateForecastAction(input);
    setIsForecasting(false);

    if (result.success && result.data) {
      setForecastOutput(result.data);
      setChartData(mockForecastData()); // using mock data for visualization
      toast({
        title: 'Forecast Generated',
        description: 'New demand forecast is ready.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Forecast Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
  };

  const kpis: KPI[] = trainingResults?.results.flatMap(r => [
    { title: `${r.modelName} MAE`, value: r.evaluationMetrics.MAE?.toFixed(2) ?? 'N/A' },
    { title: `${r.modelName} RMSE`, value: r.evaluationMetrics.RMSE?.toFixed(2) ?? 'N/A' },
  ]) ?? [];


  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.length > 0 ? (
          kpis.slice(0, 4).map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          ))
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
             <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KPI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">...</div>
                <p className="text-xs text-muted-foreground">Train a model to see metrics</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <DataImportCard onImport={handleDataImport} />
          <ModelTrainingCard 
            onTrain={handleTrainModels} 
            isTraining={isTraining} 
            trainingResults={trainingResults}
            disabled={!historicalData}
          />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <ForecastVisualizationCard chartData={chartData} />
          <DemandForecastCard 
            onForecast={handleGenerateForecast}
            isForecasting={isForecasting}
            trainedModels={trainingResults?.results.map(r => r.modelName) ?? []}
            forecastOutput={forecastOutput}
            disabled={!trainingResults}
          />
        </div>
      </div>
    </div>
  );
}
