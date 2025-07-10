import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Code, ShieldCheck, Trophy, Calendar, BookOpen } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">About WLS India</h1>
        <p className="text-xl text-muted-foreground">Celebrating science through photography.</p>
      </header>
       <Card className="bg-card/90">
        <CardContent className="p-6 text-lg space-y-4 text-muted-foreground">
          <p>
            Wiki Loves Science (WLS) is an annual international science photography competition that invites people to contribute high-quality, freely-licensed images related to science to Wikimedia Commons.
          </p>
          <p>
            The WLS India Archive is a dedicated platform to showcase the incredible winning contributions from Indian volunteers over the years. Our goal is to create a beautiful gallery, provide resources for future participants, and build AI-powered tools to make contributing even easier.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center gap-4 p-4 rounded-lg">
            <div className="p-4 bg-secondary rounded-full">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold">Image Gallery</h3>
            <p className="text-muted-foreground">
                Explore past winning international images from Indian volunteers on Wikimedia Commons.
            </p>
        </div>
        <div className="flex flex-col items-center gap-4 p-4 rounded-lg">
           <div className="p-4 bg-secondary rounded-full">
            <Calendar className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold">Competition Timelines</h3>
            <p className="text-muted-foreground">
                View a historical overview of past WLS India competitions with key dates and highlights.
            </p>
        </div>
        <div className="flex flex-col items-center gap-4 p-4 rounded-lg">
           <div className="p-4 bg-secondary rounded-full">
            <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold">Contribution Guides</h3>
            <p className="text-muted-foreground">
                Find clear instructions and guidelines on how to participate and contribute to the competition.
            </p>
        </div>
      </div>
    </div>
  );
}
