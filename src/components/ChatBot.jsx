import React, { useState } from "react";

// Helper to convert filtered data to CSV for the AI prompt
function arrayToCSV(arr) {
  if (!arr.length) return "";
  const keys = Object.keys(arr[0]);
  const lines = arr.map(row => keys.map(k => row[k]).join(","));
  return [keys.join(","), ...lines].join("\n");
}

const systemPrompt = `
You are an expert MLB draft data assistant. 
You answer questions using the provided draft data (as CSV rows).
If a user asks a question, filter and analyze the data as needed, and give a clear, concise answer.
If the user asks a follow-up, use the previous context.
`;

async function askOpenAI(question, filteredData) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const prompt = `
${systemPrompt}
Here is the filtered draft data (CSV format):
${arrayToCSV(filteredData).slice(0, 10000)}

User question: ${question}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.2,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Sorry, I couldn't get an answer.";
}

export default function ChatBot({ filteredData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    const answer = await askOpenAI(input, filteredData);
    setMessages((msgs) => [...msgs, { role: "user", content: input }, { role: "assistant", content: answer }]);
    setInput("");
    setLoading(false);
  };

  return (
    <div style={{ background: "#111", color: "#fff", padding: 20, borderRadius: 8, maxWidth: 600, margin: "2rem auto" }}>
      <h2>Ask the MLB Draft AI Bot</h2>
      <div style={{ minHeight: 120, marginBottom: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ color: msg.role === "user" ? "#0af" : "#0f0", margin: "8px 0" }}>
            <b>{msg.role === "user" ? "You" : "Bot"}:</b> {msg.content}
          </div>
        ))}
        {loading && <div style={{ color: "#aaa" }}>Thinking...</div>}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Ask a draft question..."
        style={{ width: "80%", padding: 8, marginRight: 8 }}
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading || !input.trim()}>
        Send
      </button>
    </div>
  );
}