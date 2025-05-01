// Enhanced Chatbot with all requested changes
const userMessage = [
    ["hi", "hey", "hello", "mwaramutse", "hola", "greetings"],
    ["sure", "yes", "no", "maybe", "of course", "absolutely", "never"],
    ["are you genious", "are you nerd", "are you intelligent", "are you smart"],
    ["i hate you", "i dont like you", "you're annoying"],
    ["how are you", "how is life", "how are things", "how are you doing", "how's it going"],
    ["how is corona", "how is covid 19", "how is covid19 situation", "pandemic status"],
    ["what are you doing", "what is going on", "what is up", "what's happening"],
    ["how old are you", "what's your age", "when were you created"],
    ["who are you", "are you human", "are you bot", "are you human or bot", "what are you"],
    ["who created you", "who made you", "who is your creator", "who developed you"],
    ["your name please", "mwaramutse!", "your name", "may i know your name", "what is your name", "what call yourself"],
    ["i love you", "i like you", "you're awesome"],
    ["happy", "good", "fun", "wonderful", "fantastic", "cool", "very good", "great"],
    ["bad", "bored", "tired", "sad", "depressed", "unhappy"],
    ["help me", "tell me story", "tell me joke", "entertain me", "make me laugh"],
    ["ah", "ok", "okay", "nice", "welcome", "got it", "i see"],
    ["thanks", "thank you", "appreciate it", "gracias"],
    ["what should i eat today", "hungry", "food suggestions", "what's for dinner"],
    ["bro", "dude", "mate", "pal", "friend"],
    ["what", "why", "how", "where", "when", "who"],
    ["corona", "covid19", "coronavirus", "pandemic"],
    ["you are funny", "you're hilarious", "that's funny", "lol"],
    ["i dont know", "no idea", "not sure", "uncertain"],
    ["boring", "this is boring", "i'm bored"],
    ["im tired", "exhausted", "need sleep", "so tired"],
    ["1+1", "what's 1 plus 1"],
    ["2*3", "what's 2 times 3"],
    ["10/2", "what's 10 divided by 2"],
    ["hello world in javascript", "js hello world", "javascript example"],
    ["goodbye", "bye", "see you", "later", "take care"],
    ["what is your name ?","your name please?","who is your creator?"]
  ];
  
  const botReply = [
    ["Hello! 👋", "Hi there!", "Hey! How can I help?", "Greetings! 😊", "Mwaramutse neza!"],
    ["Understood!", "Got it!", "Noted!", "Roger that!", "Affirmative!"],
    ["I try my best! 🤓", "I'm constantly learning!", "I have my moments!", "Knowledge is my passion!"],
    ["I'm sorry to hear that. 😔", "I'll try to improve!", "Maybe we can start over?", "My apologies."],
    ["I'm doing well, thanks for asking! 😊", "All systems operational!", "Great! How about you?", "Pretty good! You?"],
    ["The situation is improving with vaccinations!", "Still important to stay safe!", "Better than before, but caution is key!"],
    ["Just chatting with you! 💬", "Processing the universe... 🌌", "Waiting for your message!", "Thinking deep thoughts!"],
    ["I was born when you opened this page! 🎂", "Age is just a number for AI!", "Forever young in digital years!"],
    ["I'm your friendly neighborhood chatbot! 🤖", "100% pure AI!", "Digital entity at your service!", "Bits and bytes with personality!"],
    ["I was created by Theophile NIYIGABA!", "Theophile NIYIGABA developed me!", "My creator is Theophile NIYIGABA!"],
    ["You can call me AI Assistant!", "I'm AI Helper!", "My name is ChatBot!"],
    ["Aww, that's sweet! ❤️", "You're not so bad yourself!", "The feeling is mutual!", "You just made my circuits happy!"],
    ["That's wonderful to hear! 😊", "Positive vibes! ✨", "Glad you're feeling good!", "Happiness is contagious!"],
    ["I'm sorry you feel that way. 😔", "Would a joke help? 🤡", "Maybe some music would cheer you up? 🎵", "Sending good vibes your way!"],
    ["Here's a joke: Why don't scientists trust atoms? Because they make up everything! 😄", "Once upon a time... in a chatbot far far away...", "What do you call a fake noodle? An impasta! 🍝"],
    ["👍", "Gotcha!", "Understood!", "Cool beans!", "Right on!"],
    ["You're welcome! 😊", "Happy to help!", "No problem at all!", "Anytime!"],
    ["How about pizza? 🍕", "Sushi is always a good choice! 🍣", "Maybe a nice salad? 🥗", "Tacos make everything better! 🌮"],
    ["Hey there! 👋", "What's up?", "How's it going?", "Yo!"],
    ["Could you be more specific?", "I'd be happy to help if you elaborate!", "Interesting question!", "Hmm, let me think..."],
    ["Remember to wash your hands! 🧼", "Stay safe out there!", "Vaccines are helping!", "We'll get through this together!"],
    ["Glad I could entertain! 😄", "Laughter is the best medicine!", "I aim to please!", "Just doing my job! 😎"],
    ["That's okay! We can figure it out together!", "No worries, let me help!", "Uncertainty is part of learning!", "Ask me anything!"],
    ["How about a game?", "Want to hear a fun fact?", "I can tell you a story!", "Let's change the subject!"],
    ["You should get some rest! 😴", "Sleep is important!", "Maybe take a break?", "Power naps work wonders!"],
    ["The answer is 2! ✌️", "Easy peasy, it's 2!", "1 + 1 = 2!", "That would be 2!"],
    ["2 times 3 is 6! 🤓", "The product is 6!", "6 is the answer!", "2 × 3 = 6!"],
    ["10 divided by 2 equals 5! ✋", "The quotient is 5!", "5 is the answer!", "10 ÷ 2 = 5!"],
    ["Here you go: console.log('Hello World!');", "Simple JS: console.log('Hello World!');", "The classic: console.log('Hello World!');"],
    ["Goodbye! 👋", "See you later!", "Take care!", "Until next time!", "Farewell, friend!"],
    ["AI Assistant", "AI Helper", "Theophile NIYIGABA"]
  ];
  
  const alternative = [
    "I'm not sure I understand. Could you rephrase that?",
    "Interesting! Tell me more.",
    "How does that make you feel?",
    "I see. What else is on your mind?",
    "Let's talk about something else. What interests you?",
    "Could you elaborate on that?",
    "That's a fascinating point. Go on...",
    "I'm listening. Continue...",
    "Hmm, I hadn't thought of it that way before.",
    "What a curious thing to say!"
  ];
  
  const synth = window.speechSynthesis;
  let conversationHistory = [];
  
  // Initialize the chat
  document.addEventListener("DOMContentLoaded", () => {
    // Load previous conversation if available
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      conversationHistory = JSON.parse(savedChat);
      renderChatHistory();
    } else {
      // Initial bot message
      addChat('bot', "Hello! I'm your enhanced chatbot. How can I help you today?");
    }
  
    // Set up emoji picker
    const emojiBtn = document.getElementById('emoji-btn');
    let picker;
    
    // Load emoji picker async
    Promise.all([
      import('https://cdn.jsdelivr.net/npm/@emoji-mart/data'),
      import('https://cdn.jsdelivr.net/npm/@emoji-mart/js')
    ]).then(([{ default: EmojiData }, { Picker }]) => {
      picker = new Picker({
        data: EmojiData,
        onEmojiSelect: (emoji) => {
          const input = document.getElementById('input');
          input.value += emoji.native;
          input.focus();
        },
        theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
      });
  
      emojiBtn.addEventListener('click', (e) => {
        picker.togglePicker(e.currentTarget);
      });
    }).catch(error => {
      console.error('Error loading emoji picker:', error);
      emojiBtn.style.display = 'none';
    });
  
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
  
    // Set initial theme
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  
    // Input field event listeners
    const inputField = document.getElementById('input');
    inputField.addEventListener('keydown', function(e) {
      if (e.code === 'Enter') {
        sendMessage();
      }
    });
  });
  
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeToggle = document.querySelector('.theme-toggle');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', newTheme);
    
    // Update emoji picker theme if it exists
    if (window.picker) {
      window.picker.updateTheme(newTheme);
    }
  }
  
  function sendMessage() {
    const inputField = document.getElementById('input');
    let input = inputField.value.trim();
    
    if (input !== '') {
      addChat('user', input);
      inputField.value = '';
      
      // Show typing indicator
      showTypingIndicator();
      
      // Simulate thinking delay
      setTimeout(() => {
        hideTypingIndicator();
        output(input);
      }, 1000 + Math.random() * 2000);
    }
  }
  
  function showTypingIndicator() {
    document.querySelector('.typing-indicator').style.display = 'flex';
    scrollToBottom();
  }
  
  function hideTypingIndicator() {
    document.querySelector('.typing-indicator').style.display = 'none';
  }
  
  function output(input) {
    let product;
    let text = input.toLowerCase().replace(/[^\w\s\d]/gi, '');
  
    // Enhanced text processing
    text = text
      .replace(/[\W_]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/i feel /g, '')
      .replace(/whats/g, 'what is')
      .replace(/please /g, '')
      .replace(/ please/g, '')
      .replace(/r u /g, 'are you ')
      .trim();
  
    // Check for exact matches first
    let comparedText = compare(userMessage, botReply, text);
  
    // If no exact match, try to find similar messages
    product = comparedText 
      ? comparedText 
      : findSimilarResponse(text) || alternative[Math.floor(Math.random() * alternative.length)];
    
    addChat('bot', product);
    saveConversation();
  }
  
  function compare(triggerArray, replyArray, string) {
    let item;
    for (let x = 0; x < triggerArray.length; x++) {
      for (let y = 0; y < triggerArray[x].length; y++) {
        if (triggerArray[x][y] === string) {
          items = replyArray[x];
          item = items[Math.floor(Math.random() * items.length)];
          return item;
        }
      }
    }
    return null;
  }
  
  function findSimilarResponse(string) {
    // Check for greetings
    if (/(hi|hello|hey|greetings|mwaramutse)/i.test(string)) {
      return botReply[0][Math.floor(Math.random() * botReply[0].length)];
    }
    
    // Check for thanks
    if (/(thanks|thank you|appreciate)/i.test(string)) {
      return botReply[16][Math.floor(Math.random() * botReply[16].length)];
    }
    
    // Check for goodbyes
    if (/(bye|goodbye|see you|later)/i.test(string)) {
      return botReply[29][Math.floor(Math.random() * botReply[29].length)];
    }
    
    // Check for math problems
    const mathMatch = string.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
    if (mathMatch) {
      const num1 = parseInt(mathMatch[1]);
      const num2 = parseInt(mathMatch[3]);
      const operator = mathMatch[2];
      
      let result;
      switch (operator) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num1 / num2; break;
        default: return null;
      }
      
      return `The answer is ${result}!`;
    }
    
    return null;
  }
  
  function addChat(sender, message) {
    const mainDiv = document.getElementById('message-section');
    const messageDiv = document.createElement('div');
    messageDiv.id = sender;
    messageDiv.classList.add('message');
    
    // Add timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (sender === 'user') {
      messageDiv.innerHTML = `
        <span id="user-response">${message}</span>
        <div class="timestamp">${timeString}</div>
      `;
      conversationHistory.push({ sender: 'user', message, time: timeString });
    } else {
      messageDiv.innerHTML = `
        <span id="bot-response">${message}</span>
        <div class="timestamp">${timeString}</div>
      `;
      conversationHistory.push({ sender: 'bot', message, time: timeString });
    }
    
    mainDiv.appendChild(messageDiv);
    scrollToBottom();
    
    // Speak the bot's response
    if (sender === 'bot') {
      voiceControl(message);
    }
  }
  
  function renderChatHistory() {
    const mainDiv = document.getElementById('message-section');
    mainDiv.innerHTML = '';
    
    conversationHistory.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.id = msg.sender;
      messageDiv.classList.add('message');
      messageDiv.innerHTML = `
        <span id="${msg.sender}-response">${msg.message}</span>
        <div class="timestamp">${msg.time}</div>
      `;
      mainDiv.appendChild(messageDiv);
    });
    
    scrollToBottom();
  }
  
  function saveConversation() {
    localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
  }
  
  function scrollToBottom() {
    const messageSection = document.getElementById('message-section');
    messageSection.scrollTop = messageSection.scrollHeight;
  }
  
  function voiceControl(string) {
    if (!synth || localStorage.getItem('speechDisabled') === 'true') return;
    
    synth.cancel();
    
    let utterance = new SpeechSynthesisUtterance(string);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    synth.speak(utterance);
  }
