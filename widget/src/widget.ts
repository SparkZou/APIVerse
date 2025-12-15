// CSS styles embedded directly
const widgetStyles = `
#apiverse-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  z-index: 99999;
  position: fixed;
  bottom: 20px;
  right: 20px;
}

/* Mobile responsive styles */
@media (max-width: 480px) {
  #apiverse-widget-container {
    bottom: 10px;
    right: 10px;
  }
  
  .apiverse-widget-button {
    width: 54px;
    height: 54px;
  }
  
  .apiverse-widget-window {
    position: fixed !important;
    bottom: 0 !important;
    right: 0 !important;
    left: 0 !important;
    top: auto !important;
    width: 100% !important;
    height: 85vh !important;
    max-height: 85vh !important;
    border-radius: 20px 20px 0 0 !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
  
  .apiverse-widget-window.open {
    transform: translateY(0) scale(1);
  }
  
  .apiverse-widget-header {
    padding: 14px 16px;
    border-radius: 20px 20px 0 0;
  }
  
  .apiverse-widget-content {
    padding: 12px;
  }
  
  .apiverse-widget-input-area {
    padding: 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
  
  .apiverse-widget-input {
    padding: 10px 14px;
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .apiverse-widget-send {
    padding: 10px 16px;
  }
  
  .apiverse-message {
    max-width: 90%;
    font-size: 15px;
  }
  
  .apiverse-powered {
    padding-bottom: max(8px, env(safe-area-inset-bottom));
  }
}

.apiverse-widget-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: white;
  border: none;
}

.apiverse-widget-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

.apiverse-widget-window {
  position: absolute;
  bottom: 75px;
  right: 0;
  width: 380px;
  max-width: calc(100vw - 40px);
  height: 520px;
  max-height: calc(100vh - 120px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0,0,0,0.08);
}

.apiverse-widget-window.open {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: all;
}

.apiverse-widget-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.apiverse-widget-title {
  font-weight: 600;
  font-size: 16px;
  color: white;
}

.apiverse-widget-close {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background 0.2s;
}

.apiverse-widget-close:hover {
  background: rgba(255,255,255,0.3);
}

.apiverse-widget-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f9fafb;
}

.apiverse-widget-input-area {
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 10px;
}

.apiverse-widget-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.apiverse-widget-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.apiverse-widget-send {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
  cursor: pointer;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 24px;
  transition: all 0.2s;
}

.apiverse-widget-send:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.apiverse-message {
  padding: 12px 16px;
  border-radius: 16px;
  max-width: 85%;
  font-size: 14px;
  line-height: 1.5;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Streaming cursor animation */
.apiverse-message .cursor {
  display: inline-block;
  color: #6366f1;
  animation: blink 0.8s infinite;
  margin-left: 2px;
  font-weight: normal;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.apiverse-message.user {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.apiverse-message.bot {
  background: white;
  color: #374151;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

/* Markdown styling for bot messages */
.apiverse-message.bot strong {
  color: #4f46e5;
  font-weight: 600;
}

.apiverse-message.bot em {
  font-style: italic;
  color: #6b7280;
}

.apiverse-message.bot ul, .apiverse-message.bot ol {
  margin: 8px 0;
  padding-left: 20px;
}

.apiverse-message.bot li {
  margin: 4px 0;
  line-height: 1.5;
}

.apiverse-message.bot li::marker {
  color: #6366f1;
}

.apiverse-message.bot p {
  margin: 0 0 8px 0;
}

.apiverse-message.bot p:last-child {
  margin-bottom: 0;
}

.apiverse-message.bot code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #e11d48;
}

.apiverse-message.bot pre {
  background: #1f2937;
  color: #e5e7eb;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.apiverse-message.bot pre code {
  background: none;
  color: inherit;
  padding: 0;
}

.apiverse-message.bot blockquote {
  border-left: 3px solid #6366f1;
  padding-left: 12px;
  margin: 8px 0;
  color: #6b7280;
  font-style: italic;
}

.apiverse-message.bot a {
  color: #6366f1;
  text-decoration: underline;
}

.apiverse-message.bot h1, .apiverse-message.bot h2, .apiverse-message.bot h3 {
  color: #1f2937;
  margin: 12px 0 8px 0;
  font-weight: 600;
}

.apiverse-message.bot h1 { font-size: 18px; }
.apiverse-message.bot h2 { font-size: 16px; }
.apiverse-message.bot h3 { font-size: 15px; }

.apiverse-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  padding: 12px 16px;
  background: white;
  border-radius: 16px;
  align-self: flex-start;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.apiverse-loading::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6366f1;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.apiverse-powered {
  text-align: center;
  padding: 8px;
  font-size: 11px;
  color: #9ca3af;
  background: white;
  border-top: 1px solid #f3f4f6;
}

.apiverse-powered a {
  color: #6366f1;
  text-decoration: none;
}
`;

interface WidgetConfig {
    apiKey: string;
    knowledgeBaseId?: number;
    theme?: {
        primaryColor?: string;
        position?: string;
    };
    apiUrl?: string;
}

class APIVerseWidget {
    private config: WidgetConfig;
    private container: HTMLElement;
    private window: HTMLElement;
    private isOpen: boolean = false;
    private messagesContainer: HTMLElement;
    private companyName: string = 'APIVerse';
    private companyUrl: string = 'https://web.smartbot.co.nz';

    constructor(config: WidgetConfig) {
        this.config = {
            apiUrl: 'https://apiverse.smartbot.co.nz/api/widget',
            ...config
        };
        this.injectStyles();
        this.init();
        this.fetchCompanyInfo();
    }

    static init(config: WidgetConfig) {
        new APIVerseWidget(config);
    }

    private async fetchCompanyInfo() {
        try {
            const response = await fetch(`${this.config.apiUrl}/config/${this.config.apiKey}`);
            if (response.ok) {
                const data = await response.json();
                if (data.company_name) {
                    this.companyName = data.company_name;
                }
                if (data.company_url) {
                    this.companyUrl = data.company_url;
                }
                this.updatePoweredBy();
            }
        } catch (error) {
            console.error('Failed to fetch company info:', error);
        }
    }

    private updatePoweredBy() {
        const poweredByEl = this.container.querySelector('.apiverse-powered');
        if (poweredByEl) {
            poweredByEl.innerHTML = `Powered by <a href="${this.companyUrl}" target="_blank">${this.companyName}</a>`;
        }
    }

    private injectStyles() {
        // Check if styles already injected
        if (document.getElementById('apiverse-widget-styles')) return;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'apiverse-widget-styles';
        styleEl.textContent = widgetStyles;
        document.head.appendChild(styleEl);
    }

    private init() {
        this.createWidgetUI();
        this.attachEventListeners();
    }

    private createWidgetUI() {
        // Create container
        this.container = document.createElement('div');
        this.container.id = 'apiverse-widget-container';

        // Create button
        const button = document.createElement('div');
        button.className = 'apiverse-widget-button';
        button.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;

        // Create window
        this.window = document.createElement('div');
        this.window.className = 'apiverse-widget-window';
        this.window.innerHTML = `
      <div class="apiverse-widget-header">
        <span class="apiverse-widget-title">💬 AI Assistant</span>
        <button class="apiverse-widget-close" id="apiverse-close">×</button>
      </div>
      <div class="apiverse-widget-content">
        <div class="apiverse-message bot">
          👋 Hello! How can I help you today? Ask me anything about our documents.
        </div>
      </div>
      <div class="apiverse-widget-input-area">
        <input type="text" class="apiverse-widget-input" placeholder="Type your question...">
        <button class="apiverse-widget-send">Send</button>
      </div>
      <div class="apiverse-powered">Powered by <a href="https://web.smartbot.co.nz" target="_blank">APIVerse</a></div>
    `;

        this.messagesContainer = this.window.querySelector('.apiverse-widget-content') as HTMLElement;

        this.container.appendChild(this.window);
        this.container.appendChild(button);
        document.body.appendChild(this.container);
    }

    private attachEventListeners() {
        const button = this.container.querySelector('.apiverse-widget-button');
        const closeBtn = this.container.querySelector('#apiverse-close');
        const sendBtn = this.container.querySelector('.apiverse-widget-send');
        const input = this.container.querySelector('.apiverse-widget-input') as HTMLInputElement;

        const toggle = () => {
            this.isOpen = !this.isOpen;
            this.window.classList.toggle('open', this.isOpen);
        };

        button?.addEventListener('click', toggle);
        closeBtn?.addEventListener('click', toggle);

        const sendMessage = async () => {
            const text = input.value.trim();
            if (!text) return;

            // Add user message
            this.addMessage(text, 'user');
            input.value = '';

            // Call streaming API for typewriter effect
            try {
                this.addLoadingIndicator();
                
                const response = await fetch(`${this.config.apiUrl}/search/stream`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.config.apiKey
                    },
                    body: JSON.stringify({
                        query: text,
                        knowledge_base_id: this.config.knowledgeBaseId
                    })
                });

                this.removeLoadingIndicator();

                if (!response.ok) {
                    const errorData = await response.json();
                    this.addMessage(`Error: ${errorData.detail || 'Failed to search'}`, 'bot');
                    return;
                }

                // Create bot message element for streaming
                const botMessage = this.createStreamingMessage();
                let fullText = '';

                // Read the stream
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (!reader) {
                    this.addMessage('Error: Unable to read response stream', 'bot');
                    return;
                }

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.text) {
                                    fullText += data.text;
                                    this.updateStreamingMessage(botMessage, fullText);
                                }
                                if (data.done) {
                                    // Stream complete
                                    break;
                                }
                                if (data.error) {
                                    fullText += `\n\nError: ${data.error}`;
                                    this.updateStreamingMessage(botMessage, fullText);
                                }
                            } catch (e) {
                                // Ignore JSON parse errors for incomplete chunks
                            }
                        }
                    }
                }

                // Stream complete - finalize the message
                this.finalizeStreamingMessage(botMessage, fullText);

            } catch (error) {
                this.removeLoadingIndicator();
                this.addMessage('Sorry, something went wrong. Please check your connection.', 'bot');
                console.error(error);
            }
        };

        sendBtn?.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    private createStreamingMessage(): HTMLElement {
        const div = document.createElement('div');
        div.className = 'apiverse-message bot streaming';
        div.innerHTML = '<span class="cursor">▋</span>';
        this.messagesContainer.appendChild(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        return div;
    }

    private updateStreamingMessage(element: HTMLElement, text: string) {
        element.innerHTML = this.parseMarkdown(text) + '<span class="cursor">▋</span>';
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    private finalizeStreamingMessage(element: HTMLElement, text: string) {
        // Remove streaming class and cursor
        element.classList.remove('streaming');
        element.innerHTML = this.parseMarkdown(text);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    private addMessage(text: string, type: 'user' | 'bot') {
        const div = document.createElement('div');
        div.className = `apiverse-message ${type}`;
        
        if (type === 'bot') {
            // Parse markdown for bot messages
            div.innerHTML = this.parseMarkdown(text);
        } else {
            div.textContent = text;
        }
        
        this.messagesContainer.appendChild(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    private parseMarkdown(text: string): string {
        // Escape HTML to prevent XSS
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Code blocks (```code```)
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Inline code (`code`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Bold (**text** or __text__) - must be before italic
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        
        // Headers (### text)
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        
        // Unordered lists - handle "* item" format (common from AI responses)
        // Match lines starting with "* " (but not ** which is bold)
        html = html.replace(/^\* ([^*].*?)$/gm, '{{LI}}$1{{/LI}}');
        // Also handle "- item" format
        html = html.replace(/^- (.+)$/gm, '{{LI}}$1{{/LI}}');
        
        // Ordered lists (1. item)
        html = html.replace(/^\d+\. (.+)$/gm, '{{LI}}$1{{/LI}}');
        
        // Italic (*text* or _text_) - after lists to avoid conflicts
        html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_\n]+)_/g, '<em>$1</em>');
        
        // Blockquotes (> text)
        html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
        
        // Links [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Convert list placeholders to proper HTML
        // Group consecutive list items
        html = html.replace(/({{LI}}[\s\S]*?{{\/LI}}(\n|$))+/g, (match) => {
            const items = match.replace(/{{LI}}/g, '<li>').replace(/{{\/LI}}/g, '</li>');
            return '<ul>' + items.trim() + '</ul>';
        });
        
        // Clean up any remaining placeholders
        html = html.replace(/{{LI}}/g, '<li>').replace(/{{\/LI}}/g, '</li>');
        
        // Line breaks - convert double newlines to paragraph breaks
        html = html.replace(/\n\n+/g, '</p><p>');
        
        // Single line breaks (but not inside lists)
        html = html.replace(/\n/g, '<br>');
        
        // Remove <br> inside and around list elements
        html = html.replace(/<br><ul>/g, '<ul>');
        html = html.replace(/<\/ul><br>/g, '</ul>');
        html = html.replace(/<\/li><br><li>/g, '</li><li>');
        html = html.replace(/<br><li>/g, '<li>');
        html = html.replace(/<\/li><br>/g, '</li>');
        
        // Wrap in paragraph if content exists and not already wrapped
        if (html.trim() && !html.trim().startsWith('<')) {
            html = '<p>' + html + '</p>';
        }
        
        // Clean up empty and nested paragraphs
        html = html.replace(/<p>\s*<\/p>/g, '');
        html = html.replace(/<p>(<h[123]>)/g, '$1');
        html = html.replace(/(<\/h[123]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p><br>/g, '<p>');
        html = html.replace(/<br><\/p>/g, '</p>');
        
        return html;
    }

    private addLoadingIndicator() {
        const div = document.createElement('div');
        div.className = 'apiverse-loading';
        div.id = 'apiverse-loader';
        div.textContent = 'Thinking...';
        this.messagesContainer.appendChild(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    private removeLoadingIndicator() {
        const loader = this.messagesContainer.querySelector('#apiverse-loader');
        if (loader) loader.remove();
    }
}

// Expose to window
(window as any).APIVerseWidget = APIVerseWidget;
