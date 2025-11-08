import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-external-data-sources.ts';
import '@/ai/flows/generate-demand-forecasts.ts';
import '@/ai/flows/train-and-evaluate-models.ts';