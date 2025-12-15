import React, { useState, useEffect } from 'react';
// framer-motion available if needed
import { Upload, Search, Database, Trash2, FileText, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';

interface KnowledgeBase {
    id: number;
    name: string;
    description: string;
    documents: Document[];
}

interface Document {
    id: number;
    filename: string;
    status: string;
    created_at: string;
}

const FileSearchPage: React.FC = () => {
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [selectedKb, setSelectedKb] = useState<KnowledgeBase | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newKbName, setNewKbName] = useState('');
    const [quota, setQuota] = useState({ used: 0, limit: 100 });
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);

    // Mock data for initial render if API fails (or replace with actual fetch)
    const fetchKBs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setAuthError('Please login to access Knowledge Base features');
                return;
            }
            const res = await fetch(`${API_ENDPOINTS.fileSearch}/knowledge-bases`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) {
                setIsAuthenticated(false);
                setAuthError('Session expired. Please login again.');
                localStorage.removeItem('token');
                return;
            }
            if (res.ok) {
                setIsAuthenticated(true);
                const data = await res.json();
                setKnowledgeBases(data);
            }
        } catch (e) {
            console.error("Failed to fetch KBs", e);
        }
    };

    const fetchQuota = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch(`${API_ENDPOINTS.fileSearch}/quota`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setQuota(data);
            }
        } catch (e) { }
    }

    useEffect(() => {
        fetchKBs();
        fetchQuota();
    }, []);

    const createKb = async () => {
        if (!newKbName) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_ENDPOINTS.fileSearch}/knowledge-bases`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newKbName })
            });
            if (res.ok) {
                fetchKBs();
                setIsCreating(false);
                setNewKbName('');
            }
        } catch (e) { }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedKb || !e.target.files) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_ENDPOINTS.fileSearch}/knowledge-bases/${selectedKb.id}/documents`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            // Refresh list
            fetchKBs(); // Need a better way to refresh just documents, but this works
            // Since fetchKBs updates the whole list, if we select by ID we need to update selectedKb too
            // Or just trigger a reload
            // Ideally fetch docs for selected KB
        } catch (e) { }
        setUploading(false);
    };

    const handleDeleteDocument = async (docId: number) => {
        if (!selectedKb) return;
        if (!confirm('Are you sure you want to delete this document?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_ENDPOINTS.fileSearch}/knowledge-bases/${selectedKb.id}/documents/${docId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                // Refresh the knowledge bases list to update document count
                fetchKBs();
                // Update selectedKb to remove the deleted document
                setSelectedKb(prev => prev ? {
                    ...prev,
                    documents: prev.documents.filter(d => d.id !== docId)
                } : null);
            }
        } catch (e) {
            console.error('Failed to delete document', e);
        }
    };

    const handleSearch = async () => {
        if (!selectedKb || !searchQuery) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_ENDPOINTS.fileSearch}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    knowledge_base_id: selectedKb.id,
                    query: searchQuery
                })
            });
            const data = await res.json();
            setSearchResults(data.results || []);
            fetchQuota();
        } catch (e) { }
    }

    // Show login prompt if not authenticated
    if (isAuthenticated === false) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center max-w-md">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LogIn className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                        <p className="text-gray-500 mb-6">{authError || 'Please login to access Knowledge Base features'}</p>
                        <Link 
                            to="/login" 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                        >
                            <LogIn size={18} />
                            Sign In
                        </Link>
                        <p className="mt-4 text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 hover:text-indigo-700">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
                    <p className="text-gray-500 mt-2">Manage your documents and search capabilities</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm font-medium text-gray-500">Free Quota Usage</div>
                    <div className="mt-2 flex items-center gap-4">
                        <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 rounded-full transition-all"
                                style={{ width: `${(quota.used / quota.limit) * 100}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold">{quota.used}/{quota.limit}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar: List of KBs */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">Collections</h2>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="New Collection"
                        >
                            <div className="w-5 h-5 flex items-center justify-center font-bold text-xl">+</div>
                        </button>
                    </div>

                    {isCreating && (
                        <div className="mb-4 flex gap-2">
                            <input
                                type="text"
                                value={newKbName}
                                onChange={(e) => setNewKbName(e.target.value)}
                                placeholder="New Collection Name..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                onKeyDown={(e) => e.key === 'Enter' && createKb()}
                            />
                            <button onClick={createKb} disabled={!newKbName} className="text-xs bg-indigo-600 text-white px-3 rounded-lg disabled:opacity-50">Create</button>
                        </div>
                    )}

                    <div className="space-y-2">
                        {knowledgeBases.map(kb => (
                            <div
                                key={kb.id}
                                onClick={() => setSelectedKb(kb)}
                                className={`p-4 rounded-lg cursor-pointer transition-all ${selectedKb?.id === kb.id ? 'bg-indigo-50 border-indigo-200 border' : 'hover:bg-gray-50 border border-transparent'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Database size={18} className={selectedKb?.id === kb.id ? 'text-indigo-600' : 'text-gray-400'} />
                                    <span className="font-medium text-gray-700">{kb.name}</span>
                                    <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">ID: {kb.id}</span>
                                </div>
                                <div className="ml-8 mt-1 text-xs text-gray-400">
                                    {kb.documents ? kb.documents.length : 0} documents
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedKb ? (
                        <>
                            {/* Upload Area */}
                            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center hover:bg-gray-50 transition-colors relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">Upload documents</h3>
                                <p className="mt-1 text-sm text-gray-500">PDF, TXT up to 10MB</p>
                                {uploading && <p className="text-indigo-600 mt-2 text-sm">Uploading...</p>}
                            </div>

                            {/* Document List */}
                            {selectedKb.documents && selectedKb.documents.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents ({selectedKb.documents.length})</h3>
                                    <div className="space-y-2">
                                        {selectedKb.documents.map(doc => (
                                            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <FileText size={18} className="text-indigo-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">{doc.filename}</p>
                                                        <p className="text-xs text-gray-400">{doc.status}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete document"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Search & Results */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex gap-4 mb-6">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Ask questions about your documents..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2"
                                    >
                                        <Search size={18} />
                                        Search
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {searchResults.map((result, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <p className="text-gray-800 leading-relaxed">{result.text}</p>
                                        </div>
                                    ))}
                                    {searchResults.length === 0 && searchQuery && !uploading && (
                                        <div className="text-center text-gray-400 py-8">
                                            No results found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-200 p-12">
                            <Database size={48} className="mb-4 opacity-50" />
                            <p>Select a knowledge base to manage documents</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileSearchPage;
