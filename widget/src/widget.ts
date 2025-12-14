import './styles.css';

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

    constructor(config: WidgetConfig) {
        this.config = {
            apiUrl: 'http://localhost:8000/api/widget', // Default dev URL
            ...config
        };
        this.init();
    }

    static init(config: WidgetConfig) {
        new APIVerseWidget(config);
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;

        // Create window
        this.window = document.createElement('div');
        this.window.className = 'apiverse-widget-window';
        this.window.innerHTML = `
      <div class="apiverse-widget-header">
        <span class="apiverse-widget-title">AI Assistant</span>
        <button id="apiverse-close" style="background:none;border:none;cursor:pointer">✕</button>
      </div>
      <div class="apiverse-widget-content">
        <div class="apiverse-message bot">
          Hello! How can I help you regarding our documents?
        </div>
      </div>
      <div class="apiverse-widget-input-area">
        <input type="text" class="apiverse-widget-input" placeholder="Ask a question...">
        <button class="apiverse-widget-send">Send</button>
      </div>
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
