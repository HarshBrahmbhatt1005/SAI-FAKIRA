import React from 'react';
import { motion } from 'framer-motion';
import verifiedDevelopersImage from '../../images/Verified-Developers.jpg';
import confusingPricingImage from '../../images/Confusing-Pricing.png';
import clearPricingImage from '../../images/Clear.jpeg';
import loanPaperworkImage from '../../images/Loan.jpeg';
import supportManagerImage from '../../images/RM.jpg';

const propertyPoints = [
  {
    title: 'Not sure which developers are reliable',
    desc: 'Overseas buyers often struggle to evaluate developers remotely and worry about project credibility, legal clarity, and delivery standards.',
    image: verifiedDevelopersImage,
    alt: 'Construction helmet on architectural blueprints representing verified developers'
  },
  {
    title: 'Confusing pricing & mixed information',
    desc: 'Multiple quotes, unclear charges, and conflicting market advice make it difficult to compare options and take confident decisions.',
    image: confusingPricingImage,
    alt: 'Property market analysis screens and documents representing confusing pricing'
  }
];

const loanBenefits = [
  {
    title: 'Verified, Bank-Approved & Transparent',
    desc: 'Only legally vetted, bank-approved projects with clear valuations and structured options. No guesswork, no hidden confusion.',
    image: clearPricingImage,
    alt: 'Trusted project verification and transparent pricing documents'
  },
  {
    title: 'Seamless End-to-End Paperwork',
    desc: 'From NRI loan eligibility checks to overseas bank liaison, we simplify complex remote documentation from start to finish.',
    image: loanPaperworkImage,
    alt: 'Loan paperwork and documentation support for NRI buyers'
  },
  {
    title: 'Dedicated Long-Term Support',
    desc: 'You get one reliable relationship manager who stays with you after closing and remains available long after possession.',
    image: supportManagerImage,
    alt: 'Dedicated relationship manager support for long-term guidance'
  }
];

export default function BeforeAfter() {
  return (
    <section className="bg-[var(--color-bg-primary)] py-8 lg:py-9 border-t border-[var(--color-rule)] relative overflow-hidden flex flex-col justify-center min-h-[min(100vh,800px)]">
      
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-text-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="container mx-auto px-6 lg:px-10 max-w-[1450px] relative z-10">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-2 block">
            The Sai Fakira Standard
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-[var(--color-accent)] mb-3">
            Understanding the NRI Reality
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed">
            We know exactly what it means to invest from thousands of miles away. Here is how we remove the friction.
          </p>
        </div>

        <div className="relative">
          
          {/* Subtle Ambient Background Highlight */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent)] opacity-[0.02] rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex overflow-x-auto md:grid md:grid-cols-2 xl:grid-cols-5 gap-4 lg:gap-5 pb-8 -mx-6 px-6 md:pb-0 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
            {propertyPoints.map((point, i) => (
              <motion.article
                key={`property-${i}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-[var(--color-bg-secondary)] border border-[var(--color-rule)] rounded-[1.6rem] overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgba(138,32,70,0.07)] transition-shadow duration-500 flex flex-col min-h-[430px] group min-w-[280px] w-[85%] md:w-auto md:min-w-0 snap-center"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={point.image}
                    alt={point.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-5 py-6 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-[1.4rem] leading-tight text-[var(--color-accent)] mb-3">
                      {point.title}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] text-[0.9rem] leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                  <div className="h-1 w-0 bg-[var(--color-accent)]/20 mt-6 rounded-full group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>
              </motion.article>
            ))}

            {loanBenefits.map((benefit, i) => {
            return (
              <motion.div 
                key={`loan-${i}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (i + propertyPoints.length) * 0.08 }}
                className="bg-[var(--color-bg-secondary)] border border-[var(--color-rule)] rounded-[1.6rem] p-5 lg:p-6 hover:bg-[var(--color-bg-primary)] transition-colors duration-500 group relative flex flex-col justify-between min-h-[430px] min-w-[280px] w-[85%] md:w-auto md:min-w-0 snap-center"
              >
                <div className="h-44 overflow-hidden -mx-5 -mt-5 lg:-mx-6 lg:-mt-6 mb-4 rounded-t-[1.6rem]">
                  <img
                    src={benefit.image}
                    alt={benefit.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-[1.15rem] md:text-xl font-medium text-[var(--color-accent)] mb-3 leading-snug">
                    {benefit.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-[0.9rem] leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
                
                {/* Decorative Bottom Line per segment */}
                <div className="h-1 w-0 bg-[var(--color-accent)]/20 mt-6 rounded-full group-hover:w-full transition-all duration-700 ease-out"></div>
              </motion.div>
            );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}