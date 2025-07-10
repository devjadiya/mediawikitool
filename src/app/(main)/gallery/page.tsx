
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
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-headline font-bold mb-2">Image Gallery</h1>
        <p className="text-xl text-muted-foreground">Explore past winning images from around the world.</p>
      </header>
      
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Button
          variant={activeCategory === 'All' ? 'default' : 'secondary'}
          onClick={() => setActiveCategory('All')}
          className="rounded-full"
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'secondary'}
            onClick={() => setActiveCategory(category)}
            className="rounded-full"
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
