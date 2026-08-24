"use client";

import React from "react";

export function FAQSection() {
  return (
    <section id="faq" className="w-full py-16 md:py-24 px-4 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm mt-2">Got questions? We've got answers</p>
        </div>

        <div className="space-y-4">
          {/* FAQ Item 1 */}
          <details className="group rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
              <h3 className="text-base font-semibold text-white pr-4">
                Is Kashly free to use?
              </h3>
              <span className="text-[#BDFE00] group-open:rotate-180 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
              Yes! Kashly offers a free tier with core features including transaction tracking, basic budgeting, and financial overview. Premium features are available for power users who need advanced analytics and unlimited budgets.
            </div>
          </details>

          {/* FAQ Item 2 */}
          <details className="group rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
              <h3 className="text-base font-semibold text-white pr-4">
                How secure is my financial data?
              </h3>
              <span className="text-[#BDFE00] group-open:rotate-180 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
              We take security seriously. All data is encrypted in transit and at rest. We use industry-standard authentication, secure session handling, and never share your financial information with third parties.
            </div>
          </details>

          {/* FAQ Item 3 */}
          <details className="group rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
              <h3 className="text-base font-semibold text-white pr-4">
                Can I set multiple budgets?
              </h3>
              <span className="text-[#BDFE00] group-open:rotate-180 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
              Absolutely! You can create multiple budgets for different categories like groceries, entertainment, utilities, and more. Track spending against each budget separately to maintain better financial control.
            </div>
          </details>

          {/* FAQ Item 4 */}
          <details className="group rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
              <h3 className="text-base font-semibold text-white pr-4">
                Does it work on mobile devices?
              </h3>
              <span className="text-[#BDFE00] group-open:rotate-180 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
              Yes! Kashly is fully responsive and works seamlessly on smartphones, tablets, and desktops. Track your expenses on the go and access your financial data from any device.
            </div>
          </details>

          {/* FAQ Item 5 */}
          <details className="group rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
              <h3 className="text-base font-semibold text-white pr-4">
                How do I get started?
              </h3>
              <span className="text-[#BDFE00] group-open:rotate-180 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">
              Getting started is easy! Click "Get Started For Free", create your account in seconds, and start tracking your first transaction. No credit card required for the free tier.
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
