function setupAI() {
    const apiKeyInput = document.getElementById('api-key-input');
    apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        console.log("API Key entered: " + apiKey.substring(0, 5) + "..."); // Log first 5 characters of the key
        document.getElementById('setup-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
    } else {
        alert('Please enter a valid API key');
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage('You', message);
    userInput.value = '';

    console.log("Sending message to OpenAI..."); // Log before API call

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

        console.log("Received response from OpenAI"); // Log after API call
        const aiResponse = response.data.choices[0].message.content.trim();
        addMessage('Pierce AI', aiResponse);
    } catch (error) {
        console.error('Error:', error);
        addMessage('Pierce AI', 'Sorry, I encountered an error. Please check your API key and try again.');
    }
}
