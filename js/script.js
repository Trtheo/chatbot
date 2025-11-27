// TChatBot - Intelligent AI Assistant
class TChatBot {
    constructor() {
        this.conversationHistory = [];
        this.isVoiceEnabled = true;
        this.synth = window.speechSynthesis;
        this.userContext = new Map();
        this.knowledgeBase = this.initializeKnowledge();
        this.geminiApiKey = localStorage.getItem('geminiApiKey') || null;
        this.useAI = this.geminiApiKey !== null;
        
        this.init();
    }
    
    initializeKnowledge() {
        return {
            programming: {
                javascript: {
                    basics: "JavaScript is a versatile programming language used for web development. It runs in browsers and servers (Node.js).",
                    variables: "Variables in JS: let name = 'value'; const PI = 3.14; var old = 'legacy';",
                    functions: "Functions: function name() {} or const name = () => {} (arrow function)",
                    examples: {
                        hello: "console.log('Hello World!');",
                        function: "function greet(name) { return `Hello, ${name}!`; }",
                        array: "const arr = [1, 2, 3]; arr.map(x => x * 2);",
                        object: "const obj = { name: 'John', age: 30 };"
                    }
                },
                python: {
                    basics: "Python is a high-level, interpreted language known for its simplicity and readability.",
                    variables: "Variables: name = 'value', pi = 3.14, numbers = [1, 2, 3]",
                    functions: "Functions: def function_name(param): return result",
                    examples: {
                        hello: "print('Hello World!')",
                        function: "def greet(name):\n    return f'Hello, {name}!'",
                        list: "numbers = [1, 2, 3]\nsquared = [x**2 for x in numbers]"
                    }
                }
            },
            science: {
                physics: "Physics studies matter, energy, and their interactions in the universe.",
                chemistry: "Chemistry explores the composition, structure, and properties of substances.",
                biology: "Biology is the study of living organisms and their vital processes.",
                math: "Mathematics is the abstract science of number, quantity, and space."
            },
            general: {
                ai: "AI (Artificial Intelligence) enables machines to simulate human intelligence and learning.",
                technology: "Technology encompasses tools, systems, and methods to solve problems and improve life.",
                internet: "The Internet is a global network connecting billions of devices worldwide."
            },
            ai_services: {
                gemini: {
                    description: "Google's Gemini AI is a powerful multimodal AI that can understand text, images, audio, and video.",
                    usage: "To use Gemini AI:\n• Visit ai.google.dev or bard.google.com\n• Get API key from Google AI Studio\n• Use Gemini API in your applications\n• Available models: Gemini Pro, Gemini Pro Vision",
                    features: "Features:\n• Text generation and conversation\n• Image analysis and description\n• Code generation and debugging\n• Multimodal understanding\n• Real-time responses"
                },
                integration: {
                    steps: "To integrate AI APIs:\n1. Choose AI service (OpenAI, Gemini, Claude)\n2. Get API credentials\n3. Install SDK or use REST API\n4. Handle authentication\n5. Make API calls in your code",
                    example: "Basic API integration example:\n```javascript\nconst response = await fetch('https://api.example.com/chat', {\n  method: 'POST',\n  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },\n  body: JSON.stringify({ message: 'Hello AI!' })\n});\n```"
                }
            }
        };
    }
    
    init() {
        this.setupEventListeners();
        this.loadConversationHistory();
        this.initializeChat();
        this.setupTheme();
    }
    
    setupEventListeners() {
        const input = document.getElementById('input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        input.addEventListener('input', (e) => {
            this.updateCharCount(e.target.value.length);
        });
        
        document.querySelector('.theme-toggle').addEventListener('click', () => this.toggleTheme());
        document.querySelector('.clear-chat').addEventListener('click', () => this.clearChat());
        document.querySelector('.voice-toggle').addEventListener('click', () => this.toggleVoice());
        
        // Add API key setup
        this.setupApiKeyInput();
        
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.dataset.message;
                if (message) {
                    document.getElementById('input').value = message;
                    this.sendMessage();
                }
            });
        });
    }
    
    initializeChat() {
        if (this.conversationHistory.length === 0) {
            const welcomeMsg = this.useAI ? 
                "Hello! I'm TChatBot powered by Gemini AI. I can help with anything you need!" :
                "Hello! I'm TChatBot. Add your Gemini API key in settings to unlock AI features, or chat with my built-in responses!";
            this.addMessage('bot', welcomeMsg);
        } else {
            this.renderConversationHistory();
        }
    }
    
    sendMessage() {
        const input = document.getElementById('input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage('user', message);
        input.value = '';
        this.updateCharCount(0);
        
        this.showTypingIndicator();
        
        setTimeout(async () => {
            this.hideTypingIndicator();
            let response;
            
            if (this.useAI && this.geminiApiKey) {
                try {
                    response = await this.getGeminiResponse(message);
                } catch (error) {
                    response = "Sorry, I'm having trouble connecting to AI. Using built-in responses: " + this.generateIntelligentResponse(message);
                }
            } else {
                response = this.generateIntelligentResponse(message);
            }
            
            this.addMessage('bot', response);
        }, 800 + Math.random() * 1200);
    }
    
    generateIntelligentResponse(message) {
        const analysis = this.analyzeMessage(message);
        
        // Store context for future reference
        this.updateUserContext(analysis);
        
        // Handle simple commands and actions
        if (/^(go|start|begin|continue|next)$/i.test(message.trim())) {
            return this.handleActionCommand(message);
        }
        
        // Generate contextual response
        if (analysis.intent === 'greeting') {
            return this.handleGreeting(analysis);
        }
        
        if (analysis.intent === 'programming') {
            return this.handleProgrammingQuery(analysis);
        }
        
        if (analysis.intent === 'math') {
            return this.handleMathQuery(analysis);
        }
        
        if (analysis.intent === 'science') {
            return this.handleScienceQuery(analysis);
        }
        
        if (analysis.intent === 'explanation') {
            return this.handleExplanationRequest(analysis);
        }
        
        if (analysis.intent === 'ai_integration') {
            return this.handleAIIntegrationQuery(analysis);
        }
        
        if (analysis.intent === 'personal') {
            return this.handlePersonalQuery(analysis);
        }
        
        if (analysis.intent === 'gratitude') {
            return "You're very welcome! I'm here to help whenever you need assistance. What else can I explain or help you with?";
        }
        
        if (analysis.intent === 'goodbye') {
            return "Goodbye! It's been great helping you today. Feel free to return anytime you have questions!";
        }
        
        // Intelligent fallback with context
        return this.generateContextualFallback(analysis);
    }
    
    analyzeMessage(message) {
        const lowerMessage = message.toLowerCase();
        const words = lowerMessage.split(/\s+/);
        
        const analysis = {
            original: message,
            words: words,
            intent: 'unknown',
            topics: [],
            entities: [],
            sentiment: 'neutral',
            complexity: this.assessComplexity(message)
        };
        
        // Intent detection
        if (/\b(hi|hello|hey|greetings)\b/.test(lowerMessage)) {
            analysis.intent = 'greeting';
        } else if (/\b(code|programming|javascript|js|python|html|css|function|variable|class|loop|array|object)\b/.test(lowerMessage)) {
            analysis.intent = 'programming';
            analysis.topics = this.extractProgrammingTopics(lowerMessage);
        } else if (/\b(\d+\s*[\+\-\*\/\^]\s*\d+|calculate|math|equation|solve)\b/.test(lowerMessage)) {
            analysis.intent = 'math';
        } else if (/\b(science|physics|chemistry|biology)\b/.test(lowerMessage)) {
            analysis.intent = 'science';
            analysis.topics = this.extractScienceTopics(lowerMessage);
        } else if (/\b(gemini|api|integrate|use ai)\b/.test(lowerMessage)) {
            analysis.intent = 'ai_integration';
        } else if (/\b(explain|tell me about|what is|how does|why|describe)\b/.test(lowerMessage)) {
            analysis.intent = 'explanation';
        } else if (/\b(who are you|your name|about you|created you)\b/.test(lowerMessage)) {
            analysis.intent = 'personal';
        } else if (/\b(thank|thanks|appreciate)\b/.test(lowerMessage)) {
            analysis.intent = 'gratitude';
        } else if (/\b(bye|goodbye|see you|farewell)\b/.test(lowerMessage)) {
            analysis.intent = 'goodbye';
        }
        
        return analysis;
    }
    
    extractProgrammingTopics(message) {
        const topics = [];
        if (/javascript|js/.test(message)) topics.push('javascript');
        if (/python/.test(message)) topics.push('python');
        if (/function/.test(message)) topics.push('functions');
        if (/variable/.test(message)) topics.push('variables');
        if (/array|list/.test(message)) topics.push('arrays');
        if (/object/.test(message)) topics.push('objects');
        if (/add|sum|math/.test(message)) topics.push('math_operations');
        return topics;
    }
    
    extractScienceTopics(message) {
        const topics = [];
        if (/physics/.test(message)) topics.push('physics');
        if (/chemistry/.test(message)) topics.push('chemistry');
        if (/biology/.test(message)) topics.push('biology');
        if (/math/.test(message)) topics.push('math');
        return topics;
    }
    
    assessComplexity(message) {
        const words = message.split(/\s+/).length;
        const hasQuestions = /\?/.test(message);
        const hasMultipleConcepts = /\band\b|\bor\b/.test(message.toLowerCase());
        
        if (words > 20 || hasMultipleConcepts) return 'high';
        if (words > 10 || hasQuestions) return 'medium';
        return 'low';
    }
    
    updateUserContext(analysis) {
        const timestamp = Date.now();
        this.userContext.set('lastIntent', analysis.intent);
        this.userContext.set('lastTopics', analysis.topics);
        this.userContext.set('lastTimestamp', timestamp);
        
        // Track conversation patterns
        if (!this.userContext.has('interests')) {
            this.userContext.set('interests', new Set());
        }
        analysis.topics.forEach(topic => {
            this.userContext.get('interests').add(topic);
        });
    }
    
    handleGreeting(analysis) {
        const timeOfDay = new Date().getHours();
        let greeting = "Hello!";
        
        if (timeOfDay < 12) greeting = "Good morning!";
        else if (timeOfDay < 18) greeting = "Good afternoon!";
        else greeting = "Good evening!";
        
        const interests = this.userContext.get('interests');
        if (interests && interests.size > 0) {
            const topicList = Array.from(interests).slice(0, 2).join(' and ');
            return `${greeting} Great to see you again! I remember you were interested in ${topicList}. What would you like to explore today?`;
        }
        
        return `${greeting} I'm TChatBot, ready to help you learn and solve problems. What's on your mind?`;
    }
    
    handleProgrammingQuery(analysis) {
        const message = analysis.original.toLowerCase();
        const topics = analysis.topics;
        
        // Handle specific Python requests
        if (topics.includes('python') || /python/.test(message)) {
            const kb = this.knowledgeBase.programming.python;
            
            if (/add.*number|addition|sum/.test(message)) {
                return `Here's how to add two numbers in Python:\n\n\`\`\`python\n# Simple addition\nnum1 = 5\nnum2 = 3\nresult = num1 + num2\nprint(f"{num1} + {num2} = {result}")\n\n# Function to add numbers\ndef add_numbers(a, b):\n    return a + b\n\n# Usage\nsum_result = add_numbers(10, 15)\nprint(f"Sum: {sum_result}")\n\`\`\`\n\nPython makes math operations simple and readable!`;
            }
            
            if (/example|show|code/.test(message)) {
                return `Python example:\n\n\`\`\`python\n${kb.examples.hello}\n\`\`\`\n\n${kb.basics}`;
            }
            
            return `${kb.basics}\n\nBasics:\n• ${kb.variables}\n• ${kb.functions}\n\nWhat would you like to learn about Python?`;
        }
        
        // Handle JavaScript requests
        if (topics.includes('javascript') || /javascript|js/.test(message)) {
            const kb = this.knowledgeBase.programming.javascript;
            
            if (/function/.test(message)) {
                return `Here's a JavaScript function example:\n\n\`\`\`javascript\n${kb.examples.function}\n\`\`\`\n\n${kb.functions}`;
            }
            
            if (/array/.test(message)) {
                return `JavaScript array example:\n\n\`\`\`javascript\n${kb.examples.array}\n\`\`\`\n\nArrays are versatile data structures in JavaScript.`;
            }
            
            return `${kb.basics}\n\nKey concepts:\n• ${kb.variables}\n• ${kb.functions}\n\nWould you like to see specific examples?`;
        }
        
        return "I can help you with programming! I'm knowledgeable about JavaScript, Python, and many other languages. What specific programming topic interests you?";
    }
    
    handleMathQuery(analysis) {
        // Enhanced math solving
        const mathMatch = analysis.original.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/\^])\s*(\d+(?:\.\d+)?)/);
        if (mathMatch) {
            const num1 = parseFloat(mathMatch[1]);
            const operator = mathMatch[2];
            const num2 = parseFloat(mathMatch[3]);
            
            let result, explanation;
            switch (operator) {
                case '+':
                    result = num1 + num2;
                    explanation = `Adding ${num1} and ${num2}`;
                    break;
                case '-':
                    result = num1 - num2;
                    explanation = `Subtracting ${num2} from ${num1}`;
                    break;
                case '*':
                    result = num1 * num2;
                    explanation = `Multiplying ${num1} by ${num2}`;
                    break;
                case '/':
                    if (num2 === 0) return "I can't divide by zero! That's undefined in mathematics.";
                    result = num1 / num2;
                    explanation = `Dividing ${num1} by ${num2}`;
                    break;
                case '^':
                    result = Math.pow(num1, num2);
                    explanation = `Raising ${num1} to the power of ${num2}`;
                    break;
            }
            
            return `${explanation}:\n**${num1} ${operator} ${num2} = ${result}**\n\nNeed help with more complex math problems?`;
        }
        
        return "I can solve math problems! Try asking me something like '15 * 7' or 'What's 100 / 4?'. I can also explain mathematical concepts.";
    }
    
    handleScienceQuery(analysis) {
        const topics = analysis.topics;
        const kb = this.knowledgeBase.science;
        
        if (topics.includes('physics')) {
            return `${kb.physics}\n\nPhysics covers mechanics, thermodynamics, electromagnetism, quantum mechanics, and relativity. What aspect of physics interests you?`;
        } else if (topics.includes('chemistry')) {
            return `${kb.chemistry}\n\nChemistry includes organic, inorganic, physical, and analytical chemistry. What would you like to know?`;
        } else if (topics.includes('biology')) {
            return `${kb.biology}\n\nBiology encompasses genetics, ecology, anatomy, physiology, and evolution. Any specific area you'd like to explore?`;
        }
        
        return "Science is fascinating! I can discuss physics, chemistry, biology, and mathematics. What scientific topic would you like to explore?";
    }
    
    handleExplanationRequest(analysis) {
        const message = analysis.original.toLowerCase();
        
        // AI and technology explanations
        if (/\bai\b|artificial intelligence/.test(message)) {
            return `${this.knowledgeBase.general.ai}\n\nAI includes machine learning, neural networks, natural language processing, and computer vision. It's transforming how we interact with technology!`;
        }
        
        if (/gemini|google ai|bard/.test(message)) {
            const gemini = this.knowledgeBase.ai_services.gemini;
            return `**Google Gemini AI**\n\n${gemini.description}\n\n**${gemini.usage}**\n\n**${gemini.features}**\n\nWould you like help integrating Gemini into your project?`;
        }
        
        if (/api integration|use ai|integrate ai/.test(message)) {
            const integration = this.knowledgeBase.ai_services.integration;
            return `**AI API Integration Guide**\n\n${integration.steps}\n\n${integration.example}\n\nWhich AI service are you interested in integrating?`;
        }
        
        if (/internet|web/.test(message)) {
            return `${this.knowledgeBase.general.internet}\n\nThe Internet uses protocols like HTTP, TCP/IP, and DNS to enable communication between devices worldwide.`;
        }
        
        // Provide intelligent context-based explanation
        const lastTopics = this.userContext.get('lastTopics') || [];
        if (lastTopics.length > 0) {
            return `Based on our conversation about ${lastTopics.join(' and ')}, could you be more specific about what you'd like me to explain? I can provide detailed information on many topics!`;
        }
        
        return "I'd be happy to explain! I can break down complex topics in programming, science, technology, and more. What specifically would you like me to explain?";
    }
    
    handlePersonalQuery(analysis) {
        if (/name/.test(analysis.original.toLowerCase())) {
            return "I'm TChatBot! I'm an intelligent AI assistant designed to help you learn, solve problems, and have meaningful conversations.";
        }
        
        if (/created|made/.test(analysis.original.toLowerCase())) {
            return "I was created by Theophile NIYIGABA as an intelligent conversational AI. I'm designed to be helpful, knowledgeable, and engaging!";
        }
        
        return "I'm TChatBot, an AI assistant focused on being genuinely helpful. I love learning from our conversations and helping you explore new topics!";
    }
    
    handleAIIntegrationQuery(analysis) {
        const message = analysis.original.toLowerCase();
        
        if (/gemini/.test(message)) {
            const gemini = this.knowledgeBase.ai_services.gemini;
            return `**Google Gemini AI Setup**\n\n${gemini.description}\n\n**How to get started:**\n${gemini.usage}\n\n**Key capabilities:**\n${gemini.features}\n\nNeed help with specific integration steps?`;
        }
        
        if (/api|integrate/.test(message)) {
            const integration = this.knowledgeBase.ai_services.integration;
            return `**AI Integration Guide**\n\n${integration.steps}\n\n**Code Example:**\n${integration.example}\n\nPopular AI APIs:\n• **OpenAI GPT** - Text generation\n• **Google Gemini** - Multimodal AI\n• **Anthropic Claude** - Conversational AI\n\nWhich one interests you?`;
        }
        
        return "I can help you integrate AI services! What specifically would you like to know about:\n\n🤖 **Gemini AI** - Google's multimodal AI\n🔧 **API Integration** - How to connect AI services\n💻 **Code Examples** - Implementation guides\n\nWhat's your goal?";
    }
    
    handleActionCommand(message) {
        const cmd = message.toLowerCase().trim();
        
        if (cmd === 'go') {
            return "Let's go! What would you like to explore?\n\n• **Programming** - JavaScript, Python, coding help\n• **Math** - Calculations, problem solving\n• **Science** - Physics, chemistry, biology\n• **General** - Explanations, learning, Q&A\n\nJust ask me anything!";
        }
        
        return "Ready to help! What topic interests you most today?";
    }
    
    generateContextualFallback(analysis) {
        const message = analysis.original.toLowerCase();
        
        // Check for specific topics in the message
        if (/learn|study|understand/.test(message)) {
            return "I'd love to help you learn! I can explain concepts in:\n\n• **Programming** (JavaScript, Python, web dev)\n• **Mathematics** (algebra, calculus, statistics)\n• **Science** (physics, chemistry, biology)\n• **Technology** (AI, computers, internet)\n\nWhat subject interests you?";
        }
        
        if (/help|assist|support/.test(message)) {
            return "I'm here to help! I can assist with:\n\n✓ Solving problems step-by-step\n✓ Explaining complex concepts simply\n✓ Providing code examples\n✓ Answering questions on many topics\n\nWhat do you need help with?";
        }
        
        if (/work|project|build|create/.test(message)) {
            return "Working on something interesting? I can help with:\n\n🔧 **Programming projects** - Code, debugging, best practices\n📊 **Problem solving** - Math, logic, analysis\n📚 **Research** - Explanations, concepts, learning\n\nTell me about your project!";
        }
        
        // Default intelligent response
        const interests = this.userContext.get('interests');
        if (interests && interests.size > 0) {
            const topicList = Array.from(interests).slice(0, 2).join(' and ');
            return `Based on your interest in ${topicList}, what specific aspect would you like to explore further? I can provide detailed explanations and examples!`;
        }
        
        return "I'm ready to help with any topic! Try asking me about:\n\n💻 Programming questions\n🧮 Math problems\n🔬 Science concepts\n💡 General explanations\n\nWhat's on your mind?";
    }
    
    addMessage(sender, message) {
        const messageSection = document.getElementById('message-section');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">${this.formatMessage(message)}</div>
            <div class="timestamp">${timestamp}</div>
        `;
        
        messageSection.appendChild(messageDiv);
        this.scrollToBottom();
        
        this.conversationHistory.push({ sender, message, timestamp });
        this.saveConversationHistory();
        
        if (sender === 'bot' && this.isVoiceEnabled) {
            this.speak(message);
        }
    }
    
    formatMessage(message) {
        message = message.replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        message = message.replace(/`([^`]+)`/g, '<code>$1</code>');
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        message = message.replace(/\n/g, '<br>');
        return message;
    }
    
    showTypingIndicator() {
        document.querySelector('.typing-indicator').style.display = 'flex';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        document.querySelector('.typing-indicator').style.display = 'none';
    }
    
    scrollToBottom() {
        const messageSection = document.getElementById('message-section');
        messageSection.scrollTop = messageSection.scrollHeight;
    }
    
    updateCharCount(count) {
        document.querySelector('.char-count').textContent = `${count}/500`;
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        const themeIcon = document.querySelector('.theme-toggle i');
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        localStorage.setItem('theme', newTheme);
    }
    
    toggleVoice() {
        this.isVoiceEnabled = !this.isVoiceEnabled;
        const voiceIcon = document.querySelector('.voice-toggle i');
        voiceIcon.className = this.isVoiceEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        
        localStorage.setItem('voiceEnabled', this.isVoiceEnabled);
    }
    
    setupApiKeyInput() {
        // Add API key button to controls
        const controlsPanel = document.querySelector('.controls-panel');
        const apiKeyBtn = document.createElement('div');
        apiKeyBtn.className = 'api-key-toggle';
        apiKeyBtn.title = 'Setup Gemini API';
        apiKeyBtn.innerHTML = '<i class="fas fa-key"></i>';
        apiKeyBtn.addEventListener('click', () => this.showApiKeyDialog());
        controlsPanel.appendChild(apiKeyBtn);
    }
    
    showApiKeyDialog() {
        const apiKey = prompt('Enter your Gemini API key:\n\nGet it from: https://ai.google.dev/', this.geminiApiKey || '');
        
        if (apiKey !== null) {
            if (apiKey.trim()) {
                this.geminiApiKey = apiKey.trim();
                this.useAI = true;
                localStorage.setItem('geminiApiKey', this.geminiApiKey);
                this.addMessage('bot', '🤖 Gemini AI activated! I can now provide more intelligent responses.');
            } else {
                this.geminiApiKey = null;
                this.useAI = false;
                localStorage.removeItem('geminiApiKey');
                this.addMessage('bot', 'AI features disabled. Using built-in responses.');
            }
        }
    }
    
    async getGeminiResponse(message) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are TChatBot, a helpful AI assistant. Respond naturally and helpfully to: ${message}`
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
    
    clearChat() {
        if (confirm('Clear conversation history?')) {
            this.conversationHistory = [];
            this.userContext.clear();
            document.getElementById('message-section').innerHTML = '';
            localStorage.removeItem('chatHistory');
            const welcomeMsg = this.useAI ? 
                "Hello! I'm TChatBot powered by Gemini AI. What can I help you with?" :
                "Hello! I'm TChatBot. Add your Gemini API key to unlock AI features!";
            this.addMessage('bot', welcomeMsg);
        }
    }
    
    speak(text) {
        if (!this.synth || !this.isVoiceEnabled) return;
        
        this.synth.cancel();
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/```[\s\S]*?```/g, 'code example');
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        this.synth.speak(utterance);
    }
    
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeIcon = document.querySelector('.theme-toggle i');
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    saveConversationHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(this.conversationHistory));
    }
    
    loadConversationHistory() {
        const saved = localStorage.getItem('chatHistory');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
        }
    }
    
    renderConversationHistory() {
        const messageSection = document.getElementById('message-section');
        messageSection.innerHTML = '';
        
        this.conversationHistory.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.sender);
            messageDiv.innerHTML = `
                <div class="message-content">${this.formatMessage(msg.message)}</div>
                <div class="timestamp">${msg.timestamp}</div>
            `;
            messageSection.appendChild(messageDiv);
        });
        
        this.scrollToBottom();
    }
}

// Initialize TChatBot
document.addEventListener('DOMContentLoaded', () => {
    window.chatBot = new TChatBot();
});

function sendMessage() {
    if (window.chatBot) {
        window.chatBot.sendMessage();
    }
}