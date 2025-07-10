'use server';

/**
 * @fileOverview A Genkit flow to analyze MediaWiki code for security, performance, and best practices.
 *
 * @exports codeGuardian - An async function that analyzes a code snippet.
 * @exports CodeGuardianInput - The input type for the codeGuardian function.
 * @exports CodeGuardianOutput - The output type for the codeGuardian function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input and Output Schemas
const CodeGuardianInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
  language: z.enum(['Lua', 'JavaScript']).describe('The programming language of the snippet.'),
});
export type CodeGuardianInput = z.infer<typeof CodeGuardianInputSchema>;

const AnalysisItemSchema = z.object({
  line: z.number().optional().describe('The line number of the issue, if applicable.'),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Info']).describe('The severity of the issue.'),
  description: z.string().describe('A detailed description of the issue or suggestion.'),
});

const CodeGuardianOutputSchema = z.object({
  explanation: z.string().describe('A high-level summary of what the code does.'),
  security: z.array(AnalysisItemSchema).describe('A list of potential security vulnerabilities.'),
  performance: z.array(AnalysisItemSchema).describe('A list of performance optimization suggestions.'),
  bestPractices: z.array(AnalysisItemSchema).describe('A list of suggestions for adhering to best practices.'),
});
export type CodeGuardianOutput = z.infer<typeof CodeGuardianOutputSchema>;

// Mock Tools for analysis - In a real app, these could be complex linters or scanners.
const explainTool = ai.defineTool(
    {
        name: 'explainCode',
        description: 'Explains what a piece of code does in plain English.',
        inputSchema: z.object({ code: z.string(), language: z.string() }),
        outputSchema: z.object({ summary: z.string() }),
    },
    async ({ code, language }) => ({ summary: `This ${language} code snippet appears to be a utility function.` })
);

const securityScanTool = ai.defineTool(
    {
        name: 'scanForSecurityVulnerabilities',
        description: 'Scans code for common security issues like XSS, insecure API usage, etc.',
        inputSchema: z.object({ code: z.string(), language: z.string() }),
        outputSchema: z.array(AnalysisItemSchema),
    },
    async ({ code }) => {
        const issues = [];
        if (code.includes('innerHTML')) {
            issues.push({
                line: code.split('\n').findIndex(l => l.includes('innerHTML')) + 1,
                severity: 'High',
                description: 'Direct use of `innerHTML` can lead to XSS vulnerabilities. Consider using `textContent` or `mw.html.escape` for sanitization.',
            });
        }
         if (code.includes('$.get(')) {
            issues.push({
                line: code.split('\n').findIndex(l => l.includes('$.get(')) + 1,
                severity: 'Medium',
                description: 'Usage of jQuery AJAX is discouraged. Prefer using `mw.Api` for interacting with the MediaWiki API.',
            });
        }
        return issues;
    }
);

const performanceCheckTool = ai.defineTool(
    {
        name: 'checkCodePerformance',
        description: 'Analyzes code for potential performance bottlenecks.',
        inputSchema: z.object({ code: z.string(), language: z.string() }),
        outputSchema: z.array(AnalysisItemSchema),
    },
    async ({ code }) => {
        const issues = [];
        if (code.match(/\$\(/g) && (code.match(/\$\(/g) || []).length > 3) {
             issues.push({
                severity: 'Low',
                description: 'Multiple jQuery selections found. Consider caching jQuery objects (e.g., `var $myElement = $("#myElement");`) to improve performance if the element is used multiple times.',
            });
        }
        return issues;
    }
);

const bestPracticesTool = ai.defineTool(
    {
        name: 'checkBestPractices',
        description: 'Checks code against MediaWiki development best practices.',
        inputSchema: z.object({ code: z.string(), language: z.string() }),
        outputSchema: z.array(AnalysisItemSchema),
    },
    async ({ code }) => {
        const issues = [];
        if (!code.includes('mw.loader.using')) {
            issues.push({
                severity: 'Info',
                description: 'Consider wrapping your code in `mw.loader.using` to ensure dependencies like `mediawiki.api` are loaded before your code executes.',
            });
        }
        return issues;
    }
);

// The main prompt that orchestrates the tools
const prompt = ai.definePrompt({
  name: 'codeGuardianPrompt',
  input: {schema: CodeGuardianInputSchema},
  output: {schema: CodeGuardianOutputSchema},
  tools: [explainTool, securityScanTool, performanceCheckTool, bestPracticesTool],
  prompt: `You are the "MediaWiki Code Guardian," an expert AI assistant for Wikimedia developers. Your task is to perform a comprehensive analysis of the user-provided code snippet.

Here is your workflow:
1.  First, use the \`explainCode\` tool to get a high-level understanding of the code's purpose.
2.  Next, use the \`scanForSecurityVulnerabilities\` tool to identify any potential security risks.
3.  Then, use the \`checkCodePerformance\` tool to find opportunities for optimization.
4.  Finally, use the \`checkBestPractices\` tool to ensure the code aligns with MediaWiki development standards.
5.  Synthesize the outputs from all tools into a single, structured JSON response.

Analyze the following {{{language}}} code:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

Provide your complete analysis now.`,
});

// The flow definition
const codeGuardianFlow = ai.defineFlow(
  {
    name: 'codeGuardianFlow',
    inputSchema: CodeGuardianInputSchema,
    outputSchema: CodeGuardianOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// Exported function to be used by the UI
export async function codeGuardian(input: CodeGuardianInput): Promise<CodeGuardianOutput> {
  return codeGuardianFlow(input);
}
