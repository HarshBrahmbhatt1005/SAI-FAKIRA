import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: "What defines an NRI or OCI?",
    a: "An NRI (Non-Resident Indian) is simply someone who holds an Indian passport but lives abroad for work, business, or other long-term reasons. If you hold an Overseas Citizen of India (OCI) card, you have the same primary standing as an NRI when it comes to investing in real estate."
  },
  {
    q: "How do I repay the loan from abroad?",
    a: "Repayment is simple and automated. You can set up standing instructions using ECS or NACH to deduct the monthly installments directly from your NRE (Non-Resident External) or NRO (Non-Resident Ordinary) bank account in India. Please note that cash payments aren't accepted."
  },
  {
    q: "What happens to my loan if I move back to India?",
    a: "When you return to India, your loan is seamlessly reassessed to match your new resident status. The bank will adjust your repayment schedule and update your interest rate to the standard Resident Indian Home Loan rate, which is often a bit more favorable."
  },
  {
    q: "Do I need to fly to India to close the deal?",
    a: "Not at all. You can complete the entire process from your current country by assigning a Power of Attorney (POA) to a trusted individual in India. They can sign documents and manage all the formalities on your behalf using a bank-approved format."
  },
  {
    q: "Who can act as my Power of Attorney (POA)?",
    a: "Your POA can be any trusted resident Indian who will act on your behalf by signing a Specific Power of Attorney (SPOA) deed. If you have a co-applicant who lives in India, they can easily be designated as your POA to handle everything smoothly."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-[var(--color-bg-secondary)] py-8 lg:py-9 border-t border-[var(--color-rule)]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[800px]">
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-2 block">
            Questions
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-[var(--color-accent)] mb-3">
            FAQ Highlights
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[15px]">
            Common questions NRIs ask before buying property in India.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[var(--color-rule)]">
              <button
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <span className={`text-lg font-medium transition-colors ${openIndex === i ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent)]/80 group-hover:text-[var(--color-accent)]'}`}>
                  {faq.q}
                </span>
                <span className="text-[var(--color-accent)] shrink-0 ml-4 border rounded-full p-1 border-[var(--color-rule)] bg-[var(--color-bg-primary)]">
                  {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-8 text-[var(--color-text-secondary)] leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}