import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { sponsors } from '@/lib/data';
import { CountdownTimer } from '@/components/countdown-timer';
import { GalleryCarousel } from '@/components/gallery-carousel';
import { ArrowRight, Bot, PenSquare, ScanSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const aiTools = [
    {
        href: '/suggest-category',
        title: 'Category Suggester',
        description: "Upload an image and let AI suggest the most relevant competition categories.",
        icon: <ScanSearch className="h-10 w-10 text-primary" />
    },
    {
        href: '/generate-caption',
        title: 'Caption Writer',
        description: "Get help writing a clear, encyclopedic caption for your submission.",
        icon: <PenSquare className="h-10 w-10 text-primary" />
    },
    {
        href: '/validate-image',
        title: 'Image Validator',
        description: "Check your photo against common rules before you upload it.",
        icon: <Bot className="h-10 w-10 text-primary" />
    }
]

export default function HomePage() {
  const competitionStartDate = new Date('2025-11-01T00:00:00Z');

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* Hero Section */}
      <section className="container mx-auto text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
          Wiki Science Competition 2025: India
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl mb-8">
          Welcome to the inaugural Indian edition of the world's biggest science photography competition. Share your vision of science in India with the world!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg">
            <Link href="/contribute">
              Learn How to Participate
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/gallery">
              Explore Past Winners
            </Link>
          </Button>
        </div>
        <div className="max-w-2xl mx-auto">
          <CountdownTimer targetDate={competitionStartDate} />
        </div>
      </section>

      {/* AI Tools Section */}
       <section className="container mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-headline font-bold">AI-Powered Tools for Participants</h2>
            <p className="text-muted-foreground mt-2">Get a competitive edge with our custom tools designed to help you succeed.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiTools.map(tool => (
                <Card key={tool.href} className="flex flex-col text-center items-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                        {tool.icon}
                        <CardTitle className="font-headline mt-4">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{tool.description}</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                         <Button asChild variant="outline">
                            <Link href={tool.href}>Try Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
      </section>

      {/* Featured Gallery Section */}
      <section className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-headline font-bold">Featured Images</h2>
            <Button asChild variant="link" className="pr-0">
                <Link href="/gallery">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </div>
        <GalleryCarousel />
      </section>

      {/* Sponsors Section */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-headline font-bold mb-8">Our Supporters in India</h2>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6">
            {sponsors.map((sponsor) => (
              <a key={sponsor.name} href={sponsor.url} target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 transition-all duration-300">
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  width={150}
                  height={60}
                  className="object-contain"
                  data-ai-hint={sponsor.hint}
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
