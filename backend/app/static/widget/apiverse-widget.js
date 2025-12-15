(function(n){typeof define=="function"&&define.amd?define(n):n()})(function(){"use strict";const n=`
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
`;class d{constructor(t){this.isOpen=!1,this.companyName="APIVerse",this.companyUrl="https://web.smartbot.co.nz",this.config={apiUrl:"https://apiverse.smartbot.co.nz/api/widget",...t},this.injectStyles(),this.init(),this.fetchCompanyInfo()}static init(t){new d(t)}async fetchCompanyInfo(){try{const t=await fetch(`${this.config.apiUrl}/config/${this.config.apiKey}`);if(t.ok){const e=await t.json();e.company_name&&(this.companyName=e.company_name),e.company_url&&(this.companyUrl=e.company_url),this.updatePoweredBy()}}catch(t){console.error("Failed to fetch company info:",t)}}updatePoweredBy(){const t=this.container.querySelector(".apiverse-powered");t&&(t.innerHTML=`Powered by <a href="${this.companyUrl}" target="_blank">${this.companyName}</a>`)}injectStyles(){if(document.getElementById("apiverse-widget-styles"))return;const t=document.createElement("style");t.id="apiverse-widget-styles",t.textContent=n,document.head.appendChild(t)}init(){this.createWidgetUI(),this.attachEventListeners()}createWidgetUI(){this.container=document.createElement("div"),this.container.id="apiverse-widget-container";const t=document.createElement("div");t.className="apiverse-widget-button",t.innerHTML=`
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `,this.window=document.createElement("div"),this.window.className="apiverse-widget-window",this.window.innerHTML=`
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
    `,this.messagesContainer=this.window.querySelector(".apiverse-widget-content"),this.container.appendChild(this.window),this.container.appendChild(t),document.body.appendChild(this.container)}attachEventListeners(){const t=this.container.querySelector(".apiverse-widget-button"),e=this.container.querySelector("#apiverse-close"),i=this.container.querySelector(".apiverse-widget-send"),p=this.container.querySelector(".apiverse-widget-input"),g=()=>{this.isOpen=!this.isOpen,this.window.classList.toggle("open",this.isOpen)};t==null||t.addEventListener("click",g),e==null||e.addEventListener("click",g);const h=async()=>{var m;const s=p.value.trim();if(s){this.addMessage(s,"user"),p.value="";try{this.addLoadingIndicator();const r=await fetch(`${this.config.apiUrl}/search/stream`,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":this.config.apiKey},body:JSON.stringify({query:s,knowledge_base_id:this.config.knowledgeBaseId})});if(this.removeLoadingIndicator(),!r.ok){const l=await r.json();this.addMessage(`Error: ${l.detail||"Failed to search"}`,"bot");return}const c=this.createStreamingMessage();let o="";const b=(m=r.body)==null?void 0:m.getReader(),u=new TextDecoder;if(!b){this.addMessage("Error: Unable to read response stream","bot");return}for(;;){const{done:l,value:x}=await b.read();if(l)break;const w=u.decode(x).split(`
`);for(const f of w)if(f.startsWith("data: "))try{const a=JSON.parse(f.slice(6));if(a.text&&(o+=a.text,this.updateStreamingMessage(c,o)),a.done)break;a.error&&(o+=`

Error: ${a.error}`,this.updateStreamingMessage(c,o))}catch{}}this.finalizeStreamingMessage(c,o)}catch(r){this.removeLoadingIndicator(),this.addMessage("Sorry, something went wrong. Please check your connection.","bot"),console.error(r)}}};i==null||i.addEventListener("click",h),p.addEventListener("keypress",s=>{s.key==="Enter"&&h()})}createStreamingMessage(){const t=document.createElement("div");return t.className="apiverse-message bot streaming",t.innerHTML='<span class="cursor">▋</span>',this.messagesContainer.appendChild(t),this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight,t}updateStreamingMessage(t,e){t.innerHTML=this.parseMarkdown(e)+'<span class="cursor">▋</span>',this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight}finalizeStreamingMessage(t,e){t.classList.remove("streaming"),t.innerHTML=this.parseMarkdown(e),this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight}addMessage(t,e){const i=document.createElement("div");i.className=`apiverse-message ${e}`,e==="bot"?i.innerHTML=this.parseMarkdown(t):i.textContent=t,this.messagesContainer.appendChild(i),this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight}parseMarkdown(t){let e=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return e=e.replace(/```([\s\S]*?)```/g,"<pre><code>$1</code></pre>"),e=e.replace(/`([^`]+)`/g,"<code>$1</code>"),e=e.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),e=e.replace(/__([^_]+)__/g,"<strong>$1</strong>"),e=e.replace(/^### (.+)$/gm,"<h3>$1</h3>"),e=e.replace(/^## (.+)$/gm,"<h2>$1</h2>"),e=e.replace(/^# (.+)$/gm,"<h1>$1</h1>"),e=e.replace(/^\* ([^*].*?)$/gm,"{{LI}}$1{{/LI}}"),e=e.replace(/^- (.+)$/gm,"{{LI}}$1{{/LI}}"),e=e.replace(/^\d+\. (.+)$/gm,"{{LI}}$1{{/LI}}"),e=e.replace(/\*([^*\n]+)\*/g,"<em>$1</em>"),e=e.replace(/_([^_\n]+)_/g,"<em>$1</em>"),e=e.replace(/^&gt; (.+)$/gm,"<blockquote>$1</blockquote>"),e=e.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank">$1</a>'),e=e.replace(/({{LI}}[\s\S]*?{{\/LI}}(\n|$))+/g,i=>"<ul>"+i.replace(/{{LI}}/g,"<li>").replace(/{{\/LI}}/g,"</li>").trim()+"</ul>"),e=e.replace(/{{LI}}/g,"<li>").replace(/{{\/LI}}/g,"</li>"),e=e.replace(/\n\n+/g,"</p><p>"),e=e.replace(/\n/g,"<br>"),e=e.replace(/<br><ul>/g,"<ul>"),e=e.replace(/<\/ul><br>/g,"</ul>"),e=e.replace(/<\/li><br><li>/g,"</li><li>"),e=e.replace(/<br><li>/g,"<li>"),e=e.replace(/<\/li><br>/g,"</li>"),e.trim()&&!e.trim().startsWith("<")&&(e="<p>"+e+"</p>"),e=e.replace(/<p>\s*<\/p>/g,""),e=e.replace(/<p>(<h[123]>)/g,"$1"),e=e.replace(/(<\/h[123]>)<\/p>/g,"$1"),e=e.replace(/<p>(<ul>)/g,"$1"),e=e.replace(/(<\/ul>)<\/p>/g,"$1"),e=e.replace(/<p>(<pre>)/g,"$1"),e=e.replace(/(<\/pre>)<\/p>/g,"$1"),e=e.replace(/<p><br>/g,"<p>"),e=e.replace(/<br><\/p>/g,"</p>"),e}addLoadingIndicator(){const t=document.createElement("div");t.className="apiverse-loading",t.id="apiverse-loader",t.textContent="Thinking...",this.messagesContainer.appendChild(t),this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight}removeLoadingIndicator(){const t=this.messagesContainer.querySelector("#apiverse-loader");t&&t.remove()}}window.APIVerseWidget=d});
//# sourceMappingURL=apiverse-widget.js.map
