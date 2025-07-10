'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { galleryImages, categories } from '@/lib/data';
import type { GalleryImage } from '@/lib/data';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(image => image.category === activeCategory);

  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Winning Images</h1>
        <p className="text-lg text-muted-foreground">Explore past international winning images from Indian volunteers.</p>
      </header>
      
      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          variant={activeCategory === 'All' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('All')}
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map((image: GalleryImage) => (
          <Card key={image.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={image.hint}
                />
              </div>
            </CardContent>
            <CardFooter className="p-4 flex-col items-start">
              <Badge variant="secondary" className="mb-2">{image.category}</Badge>
              <p className="font-semibold text-sm">{image.title}</p>
              <p className="text-xs text-muted-foreground">by {image.author}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
