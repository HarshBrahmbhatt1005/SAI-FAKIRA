import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

const INDIA_COORD = [72.5714, 23.0225]; // Ahmedabad
const pins = [
  { city: "USA", coords: [-95.7129, 37.0902] },
  { city: "Canada", coords: [-106.3468, 56.1304] },
  { city: "UK", coords: [-3.4360, 55.3781] },
  { city: "UAE", coords: [55.2708, 25.2048] },
  { city: "Australia", coords: [133.7751, -25.2744] },
  { city: "Singapore", coords: [103.8198, 1.3521] },
  { city: "South Africa", coords: [22.9375, -30.5595] }
];

export default function TrustMap() {
  const [geographies, setGeographies] = useState([]);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(worldData => {
        setGeographies(feature(worldData, worldData.objects.countries).features);
      });
  }, []);

  const projection = geoEquirectangular().scale(150).translate([500, 250]);
  const pathGenerator = geoPath().projection(projection);

  // Generate curved path between India and destination
  const getArc = (dest) => {
    const start = projection(INDIA_COORD);
    const end = projection(dest);
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Controls curve amount
    return `M${start[0]},${start[1]} A${dr},${dr} 0 0,1 ${end[0]},${end[1]}`;
  };

  return (
    <section id="trustMap" className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-rule)] relative overflow-hidden pt-12 md:pt-16 pb-12 md:pb-16 w-full snap-center">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(var(--color-text-muted) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      <div className="w-full mx-auto px-4 lg:px-8 max-w-[1280px] relative z-10 flex flex-col">
        <div className="relative pt-[23px]" style={{ paddingTop: '22px' }}>
          <div className="text-center mb-4 md:mb-6">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-2 block">
              Global Presence
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-[var(--color-accent)] mb-0">
              Connecting NRIs back home.
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto mb-4 md:mb-6 w-full flex items-center justify-center">
            <svg viewBox="0 30 1000 340" className="w-full max-h-[350px] lg:max-h-[460px] drop-shadow-xl overflow-visible">
              {/* Base Map */}
              <g className="landmasses">
                {geographies.filter(d => d.properties?.name !== "Antarctica").map((d, i) => (
                  <path
                    key={`path-${i}`}
                    d={pathGenerator(d)}
                    fill="var(--color-bg-primary)"
                    stroke="var(--color-rule)"
                    strokeWidth="0.8"
                  />
                ))}
              </g>

              {/* Connecting Lines */}
              <g className="arcs">
                {pins.map((p, i) => (
                  <motion.path
                    key={`arc-${i}`}
                    d={getArc(p.coords)}
                    fill="none"
                    stroke="#ef4444" // red connecting lines
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.9 }}
                    viewport={{ once: true, amount: 0.8 }} // only start when fully in view
                    transition={{ duration: 1.5, delay: i * 0.15, ease: "easeOut" }}
                  />
                ))}
              </g>

              {/* The Pins */}
              <g className="pins">
                {/* Central India Pin */}
                <circle cx={projection(INDIA_COORD)[0]} cy={projection(INDIA_COORD)[1]} r="5" fill="var(--color-accent)" />
                <motion.circle
                   cx={projection(INDIA_COORD)[0]} cy={projection(INDIA_COORD)[1]} r="5" fill="none" stroke="var(--color-accent)" strokeWidth="2"
                   initial={{ scale: 1, opacity: 1 }} animate={{ scale: 3.5, opacity: 0 }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                {pins.map((p, i) => {
                  const [cx, cy] = projection(p.coords);
                  return (
                    <g key={`pin-${i}`} className="group cursor-pointer">
                      <circle cx={cx} cy={cy} r="4" fill="#ef4444" />
                      <text x={cx} y={cy - 12} fontSize="13" fill="var(--color-text-secondary)" textAnchor="middle" className="font-sans font-medium tracking-wide">
                        {p.city}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto border-t border-[var(--color-rule)] pt-6 md:pt-7">
            <div className="text-center">
              <h3 className="text-3xl font-serif text-[var(--color-accent)] mb-1.5">20K+</h3>
              <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest font-medium">Clients Supported</p>
            </div>
            <div className="text-center border-t md:border-t-0 md:border-l border-[var(--color-rule)] pt-6 md:pt-0">
              <h3 className="text-3xl font-serif text-[var(--color-accent)] mb-1.5">7+ Nations</h3>
              <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest font-medium">Global Hubs</p>
            </div>
            <div className="text-center border-t md:border-t-0 md:border-l border-[var(--color-rule)] pt-6 md:pt-0">
              <h3 className="text-3xl font-serif text-[var(--color-accent)] mb-1.5">140+</h3>
              <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest font-medium">Verified Partners</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}