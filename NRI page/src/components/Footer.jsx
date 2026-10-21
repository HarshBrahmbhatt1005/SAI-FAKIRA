import React from 'react';

export default function Footer() {
  return (
    <section className="bg-[var(--color-accent)] text-white py-8 md:py-10 border-t border-[var(--color-rule)]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1000px] text-center">
        <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-medium mb-4 leading-tight text-[whitesmoke]">
          Ready to secure your footprint in Ahmedabad?
        </h2>
        <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto mb-6">
          We handle the legwork. You make the call.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <a href="mailto:info@saifakira.com" className="w-full sm:w-auto bg-white text-[var(--color-accent)] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[var(--color-bg-secondary)] transition-colors inline-block">
            Schedule a Session
          </a>
          <a 
            href="https://wa.me/919033784030" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto border border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-[var(--color-accent)] transition-colors inline-block"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}