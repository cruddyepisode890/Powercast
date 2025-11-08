'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Loader2 } from "lucide-react"
import { useState } from "react"
import type { SuggestExternalDataSourcesOutput } from "@/ai/flows/suggest-external-data-sources"
import { suggestDataSourcesAction } from "../actions"
import { useToast } from "@/hooks/use-toast"

function formatAIResponse(text: string) {
    return text.split('\n').filter(line => line.trim() !== '').map((line, index) => {
        if (line.match(/^(\*|-)\s/)) {
            return <li key={index} className="ml-4 list-disc">{line.substring(2)}</li>
        }
        if (line.match(/^\d+\.\s/)) {
          return <li key={index} className="ml-4" style={{listStyleType: 'decimal'}}>{line.substring(line.indexOf(' ') + 1)}</li>
        }
        if(line.match(/^(#+)\s/)) {
          const level = line.match(/^(#+)/)![1].length;
          const Tag = `h${level+2}` as keyof JSX.IntrinsicElements;
          return <Tag key={index} className="font-semibold text-lg mt-4 mb-2">{line.substring(level + 1)}</Tag>
        }
        return <p key={index}>{line}</p>
    })
}

const formSchema = z.object({
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  historicalDataDescription: z.string().min(10, { message: "Description must be at least 10 characters." }),
  forecastAccuracyData: z.string().optional(),
})

export function DataSuggesterClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestExternalDataSourcesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "New York",
      historicalDataDescription: "Hourly electricity demand from 2022-2023, with temperature and humidity.",
      forecastAccuracyData: "Tried a simple linear regression model. RMSE is high during summer peaks. Weather data seems to help but isn't capturing all variance.",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const response = await suggestDataSourcesAction(values);
    setIsLoading(false);

    if(response.success && response.data) {
      setResult(response.data);
      toast({ title: "Suggestions Generated", description: "The AI has provided new data source ideas." });
    } else {
      toast({ variant: "destructive", title: "An Error Occurred", description: response.error });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>External Data Suggester</CardTitle>
          <CardDescription>
            Use AI to discover new external data sources that could improve your forecast accuracy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalDataDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Data Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the data you already have..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Include time range, granularity, and any known issues.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forecastAccuracyData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forecast Accuracy Report (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe what data you've tried and how it affected accuracy..." {...field} />
                    </FormControl>
                    <FormDescription>
                      This helps the AI give more tailored suggestions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Get Suggestions
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-2 text-sm text-foreground">
                {formatAIResponse(result.suggestedDataSources)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-foreground">
                {formatAIResponse(result.report)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
