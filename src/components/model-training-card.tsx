'use client';

import type { ModelEvaluationResults } from '@/ai/flows/train-and-evaluate-models';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface ModelTrainingCardProps {
  onTrain: (models: string[]) => void;
  isTraining: boolean;
  trainingResults: ModelEvaluationResults | null;
  disabled: boolean;
}

const availableModels = [
  'Linear Regression', 'ARIMA', 'Random Forest', 'XGBoost', 
  'LightGBM', 'LSTM', 'GRU', 'TCN', 'CNN+LSTM'
];

export function ModelTrainingCard({ onTrain, isTraining, trainingResults, disabled }: ModelTrainingCardProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>(['Linear Regression', 'Random Forest']);

  const handleCheckboxChange = (model: string, checked: boolean) => {
    setSelectedModels(prev => 
      checked ? [...prev, model] : prev.filter(m => m !== model)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Model Training</CardTitle>
        <CardDescription>Select ML models and train them on your data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {availableModels.map(model => (
            <div key={model} className="flex items-center space-x-2">
              <Checkbox 
                id={model} 
                checked={selectedModels.includes(model)}
                onCheckedChange={(checked) => handleCheckboxChange(model, !!checked)}
                disabled={disabled}
              />
              <Label htmlFor={model} className="text-sm font-normal cursor-pointer">{model}</Label>
            </div>
          ))}
        </div>
        <Button onClick={() => onTrain(selectedModels)} disabled={disabled || isTraining || selectedModels.length === 0} className="w-full">
          {isTraining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
          {isTraining ? 'Training...' : 'Train Models'}
        </Button>

        {trainingResults && (
          <div className="pt-4">
            <h4 className="font-semibold mb-2">Evaluation Results</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>MAE</TableHead>
                  <TableHead>RMSE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingResults.results.map(result => (
                  <TableRow key={result.modelName}>
                    <TableCell className="font-medium">{result.modelName}</TableCell>
                    <TableCell>{result.evaluationMetrics.MAE?.toFixed(2) ?? 'N/A'}</TableCell>
                    <TableCell>{result.evaluationMetrics.RMSE?.toFixed(2) ?? 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
