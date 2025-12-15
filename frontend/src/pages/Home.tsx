import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Mail, MessageSquare, Bot, ArrowRight, Shield, Database } from 'lucide-react';
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Core API Services</h2>
            <p className="mt-4 text-lg text-slate-400">Powerful communication tools at your fingertips</p>
          </div>
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

      {/* New Zealand Business Credit Report API Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <span className="text-emerald-400 text-sm font-medium">🇳🇿 New Zealand Data</span>
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
                NZ Business Credit Report API
              </h2>
              <p className="text-lg text-slate-300 mb-6">
                Access comprehensive credit reports for New Zealand businesses. Our API provides real-time access to company credit scores, financial health indicators, and compliance data directly from official NZ registries.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Company credit score & risk assessment',
                  'Director & shareholder information',
                  'Financial statements & annual returns',
                  'Court judgments & insolvency records',
                  'Companies Office registration data',
                  'Real-time updates & historical trends'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Shield className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4">
                <Link to="/register" className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500">
                  Try It Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <button className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-700">
                  View API Docs
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-500">API Response Example</span>
                <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">200 OK</span>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
{`{
  "company": {
    "nzbn": "9429041530164",
    "name": "Example Ltd",
    "status": "Registered",
    "incorporation_date": "2018-03-15"
  },
  "credit_score": {
    "score": 78,
    "rating": "Good",
    "risk_level": "Low",
    "payment_index": 92
  },
  "financials": {
    "revenue": 2450000,
    "assets": 890000,
    "liabilities": 320000,
    "equity": 570000
  },
  "compliance": {
    "annual_return_filed": true,
    "gst_registered": true,
    "court_judgments": 0
  }
}`}
              </pre>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Text2DB Local Integration Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 glass-card p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-500">Text2DB Query Example</span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">Natural Language</span>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">💬 Natural Language Input:</p>
                  <p className="text-white font-medium">"Show me all customers from Auckland who spent more than $5000 last month"</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-8 w-px bg-gradient-to-b from-purple-500 to-blue-500"></div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">🔄 Generated SQL:</p>
                  <pre className="text-xs font-mono text-blue-400">
{`SELECT * FROM customers 
WHERE city = 'Auckland' 
  AND customer_id IN (
    SELECT customer_id 
    FROM orders 
    WHERE order_date >= '2025-10-01' 
      AND order_date < '2025-11-01'
    GROUP BY customer_id 
    HAVING SUM(total) > 5000
  );`}
                  </pre>
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-8 w-px bg-gradient-to-b from-blue-500 to-green-500"></div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">✅ Query Result:</p>
                  <p className="text-green-400 text-sm">Found 23 customers matching criteria</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <span className="text-purple-400 text-sm font-medium">🔐 On-Premise Solution</span>
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
                Text2DB Local Integration
              </h2>
              <p className="text-lg text-slate-300 mb-6">
                Transform natural language queries into SQL with our locally deployed Text2DB solution. Keep your data secure on-premise while leveraging the power of AI to query your databases using plain English.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Deploy on your own infrastructure',
                  'Supports MySQL, PostgreSQL, SQL Server',
                  'Natural language to SQL conversion',
                  'Zero data leaves your network',
                  'Custom schema learning & optimization',
                  'Multi-language support (EN, ZH, MI)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Database className="flex-shrink-0 h-5 w-5 text-purple-500 mt-0.5 mr-3" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4">
                <Link to="/register" className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-500">
                  Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <button className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-700">
                  Learn More
                </button>
              </div>
            </motion.div>
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
