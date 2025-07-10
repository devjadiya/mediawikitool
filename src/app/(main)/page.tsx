'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

const toolSections = [
  {
    title: "Content & Editing",
    id: "content-editing",
    tools: [
      { id: "citation-finder", href: "/find-citations", name: "Citation Finder", description: "Turns any statement into a sourced citation, saving you valuable research time.", icon: <FileSearch className="h-8 w-8 text-rose-400" /> },
      { id: "stub-expander", href: "/expand-stub", name: "Article Stub Expander", description: "Analyzes short 'stub' articles and provides a clear roadmap with sourced suggestions to expand them.", icon: <Sparkles className="h-8 w-8 text-amber-400" /> },
      { id: "fact-checker", href: "/fact-checker", name: "Fact Checker", description: "Verifies factual claims within a text against online sources, ensuring accuracy and integrity.", icon: <ShieldQuestion className="h-8 w-8 text-teal-400" /> },
      { id: "draft-article", href: "/draft-article", name: "Drafting Assistant", description: "Generates a well-structured starter article on any topic, complete with citations and formatting.", icon: <FileText className="h-8 w-8 text-sky-400" /> },
      { id: "translation-enhancer", href: "/enhance-translation", name: "Translation Enhancer", description: "Compares two articles in different languages and automatically translates the missing content.", icon: <Languages className="h-8 w-8 text-indigo-400" /> },
      { id: "check-notability", href: "/check-notability", name: "Notability Checker", description: "Assesses whether a topic is significant enough for its own Wikipedia article by searching for coverage.", icon: <BadgeCheck className="h-8 w-8 text-lime-400" /> },
      { id: "detect-inconsistencies", href: "/detect-inconsistencies", name: "Cross-Wiki Inconsistency Detector", description: "Finds factual discrepancies between two articles on the same topic in different languages.", icon: <GitCompareArrows className="h-8 w-8 text-fuchsia-400" /> },
      { id: "translate-text", href: "/translate-text", name: "Wikitext Translator", description: "Translates text between languages while perfectly preserving complex table and template formatting.", icon: <ArrowRightLeft className="h-8 w-8 text-indigo-400" /> },
    ]
  },
  {
    title: "Media & Uploads",
    id: "media-uploads",
    tools: [
      { id: "caption-generator", href: "/generate-caption", name: "AI Caption Writer", description: "Generates encyclopedic, high-quality titles and descriptions for images.", icon: <PenSquare className="h-8 w-8 text-cyan-400" /> },
      { id: "suggest-category", href: "/suggest-category", name: "Category Suggester", description: "Analyzes an image and suggests the most relevant categories for organization.", icon: <Lightbulb className="h-8 w-8 text-yellow-400" /> },
      { id: "suggest-license", href: "/suggest-license", name: "License Suggester", description: "Helps you choose the correct Creative Commons license for your media uploads.", icon: <ShieldCheck className="h-8 w-8 text-green-400" /> },
      { id: "validate-image", href: "/validate-image", name: "Image Validator", description: "Automatically checks images for common issues like watermarks and provides quality feedback.", icon: <GitCompare className="h-8 w-8 text-orange-400" /> },
    ]
  },
  {
    title: "Development & Security",
    id: "dev-security",
    tools: [
      { id: "code-guardian", href: "/code-guardian", name: "MediaWiki Code Guardian", description: "Analyzes code snippets (JS/Lua) for security vulnerabilities, performance, and best practices.", icon: <ShieldCheck className="h-8 w-8 text-emerald-400" /> },
      { id: "explain-code", href: "/explain-code", name: "Code Explainer", description: "Provides a detailed, line-by-line explanation of what a block of code does.", icon: <Wand2 className="h-8 w-8 text-cyan-400" /> },
      { id: "regex-debugger", href: "/debug-regex", name: "Regex Debugger", description: "Translates complex Regular Expressions into a simple, natural language explanation.", icon: <Code className="h-8 w-8 text-slate-400" /> },
    ]
  },
  {
    title: "Community & Policy",
    id: "community-policy",
    tools: [
      { id: "detect-copyvio", href: "/detect-copyvio", name: "Copyright Violation Detector", description: "Scans text for potential copyright infringement from online sources before you publish.", icon: <BookCopy className="h-8 w-8 text-red-400" /> },
      { id: "anonymize-text", href: "/anonymize-text", name: "Text Anonymizer", description: "Automatically redacts Personally Identifiable Information (PII) to protect privacy.", icon: <ShieldCheck className="h-8 w-8 text-blue-400" /> },
      { id: "trust-visualizer", href: "/trust-visualizer", name: "Contribution Trust Visualizer", description: "Visualizes the contribution patterns and edit history of a user to assess their reliability.", icon: <BarChartHorizontal className="h-8 w-8 text-purple-400" /> },
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
    <div className="container mx-auto px-4">
      <header className="text-center py-24 md:py-32">
        <h1 className="text-4xl md:text-6xl font-bold mx-auto mb-4 font-headline tracking-tighter">
          Wikimedia AI Toolkit
        </h1>
        <div className="text-3xl md:text-5xl font-bold mx-auto mb-4">
          AI-powered tools to
          <FlipWords words={flipWords} />
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          A suite of powerful, modern tools designed to accelerate editing workflows, assist with development, and analyze community data.
        </p>
      </header>

      <div className="space-y-24 mb-24">
        {toolSections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-3xl font-headline font-bold mb-8 text-center">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.tools.map((tool) => (
                <motion.div
                  key={tool.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link href={tool.href}>
                    <Card className="min-h-[250px] bg-card/50 backdrop-blur-sm border-white/10 shadow-lg hover:border-primary/50 transition-colors duration-300 flex flex-col">
                      <CardHeader className="flex flex-row items-center gap-4">
                          <div className="p-2 bg-secondary rounded-lg">
                            {tool.icon}
                          </div>
                          <CardTitle className="font-headline text-2xl">{tool.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <CardDescription className="text-base">{tool.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
