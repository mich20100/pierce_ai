let apiKey = '';

function setupAI() {
    const apiKeyInput = document.getElementById('api-key-input');
    apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        console.log("API Key entered: " + apiKey.substring(0, 5) + "...");
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

    console.log("Attempting to send message to OpenAI...");

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{"role": "user", "content": message}],
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received response from OpenAI:", data);

        const aiResponse = data.choices[0].message.content.trim();
        addMessage('Pierce AI', aiResponse);
    } catch (error) {
        console.error('Error details:', error);
        addMessage('Pierce AI', 'Sorry, I encountered an error. Please check the console for details.');
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

console.log("Script loaded successfully");
