import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { motion, useScroll, useTransform } from "framer-motion";
import TrustMap from "./components/TrustMap";
import Journey from "./components/Journey";
import BeforeAfter from "./components/BeforeAfter";
import Services from "./components/Services";
import Ahmedabad from "./components/Ahmedabad";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { MeetingModal } from "./components/JourneyModals";
import whiteLogo from "../images/SAI FAKIRA LOGO WHITE .png";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const navigationLinks = {
    Home: "../index.html",
    "Refer & Earn": "../refer.html",
    NRI: "./",
    Profile: "../SAI_FAKIRA-PARKERS_Final.pdf",
    "About Us": "../aboutUs.html",
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-[35px] py-[5px] bg-[var(--color-accent)] z-50 shadow-md">
        <div className="flex items-center">
          <img
            src={whiteLogo}
            alt="Ess Eff Real Estate Logo"
            className="w-[140px] h-auto object-contain"
          />
        </div>
        <div className="hidden md:flex gap-[40px]">
          {Object.entries(navigationLinks).map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[15px] font-medium text-white/90 hover:text-white transition-colors tracking-wide"
            >
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center md:hidden">
          <button
            className="text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[90px] left-0 w-full bg-[var(--color-accent)] border-t border-white/10 z-40 md:hidden flex flex-col p-6 gap-6 shadow-xl"
          >
            {Object.entries(navigationLinks).map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-lg font-medium text-white/90 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="home"
        className="relative min-h-screen pt-28 pb-12 px-6 md:px-12 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 items-center snap-center overflow-hidden lg:overflow-visible"
      >
        {/* Mobile/Tablet Background Image Overlay */}
        <div className="absolute inset-0 z-0 flex items-center justify-center lg:hidden opacity-10 md:opacity-15 pointer-events-none pt-20">
          <div
            className="relative w-[150%] md:w-[100%] aspect-square flex items-center justify-center scale-125 md:scale-110"
            style={{
              maskImage:
                "radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
              WebkitMaskImage:
                "radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)",
            }}
          >
            <svg width="0" height="0" className="absolute">
              <filter id="sketch-filter-mobile">
                <feColorMatrix
                  type="matrix"
                  values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
                />
                <feComponentTransfer>
                  <feFuncR type="discrete" tableValues="1 0" />
                  <feFuncG type="discrete" tableValues="1 0" />
                  <feFuncB type="discrete" tableValues="1 0" />
                </feComponentTransfer>
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite
                  operator="arithmetic"
                  k2="1"
                  k3="-1"
                  in="SourceGraphic"
                  in2="blur"
                  result="edges"
                />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 4 0"
                />
              </filter>
            </svg>
            <div className="absolute inset-0 bg-[#FFFAF0] z-0"></div>
            <img
              src="/nri/hero-img.png"
              alt="Premium Property"
              className="w-full h-full object-cover z-10"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold tracking-[-0.04em] leading-[1.05] text-[var(--color-accent)] mb-5">
            End-to-End <br />
            <span className="text-[var(--color-accent)] text-[1.06em]">
              Financial
            </span>
            <span className="opacity-75 text-3xl align-middle mx-2">&</span>
            <span className="text-[var(--color-accent)] text-[1.06em]">
              Property Solutions
            </span>
            <br /> for NRIs
          </h1>
          <p className="text-[color:var(--color-text-secondary)] max-w-[460px] leading-relaxed mb-6 text-[15px]">
            Now its easier to get right property in India with complete loan and
            documentation support at your convenience.
          </p>
          <div className="mb-7">
            <span className="block text-[13px] uppercase tracking-wider font-semibold text-[var(--color-accent)] mb-3">
              What Sai Fakira Offers:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {["Loans", "Property", "Due Diligence"].map((t) => (
                <span
                  key={t}
                  className="px-4 py-1.5 text-[13px] font-medium rounded-full bg-[color:var(--color-bg-secondary)] border border-[color:var(--color-rule)] text-[color:var(--color-text-primary)] shadow-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <a
              href="https://wa.me/919033784030"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center bg-[color:var(--color-accent)] text-white px-7 py-3 text-sm font-semibold rounded-full inline-block"
            >
              Chat on WhatsApp
            </a>
            <button
              onClick={() => setIsMeetingModalOpen(true)}
              className="w-full sm:w-auto text-center border border-[color:var(--color-accent)] text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent)] hover:text-white transition-colors px-7 py-3 text-sm font-semibold rounded-full inline-block cursor-pointer"
            >
              Schedule a Meeting
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full flex flex-col items-center justify-center pt-8 md:pt-14 lg:pt-0 z-10"
        >
          {/* Floral White & Burgundy Sketch Image Overlay - Desktop Only */}
          <div
            className="hidden lg:flex relative w-full aspect-[4/3] items-center justify-center pointer-events-none scale-125"
            style={{
              maskImage:
                "radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)",
              WebkitMaskImage:
                "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)",
            }}
          >
            {/* Custom SVG filter for edge detection/sketch effect */}
            <svg width="0" height="0" className="absolute">
              <filter id="sketch-filter">
                <feColorMatrix
                  type="matrix"
                  values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
                />
                <feComponentTransfer>
                  <feFuncR type="discrete" tableValues="1 0" />
                  <feFuncG type="discrete" tableValues="1 0" />
                  <feFuncB type="discrete" tableValues="1 0" />
                </feComponentTransfer>
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite
                  operator="arithmetic"
                  k2="1"
                  k3="-1"
                  in="SourceGraphic"
                  in2="blur"
                  result="edges"
                />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 4 0"
                />
              </filter>
            </svg>

            <div className="absolute inset-0 bg-[#FFFAF0] z-0"></div>

            <img
              src={`${import.meta.env.BASE_URL}hero-img.png`}
              alt="Premium Property"
              className="w-full h-full object-cover z-10"
            />
          </div>

          {/* Floating Stats Block (No corners, no background box) */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 relative z-40 bg-[var(--color-bg-primary)]/50 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-4 lg:p-0 rounded-2xl lg:rounded-none">
            {[
              { n: "100+", l: "Branches" },
              { n: "100+", l: "Developers" },
              { n: "140+", l: "Finance Partners" },
              { n: "20K+", l: "Clients" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-serif text-3xl font-medium text-[color:var(--color-accent)] mb-1.5">
                  {s.n}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-secondary)] font-semibold">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <TrustMap />
      <Journey />
      <BeforeAfter />
      <Services />
      <Ahmedabad />
      <Testimonials />
      <FAQ />
      <Footer />

      <MeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
      />
    </div>
  );
}

export default App;
