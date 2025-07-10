import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { sponsors } from '@/lib/data';
import { CountdownTimer } from '@/components/countdown-timer';
import { GalleryCarousel } from '@/components/gallery-carousel';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const competitionStartDate = new Date('2025-11-01T00:00:00Z');

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* Hero Section */}
      <section className="container mx-auto text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
          Wiki Science Competition 2025
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl mb-8">
          An annual international science photography competition, bringing together the worlds of science and art to increase the amount of free, high-quality scientific images.
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
          <h2 className="text-3xl font-headline font-bold mb-8">Our Supporters</h2>
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
