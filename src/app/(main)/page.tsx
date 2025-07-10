import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileSearch, Sparkles, ShieldQuestion, FileText } from 'lucide-react';

const tools = [
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
    description: "Verify claims within a block of text.",
    href: "/fact-checker",
    icon: <ShieldQuestion className="h-8 w-8 text-primary" />,
  },
  {
    name: "Drafting Assistant",
    description: "Generate a starter article on a new topic.",
    href: "/draft-article",
    icon: <FileText className="h-8 w-8 text-primary" />,
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">Wikimedia AI Toolkit</h1>
        <p className="text-xl text-muted-foreground">
          A suite of AI-powered tools to accelerate your editing workflow.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <Card className="h-full hover:border-primary transition-colors hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
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
    </div>
  );
}
