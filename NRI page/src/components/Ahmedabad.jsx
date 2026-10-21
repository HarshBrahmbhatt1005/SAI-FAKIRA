import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, MapPin, Building2, Train, ShieldCheck, Globe, Trophy, Landmark, Rocket } from 'lucide-react';
import giftCityImage from '../../images/gift city.png';
import developmentImage from '../../images/i1.jpg';
import financeImage from '../../images/i3.jpg';
import ecosystemImage from '../../images/i2.jpg';

const mapPoints = [
  { id: 'gift', x: '70%', y: '15%', label: 'GIFT City Corridor', type: 'Long-term Appreciation ', growth: '+18% YoY', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50' },
  { id: 'Motera', x: '35%', y: '35%', label: 'Motera', type: 'Short term & High Rental Yield', growth: '+20% YoY', color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
  { id: 'Dholera', x: '50%', y: '45%', label: 'Dholera Smart City', type: 'Major Industrial Hub', growth: '+14% YoY', color: 'bg-[var(--color-accent)]', shadow: 'shadow-[var(--color-accent)]/50' },
  { id: 'Science-Park', x: '45%', y: '70%', label: 'Science Park', type: 'Luxury Residential & Commercial Hub', growth: '+16% YoY', color: 'bg-amber-500', shadow: 'shadow-amber-500/50' },
  { id: 'Shilaj-Godhavi', x: '25%', y: '65%', label: 'Shilaj-Godhavi Corridor', type: 'Rail Expansion & 2030 Olympics', growth: '+15% YoY', color: 'bg-rose-500', shadow: 'shadow-rose-500/50' }
];

const blogs = [
  { 
    title: "GIFT City – India's Global Financial Hub",
    type: 'image',
    colSpan: 'md:col-span-2',
    img: giftCityImage,
    desc: "GIFT City is India's first global financial and IT services hub, offering world-class infrastructure, tax benefits and strong government backing. Its rapid development is creating high-potential opportunities for investors and long-term real estate growth.",
    icon: Landmark
  },
  {
    title: "Commonwealth Games Host City",
    type: 'typo',
    colSpan: 'md:col-span-1',
    highlight: "2030",
    desc: "Ahmedabad's selection as the host city marks a major milestone. Such international events typically lead to accelerated infrastructure development, upgraded networks, and positive impact on real estate demand and property values.",
    icon: Trophy
  },
  {
    title: "Predictable, Steady Appreciation",
    type: 'typo',
    colSpan: 'md:col-span-1',
    highlight: "Steady ↑",
    desc: "Unlike highly volatile metro markets, Ahmedabad is known for its predictable and steady real estate appreciation. Property prices grow gradually without extreme fluctuations, offering capital protection and consistent returns.",
    icon: TrendingUp
  },
  {
    title: "Major Development & Global Attention",
    type: 'image',
    colSpan: 'md:col-span-1',
    img: developmentImage,
    desc: "Ahmedabad is witnessing rapid infra transformation. Metro rail expansion, riverfront projects, modern expressways, and airport upgrades are reshaping the urban landscape and attracting global businesses.",
    icon: Globe
  },
  {
    title: "Bullet Train Connectivity",
    type: 'typo',
    colSpan: 'md:col-span-1',
    highlight: "320 km/h",
    desc: (
      <>
        The Mumbai-Ahmedabad High Speed Rail Corridor will enable seamless high-speed travel between Ahmedabad and Mumbai in just around <span className="text-[var(--color-accent)] font-medium">2 hours</span>, setting a new benchmark for fast, efficient intercity connectivity.
      </>
    ),
    icon: Train
  },
  {
    title: "Fast-Growing Economic Centre",
    type: 'image',
    colSpan: 'md:col-span-1',
    img: financeImage,
    pos: 'object-right',
    desc: "A balanced and resilient economic centre with a strong presence across pharma, textiles, IT, and finance. This diversified economic base lowers risk and drives sustained housing demand.",
    icon: Building2
  },
  {
    title: "Dholera Greenfield Smart City",
    type: 'typo',
    colSpan: 'md:col-span-1',
    highlight: "High ROI",
    desc: "Positioned within the Delhi-Mumbai Industrial Corridor, Dholera is India's first platinum-rated smart city. Early-stage investments offer massive exponential capital appreciation driven by the new international airport and massive tech & manufacturing hubs.",
    icon: Rocket
  },
  {
    title: "NRI-Friendly Ecosystem",
    type: 'image',
    colSpan: 'md:col-span-1',
    img: ecosystemImage,
    desc: "Ahmedabad offers a highly NRI-friendly ecosystem supported by a strong global Gujarati diaspora, international connectivity, and growing professional support services for overseas property owners.",
    icon: Globe
  }
];

export default function Ahmedabad() {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  return (
    <section id="about" className="bg-[var(--color-bg-primary)] border-t border-[var(--color-rule)] pb-24">

      {/* Main Section Header */}
      <div className="text-center pt-10 pb-6 px-6 max-w-4xl mx-auto relative z-10">
        <span className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4 block">
          Data-Backed Market Intelligence
        </span>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-[var(--color-accent)] mb-6">
          Why Ahmedabad Makes Sense
        </h2>
        <p className="text-[var(--color-text-secondary)] text-[16px] max-w-2xl mx-auto leading-relaxed mb-[10px]">
          The following market drivers and insights highlight exactly why Ahmedabad is one of India's most secure and lucrative real estate frontiers, driven by massive infrastructure investments and predictable appreciation.
        </p>
      </div>

      {/* The Market Drivers & High Appreciation Zones */}
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">

        {/* High Appreciation Zones (Highlighted Component) */}
        <div className="mb-10 bg-[var(--color-bg-secondary)] border border-[var(--color-accent)]/20 rounded-[2.5rem] p-6 md:p-8 pb-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)] relative overflow-hidden group">

          {/* Subtle Glow Background highlight */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent)] opacity-[0.03] dark:opacity-[0.015] rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 group-hover:opacity-[0.05]"></div>

          <div className="relative z-10 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-rule)] pb-4">
            <div>
              <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-2 block flex items-center gap-2">
                <TrendingUp size={16} /> Highlighted Insight
              </span>
              <h4 className="font-serif text-2xl md:text-3xl font-medium text-[var(--color-accent)]">
                Growth Corridors & High Appreciation Zones
              </h4>
            </div>
            <p className="text-[var(--color-text-secondary)] text-[13px] md:text-[14px] font-serif italic max-w-sm text-right hidden md:block">
              Areas experiencing rapid transformation due to planned infrastructure mega-projects.
            </p>
          </div>

          <div className="relative z-10 flex overflow-x-auto lg:grid lg:grid-cols-5 gap-4 pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 lg:pb-0 snap-x snap-mandatory scrollbar-hide">
            {[...mapPoints].sort((a, b) => parseInt(b.growth) - parseInt(a.growth)).map((point, i) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                key={point.id}
                className="bg-[var(--color-bg-primary)] border border-[var(--color-rule)] rounded-[1.2rem] p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_8px_20px_rgba(255,255,255,0.02)] transition-all duration-300 flex flex-col justify-between min-w-[200px] w-[65%] lg:w-auto lg:min-w-0 snap-center"
              >
                <div>
                  <p className="text-[var(--color-accent)] text-[11px] uppercase font-bold tracking-[0.15em] mb-3">{point.type}</p>
                  <h5 className="text-[var(--color-accent)] font-serif text-[17px] font-medium mb-5 leading-snug whitespace-nowrap">{point.label}</h5>
                </div>
                <div className="pt-4 border-t border-[var(--color-rule)] flex items-center justify-between mt-2">
                  <span className="text-[12px] text-[var(--color-text-secondary)] uppercase tracking-widest font-bold">Expected</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl tracking-tight">{point.growth.split(' ')[0]}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 snap-x snap-mandatory scrollbar-hide">
          {blogs.map((blog, i) => (
            <div
              key={i}
              className={`relative rounded-[2rem] overflow-hidden group transition-all duration-300 ${blog.type === 'image' ? 'bg-black shadow-lg' : 'bg-[var(--color-bg-secondary)] border border-[var(--color-rule)] shadow-sm hover:shadow-md'
                } ${blog.colSpan === 'md:col-span-2' ? 'md:col-span-2 lg:col-span-2' : ''} min-w-[300px] w-[85%] md:w-auto md:min-w-0 snap-center`}
              style={{ minHeight: blog.type === 'typo' ? '300px' : '400px' }}
            >
              {blog.type === 'image' ? (
                // Image Card
                <div className="w-full h-full flex flex-col justify-end p-8 md:p-10 relative">
                  <img 
                    src={blog.img} 
                    alt={blog.title} 
                    className={`absolute inset-0 w-full h-full object-cover ${blog.pos || 'object-center'} opacity-90 transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 group-hover:opacity-100`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>

                  <div className="relative z-10 w-full">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-5 border border-white/20 transform transition-transform group-hover:-translate-y-1">
                      <blog.icon size={20} />
                    </div>
                    <h4 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-3 leading-[1.15] text-shadow-sm">{blog.title}</h4>
                    <p className="text-white/80 text-[15px] leading-relaxed max-w-lg mb-1">
                      {blog.desc}
                    </p>
                  </div>
                </div>
              ) : (
                // Typographic Statement Card
                <div className="w-full h-full p-8 md:p-10 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-12">
                    <blog.icon size={48} strokeWidth={1.5} className="text-[var(--color-accent)] opacity-40 mix-blend-multiply" />
                    <h3 className="font-serif text-5xl md:text-6xl tracking-tight text-[var(--color-accent)] font-medium">{blog.highlight}</h3>
                  </div>
                  <div>
                    <h4 className="font-serif text-xl md:text-2xl text-[var(--color-accent)] mb-3 leading-tight font-medium">{blog.title}</h4>
                    <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed">
                      {blog.desc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
