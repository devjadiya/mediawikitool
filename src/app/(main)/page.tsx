import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  BarChartHorizontal
} from 'lucide-react';

const toolSections = [
  {
    title: "Content & Editing",
    tools: [
      {
        name: "Citation Finder",
        description: "Find reliable sources for uncited statements.",
        href: "/find-citations",
        icon: <FileSearch className="h-8 w-8 text-rose-400" />,
      },
      {
        name: "Article Stub Expander",
        description: "Get suggestions for expanding short articles.",
        href: "/expand-stub",
        icon: <Sparkles className="h-8 w-8 text-amber-400" />,
      },
      {
        name: "Fact Checker",
        description: "Verify claims within a block of text against sources.",
        href: "/fact-checker",
        icon: <ShieldQuestion className="h-8 w-8 text-teal-400" />,
      },
      {
        name: "Drafting Assistant",
        description: "Generate a starter article on a new topic.",
        href: "/draft-article",
        icon: <FileText className="h-8 w-8 text-sky-400" />,
      },
      {
        name: "Notability Checker",
        description: "Assess if a topic meets Wikipedia's notability guidelines.",
        href: "/check-notability",
        icon: <BadgeCheck className="h-8 w-8 text-lime-400" />,
      },
      {
        name: "Cross-Wiki Inconsistency Detector",
        description: "Compare two articles to find factual discrepancies.",
        href: "/detect-inconsistencies",
        icon: <GitCompareArrows className="h-8 w-8 text-fuchsia-400" />,
      },
    ]
  },
  {
    title: "Translation & Language",
    tools: [
      {
        name: "Translation Assistant",
        description: "Translate wikitext while preserving markup.",
        href: "/translate-text",
        icon: <Languages className="h-8 w-8 text-indigo-400" />,
      },
    ]
  },
  {
    title: "Development & Security",
    tools: [
       {
        name: "MediaWiki Code Guardian",
        description: "Analyze JS/Lua for security and performance.",
        href: "/code-guardian",
        icon: <ShieldCheck className="h-8 w-8 text-emerald-400" />,
      },
      {
        name: "Code Explainer",
        description: "Get a detailed, line-by-line explanation of code.",
        href: "/explain-code",
        icon: <Wand2 className="h-8 w-8 text-cyan-400" />,
      },
       {
        name: "Regex Debugger",
        description: "Get a natural language explanation for regex.",
        href: "/debug-regex",
        icon: <Code className="h-8 w-8 text-slate-400" />,
      },
    ]
  },
   {
    title: "Community & Policy",
    tools: [
      {
        name: "Copyright Violation Detector",
        description: "Check text for potential copyright infringement.",
        href: "/detect-copyvio",
        icon: <BookCopy className="h-8 w-8 text-red-400" />,
      },
       {
        name: "Text Anonymizer",
        description: "Redact Personally Identifiable Information (PII).",
        href: "/anonymize-text",
        icon: <ShieldCheck className="h-8 w-8 text-blue-400" />,
      },
      {
        name: "Contribution Trust Visualizer",
        description: "Visualize the editing behavior of a user.",
        href: "/trust-visualizer",
        icon: <BarChartHorizontal className="h-8 w-8 text-purple-400" />,
      },
    ]
  }
]


export default function HomePage() {
  return (
    <div className="container mx-auto space-y-16">
      <header className="text-center pt-16">
        <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4 tracking-tight">AI Toolkit for Wikimedians</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          A suite of powerful, modern tools designed to accelerate editing workflows, assist with development, and analyze community data.
        </p>
      </header>

      {toolSections.map((section) => (
        <section key={section.title}>
          <h2 className="text-3xl font-headline font-bold mb-8 text-center">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {section.tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group block">
                <Card className="h-full bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                   <CardHeader className="flex flex-row items-center gap-4">
                      <div className="p-3 rounded-lg bg-secondary">
                        {tool.icon}
                      </div>
                      <CardTitle className="font-headline text-xl">{tool.name}</CardTitle>
                   </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
