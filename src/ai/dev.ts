import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-category.ts';
import '@/ai/flows/generate-caption.ts';
import '@/ai/flows/validate-image.ts';
import '@/ai/flows/anonymize-text.ts';
