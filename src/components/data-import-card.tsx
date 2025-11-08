'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';

interface DataImportCardProps {
  onImport: (data: string) => void;
}

const placeholderData = `date,demand,temperature,humidity,is_holiday
2023-01-01,2500,5,80,1
2023-01-02,2800,6,82,0
2023-01-03,2900,4,78,0
2023-01-04,2750,7,85,0
2023-01-05,3100,8,88,0
2023-01-06,3200,9,90,0
2023-01-07,3000,7,86,0`;

export function DataImportCard({ onImport }: DataImportCardProps) {
  const [data, setData] = useState(placeholderData);

  const handleImport = () => {
    onImport(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Data Import</CardTitle>
        <CardDescription>Paste your historical electricity demand data in CSV format.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="Paste CSV data here..."
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="h-48 font-code text-xs"
        />
        <Button onClick={handleImport} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Import Data
        </Button>
      </CardContent>
    </Card>
  );
}
