import { useState, useEffect } from 'react';
import { Copy, Check, Code, Settings, Database, ExternalLink, RefreshCw } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '../config';

interface APIKey {
    id: number;
    key: string;
    label: string;
}

interface KnowledgeBase {
    id: number;
    name: string;
    description: string;
}

const WidgetConfigPage: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [selectedApiKey, setSelectedApiKey] = useState('');
    const [selectedKbId, setSelectedKbId] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            // Fetch API Keys
            const keysResponse = await fetch(`${API_BASE_URL}/users/me/api-keys`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (keysResponse.ok) {
                const keys = await keysResponse.json();
                setApiKeys(keys);
                if (keys.length > 0) {
                    setSelectedApiKey(keys[0].key);
                }
            }

            // Fetch Knowledge Bases
            const kbResponse = await fetch(`${API_BASE_URL}/file-search/knowledge-bases`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (kbResponse.ok) {
                const kbs = await kbResponse.json();
                setKnowledgeBases(kbs);
                if (kbs.length > 0) {
                    setSelectedKbId(kbs[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const embedCode = `<!-- APIVerse AI Chat Widget -->
<script src="${API_BASE_URL}/widget/apiverse-widget.js"></script>
<script>
  APIVerseWidget.init({
    apiKey: '${selectedApiKey || 'YOUR_API_KEY'}',
    knowledgeBaseId: ${selectedKbId || 1},
    apiUrl: '${API_ENDPOINTS.widget}'
  });
</script>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Widget Integration</h1>
                <p className="text-slate-400 mt-2">嵌入 AI 聊天助手到您的网站，让用户可以智能查询您的知识库</p>
            </div>

            {/* Configuration Section */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Settings className="h-6 w-6 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">配置选项</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* API Key Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">选择 API Key</label>
                        {apiKeys.length === 0 ? (
                            <p className="text-orange-400 text-sm">您还没有 API Key，请先在 API Keys 页面创建</p>
                        ) : (
                            <select
                                value={selectedApiKey}
                                onChange={(e) => setSelectedApiKey(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                {apiKeys.map(key => (
                                    <option key={key.id} value={key.key}>
                                        {key.label} ({key.key.substring(0, 10)}...)
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Knowledge Base Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">选择知识库</label>
                        {knowledgeBases.length === 0 ? (
                            <p className="text-orange-400 text-sm">您还没有知识库，请先在 Knowledge Base 页面创建</p>
                        ) : (
                            <select
                                value={selectedKbId || ''}
                                onChange={(e) => setSelectedKbId(Number(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                            >
                                {knowledgeBases.map(kb => (
                                    <option key={kb.id} value={kb.id}>
                                        {kb.name} (ID: {kb.id})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Embed Code Section */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Code className="h-6 w-6 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">嵌入代码</h2>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? '已复制!' : '复制代码'}
                    </button>
                </div>

                <p className="text-slate-400 text-sm mb-4">
                    将以下代码复制到您网站的 <code className="bg-slate-800 px-1 rounded">&lt;/body&gt;</code> 标签之前：
                </p>

                <pre className="bg-slate-900 border border-slate-800 p-4 rounded-xl overflow-x-auto text-sm font-mono text-green-400 leading-relaxed">
                    {embedCode}
                </pre>
            </div>

            {/* Preview Section */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <ExternalLink className="h-6 w-6 text-green-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">使用说明</h2>
                </div>

                <div className="space-y-4 text-slate-300">
                    <div className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                        <div>
                            <p className="font-medium text-white">创建知识库</p>
                            <p className="text-sm text-slate-400">在 Knowledge Base 页面上传您的文档（PDF、TXT、DOCX 等）</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                        <div>
                            <p className="font-medium text-white">创建 API Key</p>
                            <p className="text-sm text-slate-400">在 API Keys 页面创建用于 Widget 的 API Key</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                        <div>
                            <p className="font-medium text-white">选择配置</p>
                            <p className="text-sm text-slate-400">在上方选择要使用的 API Key 和知识库</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                        <div>
                            <p className="font-medium text-white">嵌入代码</p>
                            <p className="text-sm text-slate-400">复制上面的代码，粘贴到您网站的 HTML 中</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Info */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Database className="h-6 w-6 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">当前状态</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-slate-500 text-xs uppercase tracking-wide">API Keys</p>
                        <p className="text-2xl font-bold text-white">{apiKeys.length}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-slate-500 text-xs uppercase tracking-wide">知识库</p>
                        <p className="text-2xl font-bold text-white">{knowledgeBases.length}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-slate-500 text-xs uppercase tracking-wide">API 地址</p>
                        <p className="text-sm font-mono text-green-400 truncate">{API_ENDPOINTS.widget}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-slate-500 text-xs uppercase tracking-wide">状态</p>
                        <p className="text-sm font-medium text-green-400">✓ 可用</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WidgetConfigPage;
