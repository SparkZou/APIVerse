import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Key, 
  FileText, 
  Mail, 
  MessageSquare, 
  Bot, 
  CreditCard, 
  LogOut, 
  Bell, 
  Settings,
  ChevronRight,
  Zap,
  Shield,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  Code,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const StatCard = ({ icon: Icon, label, value, subtext, color }: any) => (
  <div className="glass-card p-6 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
      <Icon className="h-16 w-16" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-slate-800 ${color.replace('text-', 'text-')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        {subtext && <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-800 text-slate-400">{subtext}</span>}
      </div>
      <h3 className="text-slate-400 text-sm font-medium">{label}</h3>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
  </div>
);

// --- Sub-Components for Dashboard Sections ---

const OverviewSection = ({ usageData, maxUsage }: any) => (
  <div className="space-y-8">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard icon={Zap} label="Total API Calls (Month)" value="3,817" subtext="+12%" color="text-blue-500" />
      <StatCard icon={Shield} label="Current Plan" value="Pro Enterprise" subtext="Active" color="text-green-500" />
      <StatCard icon={Bell} label="Notifications" value="2 New" subtext="Maintenance" color="text-orange-500" />
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Usage Trends */}
      <div className="lg:col-span-2 glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Usage Trends</h3>
        <div className="h-64 flex items-end space-x-2 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="w-full h-px bg-slate-800/50 border-t border-dashed border-slate-800"></div>
            ))}
          </div>
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M0,${256 - (usageData[0]/maxUsage)*200} ${usageData.map((d: number, i: number) => `L${(i/(usageData.length-1))*100}%,${256 - (d/maxUsage)*200}`).join(' ')}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`M0,${256 - (usageData[0]/maxUsage)*200} ${usageData.map((d: number, i: number) => `L${(i/(usageData.length-1))*100}%,${256 - (d/maxUsage)*200}`).join(' ')} V256 H0 Z`}
              fill="url(#gradient)"
            />
          </svg>
          <div className="absolute bottom-0 w-full flex justify-between text-xs text-slate-500 translate-y-6">
            <span>Sep 01</span><span>Sep 02</span><span>Sep 03</span><span>Sep 04</span><span>Sep 05</span><span>Sep 06</span><span>Sep 07</span>
          </div>
        </div>
      </div>

      {/* Service Distribution */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Service Distribution</h3>
        <div className="h-64 flex items-end justify-around pb-6">
          {[
            { label: 'Email', value: 45, color: 'bg-blue-500' },
            { label: 'SMS', value: 30, color: 'bg-purple-500' },
            { label: 'AI Bot', value: 75, color: 'bg-indigo-500' }
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center group">
              <div className="relative w-12 bg-slate-800 rounded-t-lg overflow-hidden h-48 flex items-end">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`w-full ${item.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                ></motion.div>
              </div>
              <span className="mt-3 text-sm text-slate-400 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ApiKeysSection = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-white">API Keys</h2>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors">
        <Plus className="h-4 w-4 mr-2" /> Create New Key
      </button>
    </div>
    <div className="glass-card overflow-hidden">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="bg-slate-900/50 text-slate-200 uppercase font-semibold">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Key Token</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4">Last Used</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {[
            { name: "Production Key", key: "sk_live_...8s9d", created: "Oct 24, 2025", used: "Just now" },
            { name: "Test Environment", key: "sk_test_...j2k1", created: "Oct 20, 2025", used: "2 days ago" },
          ].map((key, i) => (
            <tr key={i} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 font-medium text-white">{key.name}</td>
              <td className="px-6 py-4 font-mono">{key.key}</td>
              <td className="px-6 py-4">{key.created}</td>
              <td className="px-6 py-4">{key.used}</td>
              <td className="px-6 py-4 text-right space-x-2">
                <button className="p-2 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white"><Copy className="h-4 w-4" /></button>
                <button className="p-2 hover:bg-red-900/20 rounded-md text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DocumentationSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">Documentation</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-6 hover:border-blue-500/50 transition-colors cursor-pointer">
        <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
          <Zap className="h-6 w-6 text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Quick Start Guide</h3>
        <p className="text-slate-400 text-sm mb-4">Get up and running with APIverse in less than 5 minutes.</p>
        <span className="text-blue-400 text-sm flex items-center">Read Guide <ChevronRight className="h-4 w-4 ml-1" /></span>
      </div>
      <div className="glass-card p-6 hover:border-purple-500/50 transition-colors cursor-pointer">
        <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
          <Code className="h-6 w-6 text-purple-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">API Reference</h3>
        <p className="text-slate-400 text-sm mb-4">Complete endpoint documentation for Email, SMS, and Chatbot.</p>
        <span className="text-purple-400 text-sm flex items-center">View Reference <ChevronRight className="h-4 w-4 ml-1" /></span>
      </div>
    </div>
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold text-white mb-4">SDKs & Libraries</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Node.js', 'Python', 'Go', 'PHP'].map(lang => (
          <div key={lang} className="border border-slate-700 rounded-lg p-4 flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer">
            <span className="text-slate-300 font-medium">{lang}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ServiceSection = ({ title, icon: Icon, color }: any) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <div className={`p-3 rounded-xl bg-slate-800 ${color}`}>
        <Icon className="h-8 w-8" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-slate-400 text-sm">Manage your {title.toLowerCase()} integration</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-card p-6">
        <h3 className="text-slate-400 text-sm font-medium mb-2">Success Rate</h3>
        <div className="flex items-end space-x-2">
          <span className="text-3xl font-bold text-white">99.9%</span>
          <span className="text-green-400 text-sm mb-1 flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Optimal</span>
        </div>
      </div>
      <div className="glass-card p-6">
        <h3 className="text-slate-400 text-sm font-medium mb-2">Requests (24h)</h3>
        <span className="text-3xl font-bold text-white">1,240</span>
      </div>
      <div className="glass-card p-6">
        <h3 className="text-slate-400 text-sm font-medium mb-2">Avg. Latency</h3>
        <span className="text-3xl font-bold text-white">45ms</span>
      </div>
    </div>

    <div className="glass-card p-6">
      <h3 className="text-lg font-bold text-white mb-4">Recent Logs</h3>
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-slate-300 font-mono text-sm">req_8f9s8d7f9s8d</span>
            </div>
            <span className="text-slate-500 text-sm">200 OK</span>
            <span className="text-slate-500 text-sm">124ms</span>
            <span className="text-slate-500 text-sm">Just now</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BillingSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">Billing & Plans</h2>
    <div className="glass-card p-8 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">Enterprise Plan</h3>
          <p className="text-slate-400 mt-1">Billed monthly on the 24th</p>
        </div>
        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">Active</span>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-800 pt-6">
        <div>
          <span className="text-slate-500 text-sm block">Monthly Total</span>
          <span className="text-2xl font-bold text-white">$99.00</span>
        </div>
        <div>
          <span className="text-slate-500 text-sm block">Next Invoice</span>
          <span className="text-white font-medium">Nov 24, 2025</span>
        </div>
        <div>
          <span className="text-slate-500 text-sm block">Payment Method</span>
          <span className="text-white font-medium flex items-center"><CreditCard className="h-4 w-4 mr-2" /> •••• 4242</span>
        </div>
      </div>
    </div>
    
    <h3 className="text-lg font-bold text-white mt-8">Invoice History</h3>
    <div className="glass-card overflow-hidden">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="bg-slate-900/50">
          <tr>
            <th className="px-6 py-3">Invoice ID</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Download</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          <tr>
            <td className="px-6 py-4 font-mono">INV-2025-001</td>
            <td className="px-6 py-4">Oct 24, 2025</td>
            <td className="px-6 py-4">$99.00</td>
            <td className="px-6 py-4 text-green-400">Paid</td>
            <td className="px-6 py-4 text-right"><ExternalLink className="h-4 w-4 ml-auto cursor-pointer hover:text-white" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const SettingsSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">Account Settings</h2>
    <div className="glass-card p-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
          <input type="text" defaultValue="Alex Developer" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
          <input type="email" defaultValue="alex@company.com" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
          <input type="text" defaultValue="Acme Inc." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div className="pt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/register');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Mock Data for Charts
  const usageData = [350, 420, 300, 550, 680, 720, 650];
  const maxUsage = Math.max(...usageData);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <OverviewSection usageData={usageData} maxUsage={maxUsage} />;
      case 'keys': return <ApiKeysSection />;
      case 'docs': return <DocumentationSection />;
      case 'email': return <ServiceSection title="Email API" icon={Mail} color="text-blue-400" />;
      case 'sms': return <ServiceSection title="SMS API" icon={MessageSquare} color="text-purple-400" />;
      case 'chatbot': return <ServiceSection title="Chatbot AI" icon={Bot} color="text-indigo-400" />;
      case 'billing': return <BillingSection />;
      case 'settings': return <SettingsSection />;
      default: return <OverviewSection usageData={usageData} maxUsage={maxUsage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 fixed h-full z-20 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            APIverse
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
          <div>
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Overview</p>
            <div className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              <SidebarItem icon={Key} label="API Keys" active={activeTab === 'keys'} onClick={() => setActiveTab('keys')} />
              <SidebarItem icon={FileText} label="Documentation" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
            </div>
          </div>

          <div>
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Services</p>
            <div className="space-y-1">
              <SidebarItem icon={Mail} label="Email API" active={activeTab === 'email'} onClick={() => setActiveTab('email')} />
              <SidebarItem icon={MessageSquare} label="SMS API" active={activeTab === 'sms'} onClick={() => setActiveTab('sms')} />
              <SidebarItem icon={Bot} label="Chatbot AI" active={activeTab === 'chatbot'} onClick={() => setActiveTab('chatbot')} />
            </div>
          </div>

          <div>
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Account</p>
            <div className="space-y-1">
              <SidebarItem icon={CreditCard} label="Billing & Plans" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
              <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-2 w-full text-slate-400 hover:text-white transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen bg-slate-950">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center text-sm text-slate-400">
            <span>Overview</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white font-medium capitalize">{activeTab}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-medium text-green-400">Systems Operational</span>
            </div>
            <button className="p-2 text-slate-400 hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-slate-800"></div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Welcome back, Alex Developer</h1>
              <p className="text-slate-400 mt-1">Here is your platform overview for today.</p>
            </div>
          )}
          
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
