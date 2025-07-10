import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-category.ts';
import '@/ai/flows/generate-caption.ts';
import '@/ai/flows/validate-image.ts';
import '@/ai/flows/anonymize-text.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/find-citations.ts';
import '@/ai/flows/expand-stub.ts';
import '@/ai/flows/detect-copyvio.ts';
import '@/ai/flows/draft-article.ts';
import '@/ai/flows/debug-regex.ts';
import '@/ai/flows/explain-code.ts';
import '@/ai/flows/suggest-license.ts';
import '@/ai/flows/fact-checker.ts';
