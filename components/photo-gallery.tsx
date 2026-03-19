'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Reveal } from '@/components/ui/reveal';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export function PhotoGallery() {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  // Placeholder images - easily replaceable with real wedding photos
  const images: GalleryImage[] = [
    { id: 1, src: '/placeholder.jpg', alt: 'Wedding moment 1' },
    { id: 2, src: '/placeholder.jpg', alt: 'Wedding moment 2' },
    { id: 3, src: '/placeholder.jpg', alt: 'Wedding moment 3' },
    { id: 4, src: '/placeholder.jpg', alt: 'Wedding moment 4' },
    { id: 5, src: '/placeholder.jpg', alt: 'Wedding moment 5' },
    { id: 6, src: '/placeholder.jpg', alt: 'Wedding moment 6' },
  ];

  const selectedIndex = images.findIndex((img) => img.id === selectedImageId);
  const selectedImage = selectedIndex >= 0 ? images[selectedIndex] : null;

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedImageId(images[selectedIndex - 1].id);
    } else {
      setSelectedImageId(images[images.length - 1].id);
    }
  };

  const handleNext = () => {
    if (selectedIndex < images.length - 1) {
      setSelectedImageId(images[selectedIndex + 1].id);
    } else {
      setSelectedImageId(images[0].id);
    }
  };

  return (
    <section className="h-[100dvh] overflow-y-auto no-scrollbar w-full flex flex-col py-20 sm:py-32 bg-gradient-to-b from-background to-secondary/5 px-4 sm:px-6 lg:px-8 snap-start snap-always relative">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Reveal delay={0}>
            <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-3">
              Our Moments
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-muted-foreground font-light">
              Memories we cherish together
            </p>
          </Reveal>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images.map((image, index) => (
            <Reveal key={image.id} delay={index * 100} className="w-full h-full">
            <div
              key={image.id}
              onClick={() => setSelectedImageId(image.id)}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-foreground"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                      <path d="M6.5 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.21 13.29l-2.58-2.58a1 1 0 00-1.42 0L8 13.5l-2.29-2.29a1 1 0 00-1.42 0l-2.58 2.58" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedImageId !== null} onOpenChange={(open) => !open && setSelectedImageId(null)}>
        <DialogContent className="max-w-4xl w-full p-0 border-0 bg-black/90">
          {selectedImage && (
            <div className="relative w-full h-96 sm:h-[600px]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
              />
              
              {/* Navigation Buttons */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/20 hover:bg-white/40 transition-colors p-2"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/20 hover:bg-white/40 transition-colors p-2"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Close Button */}
              <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white/20 hover:bg-white/40 transition-colors p-2">
                <X className="w-6 h-6 text-white" />
              </DialogClose>

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-light">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
