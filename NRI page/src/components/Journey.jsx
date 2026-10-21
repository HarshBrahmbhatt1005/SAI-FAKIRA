import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Video, MapPin, FileCheck, Home, ArrowRight } from 'lucide-react';
import { MeetingModal, LoanDrawer, FeedbackModal } from './JourneyModals';

const steps = [
  {
    id: 1,
    title: 'Schedule Virtual Meeting',
    desc: 'Intro call or private consultation — tell us exactly what you\'re looking for.',
    cta: 'Book a Meeting',
    action: 'meeting',
    icon: Video,
  },
  {
    id: 2,
    title: 'Property Identification',
    desc: 'We shortlist verified, bank-approved properties from our network of 100+ A-category developers.',
    cta: 'Browse Properties',
    action: 'properties',
    icon: MapPin,
  },
  {
    id: 3,
    title: 'Loan & Documentation',
    desc: 'NRI loan eligibility check, document coordination, and end-to-end bank liaison — all handled.',
    cta: 'View Required Documents',
    action: 'loan',
    icon: FileCheck,
  },
  {
    id: 4,
    title: 'Successfully Done',
    desc: 'Your property is secured. Your investment is protected. We remain available post-possession.',
    cta: 'Share Feedback',
    action: 'feedback',
    icon: Home,
  },
];

export default function Journey() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  
  // Controls the vertical fill of the timeline line
  const pathProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [activeModal, setActiveModal] = useState(null);

  const scrollToStep = (i) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scollMax = rect.height - window.innerHeight;
    const progress = i / (steps.length - 1);
    const scrollAmount = window.scrollY + rect.top + progress * scollMax;
    window.scrollTo({ top: scrollAmount, behavior: 'smooth' });
  };

  const handleAction = (action) => {
    if (action === 'properties') {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setActiveModal(action);
    }
  };

  return (
    <>
      <MeetingModal isOpen={activeModal === 'meeting'} onClose={() => setActiveModal(null)} />
      <LoanDrawer isOpen={activeModal === 'loan'} onClose={() => setActiveModal(null)} />
      <FeedbackModal isOpen={activeModal === 'feedback'} onClose={() => setActiveModal(null)} />

      <section id="journey" className="bg-[var(--color-bg-primary)] py-12 md:py-16 border-t border-[var(--color-rule)] relative snap-center" ref={containerRef}>
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-accent) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Mobile Header */}
        <div className="text-center mb-16 px-6 relative z-10 md:hidden">
          <span className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-3 block">
            Your Path Forward
          </span>
          <h2 className="font-serif text-3xl font-medium text-[var(--color-accent)] mb-4">
            How the Journey Works
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed">
            Simple, structured, and guided. We handle the heavy lifting while you make the decisions.
          </p>
        </div>

        {/* Mobile view layout (swipeable) */}
        <div className="md:hidden flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 pb-8 relative z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="snap-center shrink-0 w-[85vw] flex flex-col bg-[var(--color-bg-secondary)] p-8 rounded-2xl border border-[var(--color-rule)] shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] shrink-0">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[var(--color-accent)]">
                    {step.title}
                  </h3>
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="text-[var(--color-text-primary)] text-[15px] leading-relaxed mb-6 font-medium opacity-90">
                    {step.desc}
                  </p>
                  <div className="mt-auto">
                    {step.cta && (
                      <button 
                        onClick={() => handleAction(step.action)}
                        className="inline-flex items-center gap-[6px] text-[0.82rem] font-semibold text-[var(--color-accent)] border-b border-transparent hover:border-[var(--color-accent)] transition-colors pb-0.5"
                      >
                        {step.cta}
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop view layout (sticky 500vh scroll with padding buffers) */}
        <div className="hidden md:flex flex-col relative max-w-6xl mx-auto px-6 lg:px-12 z-10" style={{ height: '500vh' }}>
          
          {/* Stick below the navbar (assuming navbar is around 80px tall) */}
          <div className="sticky top-20 h-[calc(100vh-5rem)] flex flex-col justify-center pointer-events-none">
            
            {/* Sticky Header */}
            <div className="text-center mb-8 relative z-10 pointer-events-auto pt-6">
              <span className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-3 block">
                Your Path Forward
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-[var(--color-accent)] mb-4">
                How the Journey Works
              </h2>
              <p className="text-[var(--color-text-secondary)] text-[17px] leading-relaxed max-w-2xl mx-auto">
                Simple, structured, and guided. We handle the heavy lifting while you make the decisions, taking the friction out of cross-border investment & Legal formalities.
              </p>
            </div>

            <div className="flex items-center justify-center w-full max-w-5xl mx-auto h-[55vh]">
              
              {/* Minimal Straight Vertical Timeline */}
              <div className="w-16 h-full flex justify-center relative pointer-events-auto shrink-0 self-center mr-6 lg:mr-10">
                {/* Timeline background track */}
                <div className="absolute inset-y-0 w-1 bg-[var(--color-rule)] rounded-full left-1/2 -translate-x-1/2 overflow-hidden shadow-inner">
                  {/* Timeline active fill */}
                  <motion.div
                    className="w-full bg-[var(--color-accent)] origin-top shadow-[0_0_12px_var(--color-accent)]"
                    style={{ scaleY: pathProgress, height: '100%' }}
                  />
                </div>

                {/* Timeline Nodes */}
                <div className="absolute inset-y-0 w-full left-0 pointer-events-none z-20">
                  {steps.map((step, i) => {
                    const padding = 0.15; // 15% buffer top and bottom
                    const playableRange = 1 - (padding * 2);
                    const t = padding + (i / (steps.length - 1)) * playableRange;
                    return (
                      <button 
                        key={step.id} 
                        onClick={() => scrollToStep(i)} 
                        className="absolute w-[30px] h-[30px] rounded-full bg-[var(--color-bg-primary)] border-[2px] border-[var(--color-rule)] text-[var(--color-accent)] font-bold text-[11px] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:shadow-[0_0_15px_rgba(182,36,75,0.3)] transition-all duration-300 pointer-events-auto transform -translate-x-1/2 left-1/2 flex items-center justify-center tracking-tight group"
                        style={{ top: `calc(${t * 100}% - 15px)` }}
                      >
                        <span className="opacity-70 group-hover:opacity-100 transition-opacity">{step.id}</span>
                        {/* Interactive Ring */}
                        <div className="absolute inset-[-4px] rounded-full border border-[var(--color-accent)] opacity-0 group-hover:animate-ping group-hover:opacity-30 pointer-events-none"></div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Cards Area */}
              <div className="w-full relative h-[55vh] flex flex-col justify-center pointer-events-auto">
                 {steps.map((step, i) => (
                    <StepCard
                      key={step.id}
                      step={step}
                      i={i}
                      totalSteps={steps.length}
                      scrollYProgress={scrollYProgress}
                      onAction={() => handleAction(step.action)}
                    />
                  ))}
              </div>

            </div> {/* Close Timeline/Cards flex container */}

          </div>
        </div>
      </section>
    </>
  );
}

function StepCard({ step, i, totalSteps, scrollYProgress, onAction }) {
  const padding = 0.15; // 15% buffer zone at extremes
  const playableRange = 1 - (padding * 2);
  const peak = padding + (i / (totalSteps - 1)) * playableRange;
  const spread = 0.6 * playableRange / (totalSteps - 1); 

  const stepStart = peak - spread;
  const stepPeak = peak;
  const stepEnd = peak + spread;

  const scale = useTransform(scrollYProgress, [stepStart, stepPeak, stepEnd], [0.85, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [stepStart, stepPeak, stepEnd], [0, 1, 0]);
  const translateY = useTransform(scrollYProgress, [stepStart, stepPeak, stepEnd], [40, 0, -40]);

  const activeYThisStep = useTransform(scrollYProgress, pos => {
     if (i === 0 && pos <= stepPeak) return 0;
     if (i === totalSteps - 1 && pos >= stepPeak) return 0;
     return translateY.get();
  })

  const activeOpacityThisStep = useTransform(scrollYProgress, pos => {
     if (i === 0 && pos <= stepPeak) return 1;
     if (i === totalSteps - 1 && pos >= stepPeak) return 1;
     return opacity.get();
  })

  const activeScaleThisStep = useTransform(scrollYProgress, pos => {
     if (i === 0 && pos <= stepPeak) return 1;
     if (i === totalSteps - 1 && pos >= stepPeak) return 1;
     return scale.get();
  })

  const display = useTransform(activeOpacityThisStep, val => val < 0.05 ? 'none' : 'block');
  const zIndex = useTransform(activeOpacityThisStep, val => val > 0.5 ? 20 : 10);

  const Icon = step.icon;

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center origin-left w-full pointer-events-auto"
      style={{ 
        scale: activeScaleThisStep, 
        opacity: activeOpacityThisStep, 
        y: activeYThisStep,
        display,
        zIndex
      }}
    >
      <div className="bg-[var(--color-bg-primary)] p-10 md:p-14 rounded-[2rem] border border-[var(--color-rule)] shadow-xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 w-full max-w-2xl relative overflow-hidden group">
        
        {/* Subtle decorative glow for premium feel */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)] opacity-[0.03] rounded-full blur-[60px] pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 relative z-10">
          <div className="w-16 h-16 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] shrink-0 shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.1)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors duration-500">
            <Icon size={26} strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-3xl md:text-4xl font-medium text-[var(--color-accent)]">
            {step.title}
          </h3>
        </div>
        <div className="sm:pl-[5.5rem] relative z-10">
          <p className="text-[var(--color-text-secondary)] text-[1.1rem] leading-relaxed max-w-md mb-8 font-medium">
            {step.desc}
          </p>
          {step.cta && (
            <button 
              onClick={onAction}
              className="inline-flex items-center gap-[8px] text-[0.85rem] font-bold tracking-wide uppercase text-[var(--color-accent)] border-none hover:opacity-80 transition-opacity"
            >
              <span className="border-b border-transparent hover:border-[var(--color-accent)] transition-colors pb-0.5">{step.cta}</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}