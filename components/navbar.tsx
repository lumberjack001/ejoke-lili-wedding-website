'use client';

export function Navbar() {
  const scrollToTop = () => {
    const container = document.getElementById('main-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
      <button 
        onClick={scrollToTop}
        className="backdrop-blur-xl bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full px-8 py-3 pointer-events-auto transition-all duration-300 hover:bg-white/40 dark:hover:bg-black/40 hover:scale-105 cursor-pointer"
      >
        <h2 className="text-lg sm:text-xl font-serif text-foreground/90 tracking-wide m-0">
          You <span className="text-primary italic mx-1">are</span> Invited<span className="text-primary italic mx-1">!!</span>
        </h2>
      </button>
    </div>
  );
}
