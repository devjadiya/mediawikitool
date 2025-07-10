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
        icon: <FileSearch className="h-8 w-8 text-primary" />,
      },
      {
        name: "Article Stub Expander",
        description: "Get suggestions for expanding short articles.",
        href: "/expand-stub",
        icon: <Sparkles className="h-8 w-8 text-primary" />,
      },
      {
        name: "Fact Checker",
        description: "Verify claims within a block of text against sources.",
        href: "/fact-checker",
        icon: <ShieldQuestion className="h-8 w-8 text-primary" />,
      },
      {
        name: "Drafting Assistant",
        description: "Generate a starter article on a new topic.",
        href: "/draft-article",
        icon: <FileText className="h-8 w-8 text-primary" />,
      },
      {
        name: "Notability Checker",
        description: "Assess if a topic meets Wikipedia's notability guidelines.",
        href: "/check-notability",
        icon: <BadgeCheck className="h-8 w-8 text-primary" />,
      },
      {
        name: "Cross-Wiki Inconsistency Detector",
        description: "Compare two articles to find factual discrepancies.",
        href: "/detect-inconsistencies",
        icon: <GitCompareArrows className="h-8 w-8 text-primary" />,
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
        icon: <Languages className="h-8 w-8 text-primary" />,
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
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      },
      {
        name: "Code Explainer",
        description: "Get a detailed, line-by-line explanation of code.",
        href: "/explain-code",
        icon: <Wand2 className="h-8 w-8 text-primary" />,
      },
       {
        name: "Regex Debugger",
        description: "Get a natural language explanation for regex.",
        href: "/debug-regex",
        icon: <Code className="h-8 w-8 text-primary" />,
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
        icon: <BookCopy className="h-8 w-8 text-primary" />,
      },
       {
        name: "Text Anonymizer",
        description: "Redact Personally Identifiable Information (PII).",
        href: "/anonymize-text",
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      },
      {
        name: "Contribution Trust Visualizer",
        description: "Visualize the editing behavior of a user.",
        href: "/trust-visualizer",
        icon: <BarChartHorizontal className="h-8 w-8 text-primary" />,
      },
    ]
  }
]


export default function HomePage() {
  return (
    <div className="container mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">Wikimedia AI Toolkit</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A suite of AI-powered tools to accelerate your editing workflow, assist with development, and analyze community data.
        </p>
      </header>

      {toolSections.map((section) => (
        <section key={section.title}>
          <h2 className="text-3xl font-headline font-bold mb-6">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {section.tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group">
                <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    {tool.icon}
                    <div className="flex-1">
                      <CardTitle className="font-headline text-2xl group-hover:text-primary">{tool.name}</CardTitle>
                    </div>
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
