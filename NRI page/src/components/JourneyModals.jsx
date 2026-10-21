import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Home, Briefcase, FileText, ArrowLeft } from 'lucide-react';

const COUNTRIES = [
  { name: 'United States', code: '+1' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United Arab Emirates', code: '+971' },
  { name: 'Canada', code: '+1' },
  { name: 'Australia', code: '+61' },
  { name: 'Singapore', code: '+65' },
  { name: 'India', code: '+91' },
  { name: 'New Zealand', code: '+64' },
  { name: 'Qatar', code: '+974' },
  { name: 'Saudi Arabia', code: '+974' },
  { name: 'Oman', code: '+968' },
  { name: 'Kuwait', code: '+965' },
  { name: 'Bahrain', code: '+973' },
  { name: 'Malaysia', code: '+65' },
  { name: 'Germany', code: '+49' },
  { name: 'France', code: '+33' },
  { name: 'South Africa', code: '+27' },
  { name: 'Kenya', code: '+27' },
];

export function MeetingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  const toggleTopic = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedTopics([]);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[var(--color-bg-primary)] rounded-xl shadow-2xl p-8 z-10"
          >
            {step > 1 && (
              <button 
                onClick={() => setStep(1)} 
                className="absolute top-6 left-6 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <button onClick={handleClose} className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"><X size={24} /></button>
            
            <h3 className="text-2xl font-bold text-[var(--color-accent)] mb-2 pt-4">Schedule a Meeting</h3>
            <p className="text-[var(--color-text-secondary)] mb-6">Read what you'd like to discuss</p>

            {step === 1 ? (
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors bg-[var(--color-bg-secondary)] hover:bg-[var(--color-rule)]">
                  <input type="checkbox" checked={selectedTopics.includes('property')} onChange={() => toggleTopic('property')} className="w-5 h-5 accent-[var(--color-accent)]" />
                  <span className="flex items-center gap-2 text-[var(--color-accent)] font-semibold text-sm">
                    <span role="img" aria-label="house">🏡</span> Buy a Property Residential / Commercial
                  </span>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors bg-[var(--color-bg-secondary)] hover:bg-[var(--color-rule)]">
                  <input type="checkbox" checked={selectedTopics.includes('investment')} onChange={() => toggleTopic('investment')} className="w-5 h-5 accent-[var(--color-accent)]" />
                  <span className="flex items-center gap-2 text-[var(--color-accent)] font-semibold text-sm">
                    <span role="img" aria-label="briefcase">💼</span> Looking For Investment in Ahmedabad & Gift City
                  </span>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors bg-[var(--color-bg-secondary)] hover:bg-[var(--color-rule)]">
                  <input type="checkbox" checked={selectedTopics.includes('loan')} onChange={() => toggleTopic('loan')} className="w-5 h-5 accent-[var(--color-accent)]" />
                  <span className="flex items-center gap-2 text-[var(--color-accent)] font-semibold text-sm">
                    <span role="img" aria-label="document">📄</span> Loan Support
                  </span>
                </label>

                <button 
                  onClick={() => setStep(2)}
                  disabled={selectedTopics.length === 0}
                  className="w-full mt-6 bg-[var(--color-accent)] text-white font-bold py-4 rounded-lg hover:bg-[#6d1133] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Schedule
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleClose(); }}>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Country</label>
                  <select 
                    value={selectedCountry.name} 
                    onChange={e => setSelectedCountry(COUNTRIES.find(c => c.name === e.target.value))}
                    className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-rule)] text-[var(--color-text-primary)] px-4 py-3 rounded-lg outline-none focus:border-[var(--color-accent)] transition-colors"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Full Name</label>
                  <input type="text" placeholder="John Doe" required className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-rule)] text-[var(--color-text-primary)] px-4 py-3 rounded-lg outline-none focus:border-[var(--color-accent)] transition-colors" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-[var(--color-rule)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                      {selectedCountry.code}
                    </span>
                    <input type="tel" placeholder="Phone Number" required className="flex-1 bg-[var(--color-bg-secondary)] border border-[var(--color-rule)] text-[var(--color-text-primary)] px-4 py-3 rounded-r-lg outline-none focus:border-[var(--color-accent)] transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Email Address</label>
                  <input type="email" placeholder="john@example.com" required className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-rule)] text-[var(--color-text-primary)] px-4 py-3 rounded-lg outline-none focus:border-[var(--color-accent)] transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Date</label>
                    <input type="date" required className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-rule)] text-[var(--color-text-primary)] px-4 py-3 rounded-lg outline-none focus:border-[var(--color-accent)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Time</label>
                    <input type="time" required className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-rule)] text-[var(--color-text-primary)] px-4 py-3 rounded-lg outline-none focus:border-[var(--color-accent)] transition-colors" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[var(--color-accent)] text-white font-bold py-4 rounded-lg mt-4 hover:bg-[#6d1133] transition-colors">
                  Confirm Booking
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function LoanDrawer({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-[var(--color-bg-primary)] border-l border-[var(--color-rule)] h-full shadow-2xl p-8 overflow-y-auto z-10"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"><X size={24} /></button>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--color-accent)] mb-2 block">Preparation</span>
            <h3 className="font-['Playfair_Display'] text-3xl font-medium text-[var(--color-accent)] mb-6">Required NRI Loan Documents</h3>
            
            <div className="space-y-6">
              {[
                { 
                  title: "Personal / KYC Documents", 
                  items: [
                    "Pan Card, Aadhar Card, Passport with visa stamp (Whole book copy Must include Blank Pages)",
                    "Residence proof (For India: Aadhar Card, Passport / Abroad: Rent Agreement, Employer Confirmation)",
                    "Photograph of applicant & co-applicants",
                    "Degree certificate",
                    "Latest CV / Biodata"
                  ] 
                },
                { 
                  title: "Employment & Income", 
                  items: [
                    "Salary certificate / Slip – last of latest 6 months",
                    "Bank statement latest 6 months (NRE/NRO account, Salary A/C, Saving A/C in India)",
                    "Work Permit & Appointment Letter of current company",
                    "Employer detail (Company profile if available, Company website)",
                    "Name and e-mail ID, Confirmation of HR Person / Department / Supervisor"
                  ] 
                },
                { 
                  title: "Financial Details & Other", 
                  items: [
                    "Credit Bureau Report from your Country",
                    "Power of attorney (in bank format & general POA)",
                    "Monthly Expense Detail with bifurcation (in your Country Currency): Apartment rent, Utilities, Groceries, Mobile bill, Miscellaneous"
                  ] 
                }
              ].map((group, i) => (
                <div key={i}>
                  <h4 className="text-[13px] font-bold tracking-widest uppercase text-[var(--color-accent)] mb-3 pb-2 border-b border-[var(--color-rule)]">{group.title}</h4>
                  <ul className="space-y-3">
                    {group.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-[14px] text-[var(--color-text-primary)] leading-relaxed">
                        <span className="text-[var(--color-accent)] mt-1 text-xs">◆</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-rule)] rounded-lg text-[13px] font-medium text-[var(--color-accent)] leading-relaxed">
              * All Documents should be duly attested.<br/>
              * Ignore the documents that are not applicable to your profile.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function FeedbackModal({ isOpen, onClose }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg z-10 text-left p-6"
          >
            <button onClick={onClose} className="absolute -top-2 right-4 text-white hover:text-gray-300 transition-colors"><X size={28} /></button>
            <h3 className="text-3xl font-bold text-white mb-1">We Value Your Feedback</h3>
            <p className="text-white text-lg font-medium tracking-wide mb-6">Your feedback helps us improve our services.</p>
            
            <form className="space-y-5" onSubmit={e => { e.preventDefault(); onClose(); }}>
              <div>
                <label className="block text-white font-bold text-[15px] mb-2">Your Name</label>
                <input type="text" required className="w-full bg-white rounded-md px-4 py-3 outline-none" />
              </div>
              <div>
                <label className="block text-white font-bold text-[15px] mb-2">Email Address</label>
                <input type="email" required className="w-full bg-white rounded-md px-4 py-3 outline-none" />
              </div>
              
              <div>
                <label className="block text-white font-bold text-[15px] mb-2">Rate Your Experience</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className="transition-colors focus:outline-none"
                    >
                      <Star size={28} strokeWidth={0} className={(hovered || rating) >= star ? "fill-white" : "fill-[#9ca3af]/50"} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-white font-bold text-[15px] mb-2">Your Feedback</label>
                <textarea rows={4} required className="w-full bg-white rounded-md px-4 py-3 outline-none resize-none"></textarea>
              </div>
              
              <button type="submit" className="w-full bg-[var(--color-accent)] text-white font-medium py-3.5 rounded-md hover:bg-[#6d1133] transition-colors shadow-lg">
                Submit Feedback
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
