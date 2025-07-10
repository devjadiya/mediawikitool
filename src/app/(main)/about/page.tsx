import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-5xl font-headline font-bold text-primary mb-2">About Wiki Loves Science</h1>
        <p className="text-xl text-muted-foreground">Celebrating science through the lens of open knowledge.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="text-lg space-y-4">
          <p>
            Wiki Loves Science is an annual international photographic competition that invites people to
            contribute high-quality, freely licensed images related to science. In India, the competition
            aims to build a rich repository of scientific images that reflect the country's research,
            biodiversity, and technological advancements.
          </p>
          <p>
            By sharing these images on Wikimedia Commons, we make scientific knowledge more accessible,
            understandable, and engaging for everyone, everywhere. These images are used to illustrate
            Wikipedia articles and other educational projects, enriching learning for millions globally.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold text-primary">The Impact</h2>
            <p className="text-lg">
                Your contributions have a lasting impact. Images from Wiki Loves Science India have been
                featured in thousands of Wikipedia articles, viewed millions of times, and have helped
                students, researchers, and the curious public better understand complex scientific topics.
                Each photo is a step towards democratizing science.
            </p>
        </div>
        <Image 
            src="https://placehold.co/600x400.png"
            alt="A collage of winning science images"
            width={600}
            height={400}
            className="rounded-lg shadow-md"
            data-ai-hint="science collage"
        />
      </div>
    </div>
  );
}
