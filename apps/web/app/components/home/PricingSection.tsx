"use client";

import React from "react";
import { LuCheck, LuZap } from "react-icons/lu";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      credits: "10,000",
      price: "1",
      description: "Perfect for getting started",
      features: [
        "10,000 credits",
        "Basic transaction tracking",
        "Budget management",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      credits: "20,000",
      price: "2",
      description: "Best value for regular users",
      features: [
        "20,000 credits",
        "Advanced analytics",
        "Priority support",
        "All Starter features",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      credits: "30,000",
      price: "3",
      description: "For power users and teams",
      features: [
        "30,000 credits",
        "Premium features",
        "Dedicated support",
        "All Professional features",
      ],
      popular: false,
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 px-4 border-t border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BDFE00]/10 border border-[#BDFE00]/20 text-xs font-mono tracking-wide text-[#BDFE00] mb-4">
            <LuZap className="w-3 h-3" />
            CREDIT PACKS
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Choose the credit pack that fits your needs. No hidden fees, no subscriptions.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl backdrop-blur-xl p-6 transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-br from-[#BDFE00]/10 via-slate-900/60 to-slate-900/40 border-2 border-[#BDFE00]/40 shadow-[0_0_30px_rgba(189,254,0,0.15)]"
                  : "bg-slate-900/40 border border-white/10 hover:border-white/20"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full bg-[#BDFE00] text-black text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-400 mb-4">{plan.description}</p>
                
                {/* Price */}
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-black text-white">$</span>
                  <span className={`text-5xl font-black ${
                    plan.popular ? "text-[#BDFE00]" : "text-white"
                  }`}>
                    {plan.price}
                  </span>
                </div>
                
                {/* Credits */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <LuZap className={`w-4 h-4 ${
                    plan.popular ? "text-[#BDFE00]" : "text-slate-400"
                  }`} />
                  <span className="text-sm font-bold text-white">
                    {plan.credits} Credits
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular
                        ? "bg-[#BDFE00]/20 text-[#BDFE00]"
                        : "bg-white/10 text-slate-400"
                    }`}>
                      <LuCheck className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#BDFE00] text-black hover:bg-[#aef000] hover:shadow-[0_0_20px_rgba(189,254,0,0.3)]"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500 font-mono">
            One-time payment • No subscription • Instant credit delivery
          </p>
        </div>
      </div>
    </section>
  );
}
