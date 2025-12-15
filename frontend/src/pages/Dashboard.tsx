import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config';
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
  CheckCircle,
  Phone,
  Building2,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FileSearchPage from './FileSearchPage';
import WidgetConfigPage from './WidgetConfigPage';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active
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
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 256" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M0,${256 - (usageData[0] / maxUsage) * 200} ${usageData.map((d: number, i: number) => `L${(i / (usageData.length - 1)) * 100},${256 - (d / maxUsage) * 200}`).join(' ')}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={`M0,${256 - (usageData[0] / maxUsage) * 200} ${usageData.map((d: number, i: number) => `L${(i / (usageData.length - 1)) * 100},${256 - (d / maxUsage) * 200}`).join(' ')} V256 H0 Z`}
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

// Types for API data
interface APIKey {
  id: number;
  key: string;
  label: string;
  created_at: string;
}

interface UserInfo {
  id: number;
  email: string;
  company_name: string;
  company_url: string;
  is_active: boolean;
  api_keys: APIKey[];
}

const ApiKeysSection = ({ user, apiKeys, onRefresh, onUserUpdate }: { user: UserInfo | null; apiKeys: APIKey[]; onRefresh: () => void; onUserUpdate: () => void }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editCompanyName, setEditCompanyName] = useState(user?.company_name || '');
  const [editCompanyUrl, setEditCompanyUrl] = useState(user?.company_url || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          company_name: editCompanyName,
          company_url: editCompanyUrl 
        })
      });
      if (response.ok) {
        setIsEditingProfile(false);
        onUserUpdate();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyLabel.trim()) return;
    setIsCreating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/me/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ label: newKeyLabel })
      });
      if (response.ok) {
        const newKey = await response.json();
        setNewlyCreatedKey(newKey.key);
        setNewKeyLabel('');
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (keyId: number) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/me/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => {
    if (key.length <= 10) return key;
    return `${key.substring(0, 7)}...${key.substring(key.length - 4)}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      {user && (
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Account Information</h3>
            {!isEditingProfile ? (
              <button
                onClick={() => {
                  setEditCompanyName(user.company_name || '');
                  setEditCompanyUrl(user.company_url || '');
                  setIsEditingProfile(true);
                }}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
                >
                  {isSavingProfile ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          {isEditingProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Company Name</label>
                <input
                  type="text"
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Company Website URL</label>
                <input
                  type="url"
                  value={editCompanyUrl}
                  onChange={(e) => setEditCompanyUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Company</p>
                <p className="text-white font-medium">{user.company_name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Website</p>
                {user.company_url ? (
                  <a href={user.company_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium text-sm truncate block">
                    {user.company_url}
                  </a>
                ) : (
                  <p className="text-slate-500 font-medium">Not set</p>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">API Keys</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" /> Create New Key
        </button>
      </div>

      {/* Newly Created Key Alert */}
      {newlyCreatedKey && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-green-400 font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" /> API Key Created Successfully
              </h4>
              <p className="text-slate-400 text-sm mt-1">Make sure to copy your API key now. You won't be able to see it again!</p>
              <code className="block mt-2 bg-slate-900 px-3 py-2 rounded text-green-400 font-mono text-sm">{newlyCreatedKey}</code>
            </div>
            <button 
              onClick={() => { handleCopyKey(newlyCreatedKey); setNewlyCreatedKey(null); }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium"
            >
              Copy & Close
            </button>
          </div>
        </div>
      )}

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New API Key</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={newKeyLabel}
              onChange={(e) => setNewKeyLabel(e.target.value)}
              placeholder="Key name (e.g., Production, Test)"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleCreateKey}
              disabled={isCreating || !newKeyLabel.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => { setShowCreateModal(false); setNewKeyLabel(''); }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
            {apiKeys.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No API keys found. Create one to get started.
                </td>
              </tr>
            ) : (
              apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{key.label}</td>
                  <td className="px-6 py-4 font-mono">{maskKey(key.key)}</td>
                  <td className="px-6 py-4">{formatDate(key.created_at)}</td>
                  <td className="px-6 py-4">-</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleCopyKey(key.key)}
                      className="p-2 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white"
                      title="Copy full key"
                    >
                      {copiedKey === key.key ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button 
                      onClick={() => handleDeleteKey(key.id)}
                      className="p-2 hover:bg-red-900/20 rounded-md text-slate-400 hover:text-red-500"
                      title="Delete key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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

const ServiceSection = ({ title, icon: Icon, color, type }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form states
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const [smsTo, setSmsTo] = useState('');
  const [smsBody, setSmsBody] = useState('');

  const [voiceTo, setVoiceTo] = useState('');

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      let endpoint = '';
      let body = {};

      if (type === 'email') {
        endpoint = '/api/v1/email/send';
        body = { to_email: emailTo, subject: emailSubject, content: emailBody };
      } else if (type === 'sms') {
        endpoint = '/api/v1/sms/send';
        body = { to_number: smsTo, body: smsBody };
      } else if (type === 'voice') {
        endpoint = '/api/v1/phone/call';
        body = { to_number: voiceTo };
      } else if (type === 'chatbot') {
        endpoint = '/api/v1/chat/message';
        body = { message: smsBody }; // Reusing smsBody for chat message
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to send request' });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurlExample = () => {
    if (type === 'email') return `curl -X POST ${API_ENDPOINTS.email}/send \\
  -H "Content-Type: application/json" \\
  -d '{"to_email": "user@example.com", "subject": "Hello", "content": "World"}'`;
    if (type === 'sms') return `curl -X POST ${API_ENDPOINTS.sms}/send \\
  -H "Content-Type: application/json" \\
  -d '{"to_number": "+1234567890", "body": "Hello from APIVerse"}'`;
    if (type === 'voice') return `curl -X POST ${API_ENDPOINTS.phone}/call \\
  -H "Content-Type: application/json" \\
  -d '{"to_number": "+1234567890"}'`;
    if (type === 'chatbot') return `curl -X POST ${API_ENDPOINTS.chat}/message \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello AI"}'`;
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-3 rounded-xl bg-slate-800 ${color}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-slate-400 text-sm">Manage and test your {title.toLowerCase()} integration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Console */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4">Test Console</h3>
          <div className="space-y-4">
            {type === 'email' && (
              <>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">To Email</label>
                  <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" placeholder="user@example.com" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Subject</label>
                  <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" placeholder="Subject" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Content</label>
                  <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm h-24" placeholder="HTML Content" />
                </div>
              </>
            )}
            {(type === 'sms' || type === 'chatbot') && (
              <>
                {type === 'sms' && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">To Number</label>
                    <input type="text" value={smsTo} onChange={e => setSmsTo(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" placeholder="+1234567890" />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{type === 'chatbot' ? 'Message' : 'Body'}</label>
                  <textarea value={smsBody} onChange={e => setSmsBody(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm h-24" placeholder="Type your message..." />
                </div>
              </>
            )}
            {type === 'voice' && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">To Number</label>
                <input type="text" value={voiceTo} onChange={e => setVoiceTo(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm" placeholder="+1234567890" />
              </div>
            )}

            <button onClick={handleTest} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
              {isLoading ? 'Sending...' : 'Send Request'}
            </button>

            {result && (
              <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                <h4 className="text-xs font-bold text-slate-500 mb-2">Response</h4>
                <pre className="text-xs text-green-400 overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* API Docs & Stats */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">API Integration</h3>
            <p className="text-slate-400 text-sm mb-4">Use the following cURL command to integrate this service into your application.</p>
            <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto border border-slate-800 group relative">
              <code className="text-xs font-mono text-blue-400 whitespace-pre">
                {getCurlExample()}
              </code>
              <button className="absolute top-2 right-2 p-1 bg-slate-800 rounded text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Service Status</h3>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-white font-medium">Operational</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <span className="text-slate-500 text-xs block">Success Rate</span>
                <span className="text-white font-bold">99.9%</span>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <span className="text-slate-500 text-xs block">Avg Latency</span>
                <span className="text-white font-bold">45ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BillingSection = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.payment}/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000, currency: 'usd' }) // $10.00
      });
      const data = await response.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert('Payment session created (Mock): ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Payment failed', error);
      alert('Payment failed to initialize');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Billing & Plans</h2>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors disabled:opacity-50"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Add Funds ($10)'}
        </button>
      </div>
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
};

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

// NZ Business Credit Report Section
const NZCreditReportSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nzbn, setNzbn] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setResult(null);
    // Mock API call - in real app would call backend
    setTimeout(() => {
      setResult({
        company: {
          nzbn: nzbn || "9429041530164",
          name: "Example Ltd",
          status: "Registered",
          incorporation_date: "2018-03-15"
        },
        credit_score: {
          score: 78,
          rating: "Good",
          risk_level: "Low",
          payment_index: 92
        },
        financials: {
          revenue: 2450000,
          assets: 890000,
          liabilities: 320000,
          equity: 570000
        },
        compliance: {
          annual_return_filed: true,
          gst_registered: true,
          court_judgments: 0
        }
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-xl bg-emerald-500/20">
          <Building2 className="h-8 w-8 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">NZ Business Credit Report API</h2>
          <p className="text-slate-400 text-sm">Access comprehensive credit reports for New Zealand businesses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Console */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4">Search Company</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">NZBN or Company Name</label>
              <input
                type="text"
                value={nzbn}
                onChange={e => setNzbn(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                placeholder="e.g. 9429041530164 or Example Ltd"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Search Company'}
            </button>

            {result && (
              <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-500">Credit Report</h4>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">200 OK</span>
                </div>
                <pre className="text-xs text-emerald-400 overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* API Docs */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">API Integration</h3>
            <p className="text-slate-400 text-sm mb-4">Query NZ company credit data using the API.</p>
            <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto border border-slate-800">
              <code className="text-xs font-mono text-emerald-400 whitespace-pre">
                {`curl -X GET ${API_ENDPOINTS.nzCredit}/lookup \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"nzbn": "9429041530164"}'`}
              </code>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Available Data Points</h3>
            <ul className="space-y-2 text-sm">
              {[
                'Company credit score & risk assessment',
                'Director & shareholder information',
                'Financial statements & annual returns',
                'Court judgments & insolvency records',
                'Companies Office registration data'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Text2DB Section
const Text2DBSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleQuery = async () => {
    setIsLoading(true);
    setResult(null);
    // Mock API call
    setTimeout(() => {
      setResult({
        natural_language: query || "Show me all customers from Auckland who spent more than $5000 last month",
        generated_sql: `SELECT * FROM customers 
WHERE city = 'Auckland' 
  AND customer_id IN (
    SELECT customer_id 
    FROM orders 
    WHERE order_date >= '2025-10-01' 
      AND order_date < '2025-11-01'
    GROUP BY customer_id 
    HAVING SUM(total) > 5000
  );`,
        execution_time: "23ms",
        rows_returned: 23
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-xl bg-purple-500/20">
          <Database className="h-8 w-8 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Text2DB Local Integration</h2>
          <p className="text-slate-400 text-sm">Transform natural language queries into SQL with on-premise deployment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Console */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4">Natural Language Query</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Enter your question in plain English</label>
              <textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm h-24"
                placeholder="e.g. Show me all customers from Auckland who spent more than $5000 last month"
              />
            </div>
            <button
              onClick={handleQuery}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Generating SQL...' : 'Generate SQL'}
            </button>

            {result && (
              <div className="mt-4 space-y-3">
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 mb-2">Generated SQL</h4>
                  <pre className="text-xs text-blue-400 overflow-x-auto whitespace-pre-wrap">{result.generated_sql}</pre>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-xs block">Execution Time</span>
                    <span className="text-white font-bold">{result.execution_time}</span>
                  </div>
                  <div className="flex-1 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-xs block">Rows Returned</span>
                    <span className="text-white font-bold">{result.rows_returned}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features & Integration */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">On-Premise Features</h3>
            <ul className="space-y-2 text-sm">
              {[
                'Deploy on your own infrastructure',
                'Supports MySQL, PostgreSQL, SQL Server',
                'Natural language to SQL conversion',
                'Zero data leaves your network',
                'Custom schema learning & optimization',
                'Multi-language support (EN, ZH, MI)'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Deployment Options</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Docker', 'Kubernetes', 'VM Image', 'Bare Metal'].map(option => (
                <div key={option} className="border border-slate-700 rounded-lg p-3 flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer">
                  <span className="text-slate-300 text-sm font-medium">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/register');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setApiKeys(userData.api_keys || []);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/register');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/me/api-keys`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const keys = await response.json();
        setApiKeys(keys);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/register');
    } else {
      fetchUserData();
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
      case 'keys': return <ApiKeysSection user={user} apiKeys={apiKeys} onRefresh={fetchApiKeys} onUserUpdate={fetchUserData} />;
      case 'docs': return <DocumentationSection />;
      case 'email': return <ServiceSection title="Email API" icon={Mail} color="text-blue-400" type="email" />;
      case 'sms': return <ServiceSection title="SMS API" icon={MessageSquare} color="text-purple-400" type="sms" />;
      case 'voice': return <ServiceSection title="Voice API" icon={Phone} color="text-pink-400" type="voice" />;
      case 'chatbot': return <ServiceSection title="Chatbot AI" icon={Bot} color="text-indigo-400" type="chatbot" />;
      case 'nzcredit': return <NZCreditReportSection />;
      case 'text2db': return <Text2DBSection />;
      case 'billing': return <BillingSection />;
      case 'settings': return <SettingsSection />;
      case 'filesearch': return <FileSearchPage />;
      case 'widget': return <WidgetConfigPage />;
      default: return <OverviewSection usageData={usageData} maxUsage={maxUsage} />;
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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

          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Services</p>
          <div className="space-y-1">
            <SidebarItem icon={Database} label="Knowledge Base" active={activeTab === 'filesearch'} onClick={() => setActiveTab('filesearch')} />
            <SidebarItem icon={Code} label="Widget Integration" active={activeTab === 'widget'} onClick={() => setActiveTab('widget')} />
            <SidebarItem icon={Mail} label="Email API" active={activeTab === 'email'} onClick={() => setActiveTab('email')} />
            <SidebarItem icon={MessageSquare} label="SMS API" active={activeTab === 'sms'} onClick={() => setActiveTab('sms')} />
            <SidebarItem icon={Phone} label="Voice API" active={activeTab === 'voice'} onClick={() => setActiveTab('voice')} />
            <SidebarItem icon={Bot} label="Chatbot AI" active={activeTab === 'chatbot'} onClick={() => setActiveTab('chatbot')} />
          </div>

          <div>
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Data Services</p>
            <div className="space-y-1">
              <SidebarItem icon={Building2} label="NZ Credit Report" active={activeTab === 'nzcredit'} onClick={() => setActiveTab('nzcredit')} />
              <SidebarItem icon={Database} label="Text2DB" active={activeTab === 'text2db'} onClick={() => setActiveTab('text2db')} />
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
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-slate-800 flex items-center justify-center text-white font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.company_name || user?.email?.split('@')[0] || 'User'}</h1>
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
