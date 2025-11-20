import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const Pricing = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planName: string, price: number) => {
    setLoadingPlan(planName);
    try {
      const response = await fetch('http://localhost:8000/api/v1/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            amount: price * 100, // Convert to cents
            currency: 'usd',
            plan_name: planName,
            interval: 'month'
        })
      });
      const data = await response.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert('Failed to create subscription session');
      }
    } catch (error) {
      console.error('Subscription failed', error);
      alert('Subscription failed to initialize');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="glass-card p-8 relative flex flex-col hover:border-blue-500/50 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">Basic Plan</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Perfect for small businesses starting their online journey with AI and web support.</p>
            <div className="mb-6">
              <span className="text-slate-500 line-through text-lg mr-2">$59</span>
              <span className="text-4xl font-bold text-white">$29</span>
              <span className="text-slate-500"> / month</span>
            </div>
            
            <button 
              onClick={() => handleSubscribe('Basic Plan', 29)}
              disabled={loadingPlan === 'Basic Plan'}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium transition-colors mb-8 disabled:opacity-50"
            >
              {loadingPlan === 'Basic Plan' ? 'Processing...' : 'Subscribe Now'}
            </button>
            
            <ul className="space-y-4 flex-1">
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Mobile-Optimized Website Design</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Domain Registration, Business Email, and Web Hosting</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Branded Basic AI Chatbot for 24/7 Customer Support</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Backend Dashboard to Manage Knowledge Base</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Email Support</span>
              </li>
              <li className="flex items-start text-sm text-slate-600">
                <X className="h-5 w-5 text-slate-600 mr-3 flex-shrink-0" />
                <span>Advanced Data Analytics</span>
              </li>
              <li className="flex items-start text-sm text-slate-600">
                <X className="h-5 w-5 text-slate-600 mr-3 flex-shrink-0" />
                <span>Personalized AI Recommendations</span>
              </li>
              <li className="flex items-start text-sm text-slate-600">
                <X className="h-5 w-5 text-slate-600 mr-3 flex-shrink-0" />
                <span>Priority Customer Service</span>
              </li>
            </ul>
          </div>
          
          {/* Business Plan */}
          <div className="glass-card p-8 relative flex flex-col border-blue-500 shadow-lg shadow-blue-500/10 transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Business Plan</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Ideal for growing businesses aiming to boost engagement through smart AI.</p>
            <div className="mb-6">
              <span className="text-slate-500 line-through text-lg mr-2">$119</span>
              <span className="text-4xl font-bold text-white">$59</span>
              <span className="text-slate-500"> / month</span>
            </div>
            
            <button 
              onClick={() => handleSubscribe('Business Plan', 59)}
              disabled={loadingPlan === 'Business Plan'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors mb-8 disabled:opacity-50"
            >
              {loadingPlan === 'Business Plan' ? 'Processing...' : 'Subscribe Now'}
            </button>
            
            <ul className="space-y-4 flex-1">
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>All features from Basic Plan</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Advanced AI Chatbot – More accurate and responsive</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Data Insights Dashboard – Track customer behavior</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Email & Chat Support – Faster resolution times</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Website Speed & SEO Optimization</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Priority Customer Support</span>
              </li>
              <li className="flex items-start text-sm text-slate-600">
                <X className="h-5 w-5 text-slate-600 mr-3 flex-shrink-0" />
                <span>24/7 AI Assistant Support</span>
              </li>
              <li className="flex items-start text-sm text-slate-600">
                <X className="h-5 w-5 text-slate-600 mr-3 flex-shrink-0" />
                <span>Unlimited Customer Interactions</span>
              </li>
            </ul>
          </div>
          
          {/* Enterprise Plan */}
          <div className="glass-card p-8 relative flex flex-col hover:border-purple-500/50 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">Enterprise Plan</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Comprehensive AI solutions for enterprises needing full-scale automation.</p>
            <div className="mb-6">
              <span className="text-slate-500 line-through text-lg mr-2">$159</span>
              <span className="text-4xl font-bold text-white">$119</span>
              <span className="text-slate-500"> / month</span>
            </div>
            
            <button 
              onClick={() => handleSubscribe('Enterprise Plan', 119)}
              disabled={loadingPlan === 'Enterprise Plan'}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium transition-colors mb-8 disabled:opacity-50"
            >
              {loadingPlan === 'Enterprise Plan' ? 'Processing...' : 'Subscribe Now'}
            </button>
            
            <ul className="space-y-4 flex-1">
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>All features from Business Plan</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>On-Premise Deployment Option</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>24/7 AI Assistant Support</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Advanced Analytics & Custom Reports</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Unlimited AI-Powered Customer Interactions</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Customizable AI Behavior & Responses</span>
              </li>
              <li className="flex items-start text-sm text-slate-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Dedicated Account Manager</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
