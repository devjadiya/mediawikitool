
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
  Database,
  Terminal,
  FileAudio,
  Accessibility,
  Scale,
  MessageSquareQuote,
  Cpu,
  Wrench,
  Locate,
  History,
  Timer
} from 'lucide-react';

const commonsTools = [
    { href: "/generate-caption", name: "AI Caption Writer", description: "Generates encyclopedic, high-quality titles and descriptions for images, making your uploads more valuable to the community.", icon: <PenSquare className="h-8 w-8 text-cyan-400" /> },
    { href: "/suggest-category", name: "Category Suggester", description: "Analyzes an image and suggests the most relevant categories, helping with proper organization and discoverability on Wikimedia Commons.", icon: <Lightbulb className="h-8 w-8 text-yellow-400" /> },
    { href: "/validate-image", name: "Image Validator", description: "Automatically checks for common issues like watermarks or low quality, and provides constructive feedback before you upload.", icon: <GitCompare className="h-8 w-8 text-orange-400" /> },
    { href: "/suggest-depicts", name: "Depicts Suggester", description: "Analyzes an image to suggest structured 'depicts' statements, linking its content to Wikidata entities for better discoverability.", icon: <Database className="h-8 w-8 text-violet-400" /> },
];

const toolSections = [
  {
    title: "Content & Editing",
    tools: [
      { href: "/find-citations", name: "Citation Finder", description: "Turns any statement into a sourced citation in seconds. This saves valuable research time, helping you add references quickly.", icon: <FileSearch className="h-8 w-8 text-rose-400" /> },
      { href: "/expand-stub", name: "Article Stub Expander", description: "Analyzes short 'stub' articles and provides a clear, sourced roadmap with section suggestions to help you expand them into comprehensive pages.", icon: <Sparkles className="h-8 w-8 text-amber-400" /> },
      { href: "/fact-checker", name: "Fact Checker", description: "Verifies factual claims within a text against online sources. This ensures the information you're adding is accurate and maintains the encyclopedia's integrity.", icon: <ShieldQuestion className="h-8 w-8 text-teal-400" /> },
      { href: "/draft-article", name: "Drafting Assistant", description: "Generates a well-structured starter article on any topic, complete with wikitext formatting and citations, giving you a huge head start on new content.", icon: <FileText className="h-8 w-8 text-sky-400" /> },
      { href: "/enhance-translation", name: "Translation Enhancer", description: "Compares two articles in different languages and automatically finds and translates the missing content, perfect for cross-wiki work.", icon: <Languages className="h-8 w-8 text-indigo-400" /> },
      { href: "/check-notability", name: "Notability Checker", description: "Assesses whether a topic is significant enough for its own Wikipedia article by searching for significant coverage in reliable sources.", icon: <BadgeCheck className="h-8 w-8 text-lime-400" /> },
      { href: "/detect-inconsistencies", name: "Cross-Wiki Inconsistency Detector", description: "Finds factual discrepancies between two language versions of the same article, helping you synchronize information across wikis.", icon: <GitCompareArrows className="h-8 w-8 text-fuchsia-400" /> },
      { href: "/translate-text", name: "Wikitext Translator", description: "Translates text between languages while perfectly preserving complex table and template formatting, a critical tool for multilingual editors.", icon: <ArrowRightLeft className="h-8 w-8 text-indigo-400" /> },
      { href: "/maintenance-task-finder", name: "Maintenance Task Finder", description: "Finds pages on Hindi Wikipedia that need maintenance, such as uncategorized or short articles, to help you find easy edits.", icon: <Wrench className="h-8 w-8 text-teal-400" /> },
    ]
  },
  {
    title: "Development & Security",
    tools: [
      { href: "/api-query-generator", name: "API Query Generator", description: "Translates a natural language task description into a ready-to-use MediaWiki Action API query URL, simplifying development.", icon: <Terminal className="h-8 w-8 text-amber-400" /> },
      { href: "/code-guardian", name: "MediaWiki Code Guardian", description: "Analyzes code snippets (JS/Lua) for security vulnerabilities, performance issues, and adherence to best practices, ideal for gadget and script developers.", icon: <ShieldCheck className="h-8 w-8 text-emerald-400" /> },
      { href: "/explain-code", name: "Code Explainer", description: "Provides a detailed, line-by-line explanation of what a block of code does, making it easier to understand and contribute to existing scripts.", icon: <Wand2 className="h-8 w-8 text-cyan-400" /> },
      { href: "/debug-regex", name: "Regex Debugger", description: "Translates complex Regular Expressions into a simple, natural language explanation. A lifesaver for working with templates and filters.", icon: <Code className="h-8 w-8 text-slate-400" /> },
    ]
  },
  {
    title: "Community & Policy",
    tools: [
      { href: "/detect-copyvio", name: "Copyright Violation Detector", description: "Scans text for potential copyright infringement from online sources before you publish, helping you avoid accidental policy violations.", icon: <BookCopy className="h-8 w-8 text-red-400" /> },
      { href: "/anonymize-text", name: "Text Anonymizer", description: "Automatically redacts Personally Identifiable Information (PII) from text to protect user privacy in discussions and reports.", icon: <ShieldCheck className="h-8 w-8 text-blue-400" /> },
      { href: "/trust-visualizer", name: "Contribution Trust Visualizer", description: "Visualizes the contribution patterns and edit history of a user to help assess their reliability and areas of expertise.", icon: <BarChartHorizontal className="h-8 w-8 text-purple-400" /> },
    ]
  }
];

const futureConcepts = [
    { href: "#", name: "POV & Tone Analyzer", description: "Paste an article draft and get feedback on its neutrality, objectivity, and encyclopedic tone to ensure compliance with Wikipedia's NPOV policy.", icon: <Scale className="h-8 w-8 text-rose-400" />, comingSoon: true },
    { href: "#", name: "Edit Summary Generator", description: "Automatically generates a concise, accurate edit summary by analyzing the changes (diff) you've made to a page, saving time and improving edit history.", icon: <MessageSquareQuote className="h-8 w-8 text-amber-400" />, comingSoon: true },
    { href: "#", name: "Disambiguation Helper", description: "Analyzes the context of an article to suggest the most appropriate link for an ambiguous term, helping you create correct internal links.", icon: <GitCompareArrows className="h-8 w-8 text-teal-400" />, comingSoon: true },
    { href: "#", name: "Copyright Status Assessor", description: "Assesses an image's likely copyright status based on its source and metadata to help users make better licensing decisions.", icon: <BadgeCheck className="h-8 w-8 text-sky-400" />, comingSoon: true },
    { href: "#", name: "Audio Pronunciation Generator", description: "Generates a spoken audio file for a name or term, which can then be added to articles to improve accessibility.", icon: <FileAudio className="h-8 w-8 text-indigo-400" />, comingSoon: true },
    { href: "#", name: "Accessibility Alt-Text Generator", description: "Generates descriptive alt-text for images to make them accessible to screen readers for visually impaired users.", icon: <Accessibility className="h-8 w-8 text-fuchsia-400" />, comingSoon: true },
    { href: "#", name: "Object Locator & Identifier", description: "Draws bounding boxes around multiple objects in an image and identifies each one with its Wikidata ID.", icon: <Locate className="h-8 w-8 text-emerald-400" />, comingSoon: true },
    { href: "#", name: "Page History Summarizer", description: "Analyzes a page's entire revision history and provides a summary of its development, major contributors, and edit wars.", icon: <History className="h-8 w-8 text-cyan-400" />, comingSoon: true },
    { href: "#", name: "Template Optimizer", description: "Analyzes complex template wikitext for performance issues and suggests optimizations to reduce server load.", icon: <Cpu className="h-8 w-8 text-slate-400" />, comingSoon: true },
]

const HeroSection = () => {
   const headline = "WLS India Archive".split(" ");
   const flipWords = [
    "Image Galleries",
    "Competition Timelines",
    "Contribution Guides",
    "AI-Powered Tools",
  ];

  return (
     <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center my-4 text-center">
      <div className="px-4 py-10 md:py-20">
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
          <span className="text-muted-foreground">Featuring </span>
          <FlipWords words={flipWords} className="text-primary" />
          <p className="text-muted-foreground mt-2 text-xl">
             Explore winning images, learn about the competition, and use powerful AI tools to enhance your Wikimedia contributions.
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
                key={tool.href}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <Link href={tool.href} className="block h-full">
                    <Card className="h-full bg-card/90 backdrop-blur-sm border-white/10 shadow-lg hover:border-primary/50 transition-colors duration-300 flex flex-col relative overflow-hidden">
                        {tool.comingSoon && (
                             <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                                SOON
                            </div>
                        )}
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
      
      <div className="max-w-7xl mx-auto -mt-12 relative z-10">
        <TracingBeam className="px-6">
          <div className="space-y-24 mb-24 relative">
              <section>
                 <h2 className="text-3xl font-headline font-bold mb-8 text-center">Wikimedia Commons Tools</h2>
                 <ToolGrid tools={commonsTools} />
              </section>

              {toolSections.map((section) => (
              <section key={section.title}>
                  <h2 className="text-3xl font-headline font-bold mb-8 text-center">{section.title}</h2>
                  <ToolGrid tools={section.tools} />
              </section>
              ))}

              <section>
                 <h2 className="text-3xl font-headline font-bold mb-8 text-center">Future Concepts</h2>
                 <ToolGrid tools={futureConcepts} />
              </section>
          </div>
        </TracingBeam>
      </div>
    </>
  );
}
