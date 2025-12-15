// CSS styles embedded directly
const widgetStyles = `
#apiverse-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  z-index: 99999;
  position: fixed;
  bottom: 20px;
  right: 20px;
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
  height: 520px;
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

            // Call API
            try {
                this.addLoadingIndicator();
                const response = await fetch(`${this.config.apiUrl}/search`, {
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

                const data = await response.json();
                this.removeLoadingIndicator();

                if (response.ok) {
                    // Find the best result
                    if (data.results && data.results.length > 0) {
                        this.addMessage(data.results[0].text, 'bot');
                    } else {
                        this.addMessage("I couldn't find any relevant information.", 'bot');
                    }
                } else {
                    this.addMessage(`Error: ${data.detail || 'Failed to search'}`, 'bot');
                }

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

    private addMessage(text: string, type: 'user' | 'bot') {
        const div = document.createElement('div');
        div.className = `apiverse-message ${type}`;
        div.textContent = text;
        this.messagesContainer.appendChild(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
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
