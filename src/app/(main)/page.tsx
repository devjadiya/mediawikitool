'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FlipWords } from '@/components/ui/flip-words';
import { TracingBeam } from '@/components/ui/tracing-beam';
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
  ArrowRightLeft,
  Trophy
} from 'lucide-react';

const commonsTools = [
    { id: "generate-caption", href: "/generate-caption", name: "AI Caption Writer", description: "Generates encyclopedic, high-quality titles and descriptions for images, making your uploads more valuable to the community.", icon: <PenSquare className="h-8 w-8 text-cyan-400" /> },
    { id: "suggest-category", href: "/suggest-category", name: "Category Suggester", description: "Analyzes an image and suggests the most relevant categories, helping with proper organization and discoverability on Wikimedia Commons.", icon: <Lightbulb className="h-8 w-8 text-yellow-400" /> },
    { id: "suggest-license", href: "/suggest-license", name: "License Suggester", description: "Helps you choose the correct Creative Commons license for your media uploads based on the content and its origins.", icon: <ShieldCheck className="h-8 w-8 text-green-400" /> },
    { id: "validate-image", href: "/validate-image", name: "Image Validator", description: "Automatically checks images for common issues like watermarks or low quality, and provides constructive feedback before you upload.", icon: <GitCompare className="h-8 w-8 text-orange-400" /> },
    { id: "generate-prizes", href: "/generate-prizes", name: "Prize Generator", description: "Brainstorm creative, themed prize ideas for photography competitions and edit-a-thons to engage your community.", icon: <Trophy className="h-8 w-8 text-amber-500" /> },
];

const toolSections = [
  {
    title: "Content & Editing",
    id: "content-editing",
    tools: [
      { id: "citation-finder", href: "/find-citations", name: "Citation Finder", description: "Turns any statement into a sourced citation in seconds. This saves valuable research time, helping you add references quickly.", icon: <FileSearch className="h-8 w-8 text-rose-400" /> },
      { id: "stub-expander", href: "/expand-stub", name: "Article Stub Expander", description: "Analyzes short 'stub' articles and provides a clear, sourced roadmap with section suggestions to help you expand them into comprehensive pages.", icon: <Sparkles className="h-8 w-8 text-amber-400" /> },
      { id: "fact-checker", href: "/fact-checker", name: "Fact Checker", description: "Verifies factual claims within a text against online sources. This ensures the information you're adding is accurate and maintains the encyclopedia's integrity.", icon: <ShieldQuestion className="h-8 w-8 text-teal-400" /> },
      { id: "draft-article", href: "/draft-article", name: "Drafting Assistant", description: "Generates a well-structured starter article on any topic, complete with wikitext formatting and citations, giving you a huge head start on new content.", icon: <FileText className="h-8 w-8 text-sky-400" /> },
      { id: "translation-enhancer", href: "/enhance-translation", name: "Translation Enhancer", description: "Compares two articles in different languages and automatically finds and translates the missing content, perfect for cross-wiki work.", icon: <Languages className="h-8 w-8 text-indigo-400" /> },
      { id: "check-notability", href: "/check-notability", name: "Notability Checker", description: "Assesses whether a topic is significant enough for its own Wikipedia article by searching for significant coverage in reliable sources.", icon: <BadgeCheck className="h-8 w-8 text-lime-400" /> },
      { id: "detect-inconsistencies", href: "/detect-inconsistencies", name: "Cross-Wiki Inconsistency Detector", description: "Finds factual discrepancies between two language versions of the same article, helping you synchronize information across wikis.", icon: <GitCompareArrows className="h-8 w-8 text-fuchsia-400" /> },
      { id: "translate-text", href: "/translate-text", name: "Wikitext Translator", description: "Translates text between languages while perfectly preserving complex table and template formatting, a critical tool for multilingual editors.", icon: <ArrowRightLeft className="h-8 w-8 text-indigo-400" /> },
    ]
  },
  {
    title: "Development & Security",
    id: "dev-security",
    tools: [
      { id: "code-guardian", href: "/code-guardian", name: "MediaWiki Code Guardian", description: "Analyzes code snippets (JS/Lua) for security vulnerabilities, performance issues, and adherence to best practices, ideal for gadget and script developers.", icon: <ShieldCheck className="h-8 w-8 text-emerald-400" /> },
      { id: "explain-code", href: "/explain-code", name: "Code Explainer", description: "Provides a detailed, line-by-line explanation of what a block of code does, making it easier to understand and contribute to existing scripts.", icon: <Wand2 className="h-8 w-8 text-cyan-400" /> },
      { id: "debug-regex", href: "/debug-regex", name: "Regex Debugger", description: "Translates complex Regular Expressions into a simple, natural language explanation. A lifesaver for working with templates and filters.", icon: <Code className="h-8 w-8 text-slate-400" /> },
    ]
  },
  {
    title: "Community & Policy",
    id: "community-policy",
    tools: [
      { id: "detect-copyvio", href: "/detect-copyvio", name: "Copyright Violation Detector", description: "Scans text for potential copyright infringement from online sources before you publish, helping you avoid accidental policy violations.", icon: <BookCopy className="h-8 w-8 text-red-400" /> },
      { id: "anonymize-text", href: "/anonymize-text", name: "Text Anonymizer", description: "Automatically redacts Personally Identifiable Information (PII) from text to protect user privacy in discussions and reports.", icon: <ShieldCheck className="h-8 w-8 text-blue-400" /> },
      { id: "trust-visualizer", href: "/trust-visualizer", name: "Contribution Trust Visualizer", description: "Visualizes the contribution patterns and edit history of a user to help assess their reliability and areas of expertise.", icon: <BarChartHorizontal className="h-8 w-8 text-purple-400" /> },
    ]
  }
];

const HeroSection = () => {
   const headline = "Wikimedia AI Toolkit".split(" ");
   const flipWords = [
    "Find Citations",
    "Expand Articles",
    "Detect Copyvio",
    "Check Facts",
    "Draft Content",
  ];

  return (
     <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center my-4">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/20 dark:bg-neutral-800/20">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/20 dark:bg-neutral-800/20">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20 text-center">
        <h1 className="relative z-10 mx-auto max-w-4xl text-4xl font-bold md:text-6xl lg:text-8xl font-headline tracking-tighter">
          {headline.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-3xl py-4 text-xl md:text-3xl"
        >
          <span className="text-muted-foreground">AI-powered tools to </span>
          <FlipWords words={flipWords} className="text-primary" />
          <p className="text-muted-foreground mt-2 text-xl">
             A suite of powerful, modern tools designed to accelerate editing workflows, assist with development, and analyze community data.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

const ToolGrid = ({ tools }: { tools: any[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
            <motion.div
                key={tool.id}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <Link href={`/${tool.id}`} className="block h-full">
                    <Card className="h-full bg-card/50 backdrop-blur-sm border-white/10 shadow-lg hover:border-primary/50 transition-colors duration-300 flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-secondary rounded-lg">
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
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      <div className="container mx-auto px-4 max-w-6xl -mt-12 relative z-10">
        <TracingBeam className="px-6">
          <div className="space-y-24 mb-24 relative">
              <section id="commons-tools">
                 <h2 className="text-3xl font-headline font-bold mb-8 text-center">Commons & Competition Tools</h2>
                 <ToolGrid tools={commonsTools} />
              </section>

              {toolSections.map((section) => (
              <section key={section.id} id={section.id}>
                  <h2 className="text-3xl font-headline font-bold mb-8 text-center">{section.title}</h2>
                  <ToolGrid tools={section.tools} />
              </section>
              ))}
          </div>
        </TracingBeam>
      </div>
    </>
  );
}
