/**
 * Fetches a response from Groq's language model.
 * @param {Array} messages - Array of message objects: {role: 'user'|'assistant', content: string}
 * @returns {Promise<string>} - The AI's response text
 */
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function fetchGroqResponse(messages) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API key not set. Add VITE_GROQ_API_KEY to your .env file.');
  }
  const body = {
    model: 'llama-3.1-8b-instant', // You can change to another Groq-supported model
    messages,
    max_tokens: 512,
    temperature: 0.7,
  };
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let errorText = response.statusText;
    try {
      const errorData = await response.json();
      errorText += ' | ' + (errorData.error?.message || JSON.stringify(errorData));
    } catch {}
    throw new Error('Groq API error: ' + errorText);
  }
  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}