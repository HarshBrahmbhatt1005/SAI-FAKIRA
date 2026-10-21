import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Meera Desai",
    location: "London, UK",
    text: "As NRIs, our biggest fear was navigating the Indian property market from afar. Sai Fakira completely eliminated that anxiety. Their team handled everything from vetting the developer in GIFT City to managing our home loan paperwork seamlessly. We own a premium asset without having taken a single flight to India.",
    role: "IT Professionals",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Dr. Anil Patel",
    location: "Dubai, UAE",
    text: "The financial transparency is what stood out. They laid out the exact ROI for commercial properties on SG Highway and helped us set up the Power of Attorney safely. It's rare to find an advisory that combines deep real estate knowledge with strict financial compliance.",
    role: "Senior Surgeon",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Karan Shah",
    location: "Sydney, Australia",
    text: "I wanted to diversify my portfolio back home in Ahmedabad but couldn't afford the time to deal with multiple agents and banks. Sai Fakira gave me a single point of contact. The entire end-to-end process, right down to the final registry, was executed with absolute professionalism.",
    role: "Investment Banker",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[var(--color-bg-primary)] py-7 md:py-9 border-t border-[var(--color-rule)]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1280px]">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-3 block">
            Client Success
          </span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-medium text-[var(--color-accent)] mb-4">
            Trusted Across Borders
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[15px] md:text-lg">
            Hear directly from our global clients who successfully invested in Ahmedabad without the hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-6 md:p-8 border border-[var(--color-rule)] bg-[var(--color-bg-secondary)] relative hover:border-[var(--color-accent)]/30 transition-colors group flex flex-col justify-between rounded-[2rem] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <div className="absolute top-6 right-6 text-[var(--color-rule)] font-serif text-6xl md:text-8xl leading-none group-hover:text-[var(--color-accent)]/10 transition-colors">
                "
              </div>
              <div className="relative z-10 mb-6">
                <p className="text-[var(--color-text-primary)] text-[14px] leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-3 mt-auto pt-4 border-t border-[var(--color-rule)]">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-[13px] text-[var(--color-accent)] mb-0">{t.name}</h4>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                    {t.role} • {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}