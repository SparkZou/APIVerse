import React, { useState, useEffect } from 'react';
import { Copy, Check, Code, Settings } from 'lucide-react';

const WidgetConfigPage: React.FC = () => {
    const [apiKey, setApiKey] = useState('YOUR_API_KEY_HERE');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Mock fetch API key or get from user profile
        const fetchKey = async () => {
            try {
                const token = localStorage.getItem('token');
                // Assuming we have an endpoint to get the first API key or specific widget key
                // For now, we'll placeholder it or use a real call if available
                // In a real app, users might accept a specific key
            } catch (e) { }
        };
        fetchKey();
    }, []);

    const embedCode = `
<!-- APIVerse Widget -->
<script src="http://localhost:8000/static/widget/apiverse-widget.js"></script>
<link href="http://localhost:8000/static/widget/style.css" rel="stylesheet">
<script>
  window.addEventListener('load', function() {
    APIVerseWidget.init({
      apiKey: '${apiKey}',
      theme: {
        primaryColor: '#6366f1'
      }
    });
  });
</script>
`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Widget Integration</h1>
                <p className="text-gray-500 mt-2">Embed the AI search assistant on your website</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Configuration Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <Code size={24} />
                        </div>
                        <h2 className="text-xl font-semibold">Embed Code</h2>
                    </div>

                    <p className="text-gray-600 mb-4">
                        Copy and paste this code snippet before the closing <code>&lt;/body&gt;</code> tag of your website.
                    </p>

                    <div className="relative group">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={copyToClipboard}
                                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-xs font-medium"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </button>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed">
                            {embedCode}
                        </pre>
                    </div>
                </div>

                {/* Settings Preview Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-75 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                            <Settings size={24} />
                        </div>
                        <h2 className="text-xl font-semibold">Customization</h2>
                    </div>
                    <p className="text-sm text-gray-500 italic">Theme customization coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default WidgetConfigPage;
