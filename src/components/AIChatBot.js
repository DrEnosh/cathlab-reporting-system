// ============================================================
// Component: AI ChatBot Widget
// ============================================================

export function initAIChatBot() {
    const body = document.body;

    // Inject the floating UI
    const botHTML = `
    <div id="aiChatWidget" class="ai-widget-container">
      <button id="aiToggleBtn" class="ai-toggle-btn">
        <span class="ai-icon">✨</span>
        <span class="ai-tooltip">Ask CathAI</span>
      </button>
      
      <div id="aiChatPanel" class="ai-chat-panel hidden">
        <div class="ai-chat-header">
          <div class="ai-chat-title">
            <span class="ai-icon-small">✨</span> CathAI Assistant
          </div>
          <button id="aiCloseBtn" class="ai-close-btn">✖</button>
        </div>
        
        <div class="ai-chat-messages" id="aiChatMessages">
          <div class="ai-message ai-message-bot">
            Hi! I am CathAI. I can help you fetch patient data, analyze hemodynamics, or guide you through drafting a report. Try asking me "What is the normal PVR range?" or "Help me draft a CAG impression."
          </div>
        </div>
        
        <div class="ai-chat-suggestions" id="aiChatSuggestions">
          <button class="ai-suggest-btn">Normal PVR range?</button>
          <button class="ai-suggest-btn">Draft CAG impression</button>
          <button class="ai-suggest-btn">Summarize recent cases</button>
        </div>

        <div class="ai-chat-input-area">
          <input type="text" id="aiChatInput" placeholder="Ask CathAI anything..." autocomplete="off">
          <button id="aiSendBtn" class="ai-send-btn">➤</button>
        </div>
      </div>
    </div>
  `;

    body.insertAdjacentHTML('beforeend', botHTML);

    const widget = document.getElementById('aiChatWidget');
    const toggleBtn = document.getElementById('aiToggleBtn');
    const panel = document.getElementById('aiChatPanel');
    const closeBtn = document.getElementById('aiCloseBtn');
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiSendBtn');
    const messagesContainer = document.getElementById('aiChatMessages');
    const suggestBtns = document.querySelectorAll('.ai-suggest-btn');

    // Toggle Logic
    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            input.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.add('hidden');
    });

    // Chat Logic
    const appendMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ai-message-${sender}`;
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const handleSend = () => {
        const text = input.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        input.value = '';

        // Simulate thinking delay
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'ai-message ai-message-bot ai-typing';
        typingIndicator.textContent = 'Thinking...';
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        setTimeout(() => {
            typingIndicator.remove();
            const response = generateAIResponse(text);
            appendMessage(response, 'bot');
        }, 1500);
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Suggestions
    suggestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.textContent;
            handleSend();
            document.getElementById('aiChatSuggestions').style.display = 'none'; // hide after use
        });
    });
}

// Simulated Intelligence (Hardcoded for demo purposes)
function generateAIResponse(query) {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('pvr') || lowerQuery.includes('normal range')) {
        return 'Normal Pulmonary Vascular Resistance (PVR) is generally considered to be below 2.0 to 3.0 Wood Units. In the RHC template, I will automatically auto-calculate PVR if you provide PA Mean, PCWP, and Cardiac Output, and flag it yellow if it exceeds 3.0 WU.';
    }

    if (lowerQuery.includes('cag') || lowerQuery.includes('impression')) {
        return 'I can generate a standard CAG impression! In the CAG template, once you input stenosis percentages over 70%, I will automatically write a preliminary diagnostic impression for you at the bottom of the form summarizing Single, Double, or Triple Vessel Disease.';
    }

    if (lowerQuery.includes('summarize') || lowerQuery.includes('recent cases')) {
        return 'Looking at your recent data: You have safely completed several procedures recently. You currently have a few drafts pending final digital signatures. I recommend visiting your Doctor Dashboard to quickly review and finalize them.';
    }

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        return 'Hello Doctor! I am ready to assist you. How can I speed up your clinical workflow today?';
    }

    return 'I am a simulated AI assistant built for this prototype. In a production environment, I would be connected to an LLM (like Gemini or GPT-4) integrated with your hospital\'s medical knowledge base to provide secure, accurate clinical support.';
}
