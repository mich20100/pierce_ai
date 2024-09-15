let apiKey = '';

function setupAI() {
    const apiKeyInput = document.getElementById('api-key-input');
    apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        document.getElementById('setup-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
    } else {
        alert('Please enter a valid API key');
    }
}

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage('You', message);
    userInput.value = '';

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": message}],
            max_tokens: 150,
            n: 1,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data.choices[0].message.content.trim();
        addMessage('Pierce AI', aiResponse);
    } catch (error) {
        console.error('Error:', error);
        addMessage('Pierce AI', 'Sorry, I encountered an error. Please check your API key and try again.');
    }
}

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'You' ? 'user-message' : 'ai-message');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});