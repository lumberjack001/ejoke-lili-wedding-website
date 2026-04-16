'use client';

import { useState } from 'react';
import { Reveal } from '@/components/ui/reveal';

const colors = [
  { name: 'Rich Brown', hex: '#633918', description: 'Symbolizing warmth, stability, and deep roots.' },
  { name: 'Warm Gold', hex: '#BD8A3A', description: 'Representing illumination, joy, and a bright future.' },
];

export function ColorsOfTheDaySection() {
  const [hoveredColor, setHoveredColor] = useState<number | null>(null);

  return (
    <section className="h-[100dvh] overflow-y-auto no-scrollbar w-full flex flex-col py-20 sm:py-32 bg-white px-4 sm:px-6 lg:px-8 snap-start snap-always relative transition-colors duration-1000"
      style={{
        backgroundColor: hoveredColor !== null ? `${colors[hoveredColor].hex}15` : '#ffffff'
      }}
    >
      <div className="w-full max-w-5xl mx-auto my-auto space-y-16">
        {/* Section Header */}
        <div className="text-center">
          <Reveal delay={0}>
            <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-3">
              Colors of the Day
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-muted-foreground font-light">
              Dress to impress in our carefully selected palette
            </p>
          </Reveal>
        </div>

        {/* Colors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-3xl mx-auto">
          {colors.map((color, index) => (
            <Reveal key={index} delay={300 + index * 100} className="w-full">
              <div 
                className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-black/5"
                onMouseEnter={() => setHoveredColor(index)}
                onMouseLeave={() => setHoveredColor(null)}
              >
                {/* Color Block */}
                <div 
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-xs sm:text-sm font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-2">
                      {color.hex}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-serif mb-1">{color.name}</h3>
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500">
                      <div className="overflow-hidden">
                        <p className="text-xs sm:text-sm font-light text-white/90 mt-2 line-clamp-2">
                          {color.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
