import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bot, PenSquare, ScanSearch, ShieldQuestion } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { tools } from '@/lib/data';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* Hero Section */}
      <section className="container mx-auto text-center">
        <div className="mb-4">
            <Image 
                src="/wmf-logo.svg" 
                alt="Wikimedia AI Toolkit Logo" 
                width={80} 
                height={80} 
                className="mx-auto" 
            />
        </div>
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
          Wikimedia AI Toolkit
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl mb-8">
          A suite of modern, AI-powered tools designed to streamline workflows and empower the Wikimedia community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg">
            <Link href="#tools">
              Explore Tools
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </section>

      {/* AI Tools Section */}
       <section id="tools" className="container mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-headline font-bold">Toolkit Dashboard</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Discover tools for content creation, media handling, privacy, and more. 
              Select a tool to get started.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map(tool => (
                <Card key={tool.href} className="flex flex-col hover:shadow-lg transition-shadow border-2 group">
                    <CardHeader className="flex-row items-center gap-4">
                        {tool.icon}
                        <div className="flex-grow">
                          <CardTitle className="font-headline text-xl">{tool.title}</CardTitle>
                          <CardDescription>{tool.category}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground text-sm">{tool.description}</p>
                    </CardContent>
                    <div className="p-4 pt-0">
                         <Button asChild variant="outline" className="w-full">
                            <Link href={tool.href}>Launch Tool <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                </Card>
            ))}
             {/* "More tools coming soon" card */}
            <Card className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed">
                <div className="flex-grow flex flex-col items-center justify-center">
                    <Bot className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-headline text-xl font-semibold">More Tools Coming Soon</h3>
                    <p className="text-muted-foreground text-sm mt-2">
                        We're constantly developing new tools. Have an idea? Let us know!
                    </p>
                </div>
                 <Button asChild variant="ghost" className="w-full mt-4">
                    <Link href="/contact">Suggest a Tool</Link>
                </Button>
            </Card>
        </div>
      </section>
    </div>
  );
}
