import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Mail, MessageSquare, Bot, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50); // Typing speed

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      {displayedText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-blue-500 ml-1`}>_</span>
    </span>
  );
};

const Home = () => {
  return (
    <div id="home" className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.900),theme(colors.slate.900))] opacity-20" />
        <div className="mx-auto max-w-7xl text-center">
          <div className="h-32 sm:h-40 flex items-center justify-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
              <TypewriterText text="Connect the World with APIverse" delay={500} />
            </h1>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-300"
          >
            The ultimate enterprise solution for Email, SMS, and Chatbot integration. 
            Scale your communication infrastructure with a single powerful API.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Link to="/register" className="group inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900">
              Start Building <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#pricing" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-800 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900">
              View Pricing
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Mail, title: "Email API", desc: "High deliverability transactional emails with real-time analytics." },
              { icon: MessageSquare, title: "SMS Gateway", desc: "Global SMS coverage with instant delivery and 2-way messaging." },
              { icon: Bot, title: "AI Chatbots", desc: "Intelligent conversational agents powered by advanced LLMs." }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="glass-card p-8"
              >
                <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-slate-400">Choose the plan that fits your scale.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Standard Plan */}
            <div className="glass-card p-8 border-slate-700 relative">
              <h3 className="text-xl font-semibold text-white">Standard</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-5xl font-extrabold tracking-tight">$29</span>
                <span className="ml-1 text-xl font-semibold text-slate-400">/mo</span>
              </div>
              <ul className="mt-6 space-y-4">
                {['10,000 Emails/mo', '1,000 SMS/mo', 'Basic Chatbot', 'Email Support'].map((item) => (
                  <li key={item} className="flex">
                    <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                    <span className="ml-3 text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register?plan=standard" className="mt-8 block w-full bg-slate-700 border border-slate-600 rounded-lg py-3 text-center font-semibold text-white hover:bg-slate-600 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="glass-card p-8 border-blue-500 relative transform scale-105 z-10">
              <div className="absolute top-0 right-0 -mt-4 mr-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Popular
              </div>
              <h3 className="text-xl font-semibold text-white">Enterprise</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-5xl font-extrabold tracking-tight">$99</span>
                <span className="ml-1 text-xl font-semibold text-slate-400">/mo</span>
              </div>
              <ul className="mt-6 space-y-4">
                {['Unlimited Emails', '10,000 SMS/mo', 'Advanced AI Chatbot', '24/7 Priority Support', 'Dedicated IP'].map((item) => (
                  <li key={item} className="flex">
                    <Check className="flex-shrink-0 h-6 w-6 text-blue-400" />
                    <span className="ml-3 text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register?plan=enterprise" className="mt-8 block w-full bg-blue-600 rounded-lg py-3 text-center font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25">
                Get Enterprise
              </Link>
            </div>

            {/* Custom Plan */}
            <div className="glass-card p-8 border-slate-700">
              <h3 className="text-xl font-semibold text-white">Custom</h3>
              <div className="mt-4 flex items-baseline text-white">
                <span className="text-5xl font-extrabold tracking-tight">Contact</span>
              </div>
              <ul className="mt-6 space-y-4">
                {['Custom Volume', 'Custom SLA', 'On-premise Deployment', 'Dedicated Account Manager'].map((item) => (
                  <li key={item} className="flex">
                    <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                    <span className="ml-3 text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 block w-full bg-slate-700 border border-slate-600 rounded-lg py-3 text-center font-semibold text-white hover:bg-slate-600 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
