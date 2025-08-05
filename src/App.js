import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); // array of {role: 'user'|'bot', text: string}
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    // Add user message
    setMessages((msgs) => [...msgs, { role: 'user', text: prompt }]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3001/generate', { prompt });
      const botResponse = res.data.response || 'No response';

      setMessages((msgs) => [...msgs, { role: 'bot', text: botResponse }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: 'bot', text: '⚠️ Error: ' + err.message }]);
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', height: '90vh', border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
      <h2 style={{ textAlign: 'center' }}>🧠 Local Chat with Mistral</h2>
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                backgroundColor: m.role === 'user' ? '#007bff' : '#e5e5ea',
                color: m.role === 'user' ? 'white' : 'black',
                padding: '10px 14px',
                borderRadius: 20,
                maxWidth: '75%',
                whiteSpace: 'pre-wrap',
                fontSize: 15,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <textarea
        rows={3}
        style={{ width: '100%', fontSize: 16, marginTop: 10, borderRadius: 4, padding: 10, resize: 'none' }}
        placeholder="Type your question... (Shift+Enter for newline)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={loading}
      />
      <button
        onClick={handleSend}
        disabled={loading || !prompt.trim()}
        style={{
          marginTop: 10,
          padding: '10px 20px',
          fontSize: 16,
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Thinking...' : 'Send'}
      </button>
    </div>
  );
}

export default App;

