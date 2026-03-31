import { HeroSection } from '@/components/hero-section';
import { WeddingCountdown } from '@/components/wedding-countdown';
// import { LoveStoryTimeline } from '@/components/love-story-timeline';
import { PhotoGallery } from '@/components/photo-gallery';
import { RSVPSection } from '@/components/rsvp-section';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

export default function Home() {
  return (
    <main id="main-container" className="h-[100dvh] max-h-[100vh] overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth relative bg-background/50 selection:bg-primary/20 no-scrollbar">
      <Navbar />
      <HeroSection />
      <WeddingCountdown />
      {/* <LoveStoryTimeline /> */}
      <PhotoGallery />
      <RSVPSection />
      <Footer />
    </main>
  );
}
