import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">About Wiki Science Competition India</h1>
        <p className="text-xl text-muted-foreground">Celebrating Indian science through the lens of open knowledge.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Our Mission in India</CardTitle>
        </CardHeader>
        <CardContent className="text-lg space-y-4">
          <p>
            Wiki Science Competition is an annual international photographic competition. For the first time in 2025, India is officially hosting its own national event!
            We invite people from all corners of India to contribute high-quality, freely licensed images related to science.
          </p>
          <p>
            Our goal is to build a rich repository of scientific images that reflect India's unique research, biodiversity, and technological advancements.
            By sharing these images on Wikimedia Commons, we make scientific knowledge from an Indian perspective more accessible,
            understandable, and engaging for everyone, everywhere. These images are used to illustrate
            Wikipedia articles and other educational projects, enriching learning for millions globally.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold">The Impact of Your Contribution</h2>
            <p className="text-lg">
                Your contributions have a lasting impact. Images from Wiki Science Competition India will be
                featured in thousands of Wikipedia articles, viewed millions of times, and will help
                students, researchers, and the curious public better understand complex scientific topics from an Indian context.
                Each photo is a step towards democratizing science.
            </p>
        </div>
        <Image 
            src="https://placehold.co/600x400.png"
            alt="A collage of winning science images"
            width={600}
            height={400}
            className="rounded-lg shadow-md"
            data-ai-hint="indian science collage"
        />
      </div>
    </div>
  );
}
