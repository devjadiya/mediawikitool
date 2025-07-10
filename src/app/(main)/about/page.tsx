import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Code, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">About This Project</h1>
        <p className="text-xl text-muted-foreground">A flagship toolkit by Dev Jadiya.</p>
      </header>

      <Card className="bg-secondary/50 border-white/10">
        <CardHeader>
          <CardTitle className="font-headline">Mission</CardTitle>
        </CardHeader>
        <CardContent className="text-lg space-y-4 text-muted-foreground">
          <p>
            The Wikimedia AI Toolkit is an open-source project dedicated to building powerful, intuitive, and innovative tools for the Wikimedia community. 
            The mission is to streamline workflows, enhance content quality, and help Wikimedians with their vital work of curating the world's knowledge.
          </p>
          <p>
            This project leverages modern technologies like generative AI to create solutions that address the unique challenges faced by editors, admins, developers, and volunteers. 
            Whether it's simplifying content creation, ensuring privacy, or analyzing data, this toolkit is here to help.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center gap-4 p-4 rounded-lg">
            <div className="p-4 bg-secondary rounded-full">
              <Bot className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold">AI-Powered Assistance</h3>
            <p className="text-muted-foreground">
                Harness the power of generative AI to assist with tasks like captioning images, suggesting categories, and validating content.
            </p>
        </div>
        <div className="flex flex-col items-center gap-4 p-4 rounded-lg">
           <div className="p-4 bg-secondary rounded-full">
            <Code className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold">Developer Focused</h3>
            <p className="text-muted-foreground">
                Built with modern DevOps principles in mind, providing tools and workflows that are efficient, scalable, and easy to contribute to.
            </p>
        </div>
        <div className="flex flex-col items-center gap-4 p-4 rounded-lg">
           <div className="p-4 bg-secondary rounded-full">
            <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold">Privacy & Security</h3>
            <p className="text-muted-foreground">
                Including tools to help with cybersecurity and privacy-related tasks, ensuring the safety and integrity of Wikimedia projects.
            </p>
        </div>
      </div>
    </div>
  );
}
