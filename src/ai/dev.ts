'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/find-citations.ts';
import '@/ai/flows/draft-article.ts';
import '@/ai/flows/expand-stub.ts';
import '@/ai/flows/fact-checker.ts';
import '@/ai/flows/anonymize-text.ts';
import '@/ai/flows/check-notability.ts';
import '@/ai/flows/code-guardian.ts';
import '@/ai/flows/debug-regex.ts';
import '@/ai/flows/detect-copyvio.ts';
import '@/ai/flows/detect-inconsistencies.ts';
import '@/ai/flows/explain-code.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/trust-visualizer.ts';
import '@/ai/flows/generate-caption.ts';
import '@/ai/flows/suggest-category.ts';
import '@/ai/flows/validate-image.ts';
import '@/ai/flows/generate-prizes.ts';

    