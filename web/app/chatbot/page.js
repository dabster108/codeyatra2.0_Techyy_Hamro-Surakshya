"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send, Bot, User, Loader2, MessageSquare, Trash2,
  Radio, ShieldCheck, AlertTriangle, Brain,
} from "lucide-react";

const QUICK_PROMPTS = [
  "What should I do during an earthquake?",
  "How does the relief fund work?",
  "What are emergency numbers in Nepal?",
  "How does AI predict disasters?",
  "What is the SOS system?",
  "Show me flood safety tips",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      if (data.choices?.[0]?.message?.content) {
        setMessages([...newMessages, { role: "assistant", content: data.choices[0].message.content }]);
      } else if (data.error) {
        setMessages([...newMessages, { role: "assistant", content: `⚠ Error: ${data.error.message || "Request failed. Check API key."}` }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "⚠ Unexpected response. Please try again." }]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "⚠ Network error. Check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col bg-background cmd-grid">
      {/* Header */}
      <div className="border-b border-border bg-[#0d1117]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border border-emerald-500/30 bg-emerald-500/10">
              <Bot className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">AI DISASTER ASSISTANT</h1>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-mono text-emerald-400">ONLINE — GROQ LLM</span>
              </div>
            </div>
          </div>
          <button onClick={() => setMessages([])}
            className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-[10px] font-mono tracking-wider text-muted hover:border-red-500/30 hover:text-red-400 transition-colors">
            <Trash2 className="h-3 w-3" /> CLEAR
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center border border-emerald-500/20 bg-emerald-500/5 mb-6">
                <Brain className="h-8 w-8 text-emerald-500/50" />
              </div>
              <h2 className="text-lg font-bold text-white">Disaster-Aware AI Assistant</h2>
              <p className="mt-2 max-w-md text-center text-xs text-muted leading-relaxed">
                Ask about safety protocols, evacuation procedures, relief fund status,
                emergency contacts, or any disaster-related questions about Nepal.
              </p>

              {/* Capabilities */}
              <div className="mt-8 grid w-full max-w-lg grid-cols-2 gap-px bg-border">
                {[
                  { icon: AlertTriangle, label: "Safety Protocols", desc: "Earthquake, flood, landslide" },
                  { icon: Radio, label: "Emergency Info", desc: "Numbers, shelters, routes" },
                  { icon: ShieldCheck, label: "Relief Tracking", desc: "Fund status & transparency" },
                  { icon: Brain, label: "Risk Analysis", desc: "AI predictions explained" },
                ].map((cap) => (
                  <div key={cap.label} className="bg-[#0d1117] p-4">
                    <cap.icon className="h-4 w-4 text-emerald-500 mb-2" />
                    <p className="text-xs font-bold text-white">{cap.label}</p>
                    <p className="text-[10px] text-muted">{cap.desc}</p>
                  </div>
                ))}
              </div>

              {/* Quick prompts */}
              <div className="mt-8 w-full max-w-lg">
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-muted">QUICK PROMPTS</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((p) => (
                    <button key={p} onClick={() => sendMessage(p)}
                      className="border border-border bg-[#0d1117] px-3 py-2 text-xs text-gray-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors text-left">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 flex-none items-center justify-center border border-emerald-500/30 bg-emerald-500/10">
                      <Bot className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                  )}
                  <div className={`max-w-[75%] border p-4 text-sm leading-relaxed
                    ${msg.role === "user"
                      ? "border-border bg-surface text-white"
                      : "border-emerald-500/10 bg-emerald-500/5 text-gray-300"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 flex-none items-center justify-center border border-border bg-surface">
                      <User className="h-3.5 w-3.5 text-muted" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 flex-none items-center justify-center border border-emerald-500/30 bg-emerald-500/10">
                    <Bot className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="border border-emerald-500/10 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span className="font-mono">Processing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-[#0d1117]">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 border border-border bg-background focus-within:border-emerald-500/50 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about disaster safety, emergency procedures, relief tracking..."
                rows={1}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm text-white placeholder:text-muted/50 focus:outline-none"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
            </div>
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="flex h-[44px] w-[44px] flex-none items-center justify-center bg-emerald-600 text-white transition-all hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[10px] font-mono text-muted/50">
            Powered by Groq LLM — Responses are AI-generated. For real emergencies, call 100 or 1155.
          </p>
        </div>
      </div>
    </div>
  );
}
