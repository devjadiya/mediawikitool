'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TracingBeam } from '@/components/ui/tracing-beam';
import { FlipWords } from '@/components/ui/flip-words';
import { 
  FileSearch, 
  Sparkles, 
  ShieldQuestion, 
  FileText,
  ShieldCheck,
  BookCopy,
  GitCompareArrows,
  Wand2,
  Code,
  Languages,
  BadgeCheck,
  BarChartHorizontal,
  PenSquare,
  Lightbulb,
  GitCompare,
  ArrowRightLeft
} from 'lucide-react';
import { CitationFinder } from '@/components/citation-finder';
import { StubExpander } from '@/components/stub-expander';
import { FactChecker } from '@/components/fact-checker';
import { DraftingAssistant } from '@/components/drafting-assistant';
import { TranslationEnhancer } from '@/components/translation-enhancer';
import { NotabilityChecker } from '@/components/notability-checker';
import { InconsistencyDetector } from '@/components/inconsistency-detector';
import { TranslationAssistant } from '@/components/translation-assistant';
import { CaptionGenerator } from '@/components/caption-generator';
import { ImageUploader } from '@/components/image-uploader';
import { LicenseSuggester } from '@/components/license-suggester';
import { ImageValidator } from '@/components/image-validator';
import { CodeGuardian } from '@/components/code-guardian';
import { CodeExplainer } from '@/components/code-explainer';
import { RegexDebugger } from '@/components/regex-debugger';
import { CopyvioDetector } from '@/components/copyvio-detector';
import { TextAnonymizer } from '@/components/text-anonymizer';
import { TrustVisualizer } from '@/components/trust-visualizer';

const toolSections = [
  {
    title: "Content & Editing",
    id: "content-editing",
    tools: [
      { id: "citation-finder", name: "Citation Finder", description: "Find reliable sources for uncited statements.", icon: <FileSearch className="h-8 w-8 text-rose-400" />, component: <CitationFinder /> },
      { id: "stub-expander", name: "Article Stub Expander", description: "Get suggestions for expanding short articles.", icon: <Sparkles className="h-8 w-8 text-amber-400" />, component: <StubExpander /> },
      { id: "fact-checker", name: "Fact Checker", description: "Verify claims within a block of text against sources.", icon: <ShieldQuestion className="h-8 w-8 text-teal-400" />, component: <FactChecker /> },
      { id: "draft-article", name: "Drafting Assistant", description: "Generate a starter article on a new topic.", icon: <FileText className="h-8 w-8 text-sky-400" />, component: <DraftingAssistant /> },
      { id: "translation-enhancer", name: "Translation Enhancer", description: "Find and translate missing content from a source article.", icon: <Languages className="h-8 w-8 text-indigo-400" />, component: <TranslationEnhancer /> },
      { id: "check-notability", name: "Notability Checker", description: "Assess if a topic meets Wikipedia's notability guidelines.", icon: <BadgeCheck className="h-8 w-8 text-lime-400" />, component: <NotabilityChecker /> },
      { id: "detect-inconsistencies", name: "Cross-Wiki Inconsistency Detector", description: "Compare two articles to find factual discrepancies.", icon: <GitCompareArrows className="h-8 w-8 text-fuchsia-400" />, component: <InconsistencyDetector /> },
      { id: "translate-text", name: "Wikitext Translator", description: "Translate wikitext while preserving markup.", icon: <ArrowRightLeft className="h-8 w-8 text-indigo-400" />, component: <TranslationAssistant /> },
    ]
  },
  {
    title: "Media & Uploads",
    id: "media-uploads",
    tools: [
      { id: "caption-generator", name: "AI Caption Writer", description: "Generate titles & descriptions for scientific images.", icon: <PenSquare className="h-8 w-8 text-cyan-400" />, component: <CaptionGenerator /> },
      { id: "suggest-category", name: "Category Suggester", description: "Get AI-powered category ideas for an image.", icon: <Lightbulb className="h-8 w-8 text-yellow-400" />, component: <ImageUploader /> },
      { id: "suggest-license", name: "License Suggester", description: "Get suggestions for Creative Commons licenses.", icon: <ShieldCheck className="h-8 w-8 text-green-400" />, component: <LicenseSuggester /> },
      { id: "validate-image", name: "Image Validator", description: "Check images for watermarks and quality issues.", icon: <GitCompare className="h-8 w-8 text-orange-400" />, component: <ImageValidator /> },
    ]
  },
  {
    title: "Development & Security",
    id: "dev-security",
    tools: [
      { id: "code-guardian", name: "MediaWiki Code Guardian", description: "Analyze JS/Lua for security and performance.", icon: <ShieldCheck className="h-8 w-8 text-emerald-400" />, component: <CodeGuardian /> },
      { id: "explain-code", name: "Code Explainer", description: "Get a detailed, line-by-line explanation of code.", icon: <Wand2 className="h-8 w-8 text-cyan-400" />, component: <CodeExplainer /> },
      { id: "regex-debugger", name: "Regex Debugger", description: "Get a natural language explanation for regex.", icon: <Code className="h-8 w-8 text-slate-400" />, component: <RegexDebugger /> },
    ]
  },
  {
    title: "Community & Policy",
    id: "community-policy",
    tools: [
      { id: "detect-copyvio", name: "Copyright Violation Detector", description: "Check text for potential copyright infringement.", icon: <BookCopy className="h-8 w-8 text-red-400" />, component: <CopyvioDetector /> },
      { id: "anonymize-text", name: "Text Anonymizer", description: "Redact Personally Identifiable Information (PII).", icon: <ShieldCheck className="h-8 w-8 text-blue-400" />, component: <TextAnonymizer /> },
      { id: "trust-visualizer", name: "Contribution Trust Visualizer", description: "Visualize the editing behavior of a user.", icon: <BarChartHorizontal className="h-8 w-8 text-purple-400" />, component: <TrustVisualizer /> },
    ]
  }
];

export default function HomePage() {
  const flipWords = [
    "Find Citations",
    "Expand Articles",
    "Detect Copyvio",
    "Check Facts",
    "Draft Content",
  ];

  return (
    <>
      <div className="container mx-auto space-y-24 my-24 px-6">
        <header className="text-center pt-12 md:pt-20">
           <h1 className="text-4xl md:text-6xl font-bold mx-auto mb-4 font-headline tracking-tighter">
            Unum
          </h1>
           <div className="text-3xl md:text-5xl font-bold mx-auto mb-4">
            Build better with AI to
            <FlipWords words={flipWords} />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            A suite of powerful, modern tools designed to accelerate editing workflows, assist with development, and analyze community data.
          </p>
        </header>
      </div>

      <TracingBeam className="px-6">
        <div className="container mx-auto space-y-24 my-12">
          {toolSections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-3xl font-headline font-bold mb-8 text-center">{section.title}</h2>
              <div className="space-y-16">
                {section.tools.map((tool) => (
                  <div key={tool.id} id={tool.id} className="pt-16 -mt-16">
                    <Card className="min-h-[600px] bg-card/50 backdrop-blur-sm border-white/10 shadow-2xl shadow-primary/5">
                        {tool.component}
                    </Card>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </TracingBeam>
    </>
  );
}
