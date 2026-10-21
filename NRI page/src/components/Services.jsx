import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: "20+ Years of Finance Expertise",
    label: "Finance",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=80",
    bullets: [
      "20+ years in financial advisory",
      "140+ Banks & MNC",
      "Complete end-to-end loan support",
      "Faster phygital process"
    ]
  },
  {
    title: "Exclusive Properties, Prime Locations",
    label: "Property",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80",
    bullets: [
      "Exclusive deals & verified projects",
      "Prime locations across Ahmedabad & Gandhinagar", 
      "High appreciation zones",
      "Tie-ups with 100+ developers"
    ]
  }
];

export default function Services() {
  return (
    <section id="services" className="bg-[var(--color-bg-secondary)] py-8 lg:py-9 border-t border-[var(--color-rule)]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1280px]">
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-2 block">
            Our Expertise
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-[var(--color-accent)] mb-3">
            What We Do
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[15px] max-w-2xl mx-auto">
            End-to-end loan & property assistance for NRIs — transparent, verified, stress-free.
          </p>
        </div>

        <div className="flex flex-row overflow-x-auto md:overflow-visible md:justify-center gap-5 md:gap-6 h-auto md:h-[400px] max-w-6xl mx-auto w-full pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 snap-x snap-mandatory scrollbar-hide">
          {services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex-1 rounded-[2.5rem] bg-[var(--color-bg-primary)] overflow-hidden border border-[var(--color-rule)] shadow-sm hover:shadow-[0_10px_40px_rgba(138,32,70,0.06)] md:hover:flex-[1.1] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] p-3 flex flex-col min-h-[380px] md:min-h-0 min-w-[300px] w-[85%] md:w-auto md:min-w-0 snap-center"
            >
              {/* Image Upper Area */}
              <div className="w-full h-[200px] md:h-[50%] rounded-[2rem] overflow-hidden relative shrink-0 border border-black/5">
                <img src={svc.img} alt={svc.label} className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" />
                <div className="absolute top-4 left-5 bg-[var(--color-bg-primary)]/95 backdrop-blur shadow-sm text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full z-10">
                  {svc.label}
                </div>
              </div>

              {/* Text Lower Area */}
              <div className="flex-1 flex flex-col justify-center px-4 md:px-6 pt-5 pb-3 md:pb-0 md:pt-0">
                <h3 className="font-serif text-[1.35rem] lg:text-[1.6rem] font-medium text-[var(--color-accent)] mb-4 leading-snug">
                  {svc.title}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  {svc.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[0.9rem] text-[var(--color-text-secondary)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-[7px] shrink-0 opacity-70" />
                      <span className="leading-snug opacity-90">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}