import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-daily-target.ts';
import '@/ai/flows/summarize-trip-notes.ts';
import '@/ai/flows/optimize-driving-target.ts';
