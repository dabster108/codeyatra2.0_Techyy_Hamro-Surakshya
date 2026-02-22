"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  ChevronRight,
  Radio,
  ShieldCheck,
  AlertTriangle,
  Brain,
  Phone,
  DollarSign,
  Shield,
  ArrowRight,
  Globe,
  Zap,
} from "lucide-react";

const QUICK_PROMPTS = [
  {
    label: "Earthquake safety",
    prompt:
      "What should I do during an earthquake? Give me step-by-step safety tips.",
    icon: AlertTriangle,
  },
  {
    label: "Relief fund",
    prompt: "How does the disaster relief fund work in Nepal? Who manages it?",
    icon: DollarSign,
  },
  {
    label: "Emergency numbers",
    prompt: "What are the emergency numbers in Nepal?",
    icon: Phone,
  },
  {
    label: "AI predictions",
    prompt: "How does Hamro Suraksha use AI to predict disasters?",
    icon: Brain,
  },
  {
    label: "SOS system",
    prompt: "How does the SOS emergency system work in Hamro Suraksha?",
    icon: Radio,
  },
  {
    label: "Flood safety",
    prompt: "Show me flood safety tips and precautions for Nepal.",
    icon: ShieldCheck,
  },
];

const CAPABILITIES = [
  {
    icon: AlertTriangle,
    label: "Safety Protocols",
    desc: "Earthquake, flood, landslide, fire — step-by-step emergency procedures",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    prompt:
      "Explain the key safety protocols for the most common disasters in Nepal.",
  },
  {
    icon: Phone,
    label: "Emergency Info",
    desc: "Hotlines, nearby shelters, evacuation routes & rescue contacts",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    prompt:
      "What are all emergency contacts and helplines available in Nepal for disaster situations?",
  },
  {
    icon: ShieldCheck,
    label: "Relief Tracking",
    desc: "Fund status, donation transparency, NGO & government updates",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    prompt:
      "How does disaster relief fund tracking work in Nepal? How can ordinary citizens verify it?",
  },
  {
    icon: Brain,
    label: "Risk Analysis",
    desc: "AI-powered disaster risk predictions explained in plain language",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    prompt:
      "How does the AI disaster risk prediction system work and how accurate is it?",
  },
];

const EMERGENCY_NUMBERS = [
  { name: "Nepal Police", num: "100" },
  { name: "Fire Brigade", num: "101" },
  { name: "Ambulance", num: "102" },
  { name: "NDRRMA", num: "1155" },
];

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function MsgContent({ content }) {
  const lines = content.split("\n");
  const elements = [];
  let bulletGroup = [];

  const flushBullets = () => {
    if (bulletGroup.length === 0) return;
    elements.push(
      <ul key={`b-${elements.length}`} className="my-1.5 space-y-1.5 pl-1">
        {bulletGroup.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>,
    );
    bulletGroup = [];
  };

  lines.forEach((line, i) => {
    const bulletMatch = line.match(/^[\*\-]\s+(.+)/);
    if (bulletMatch) {
      bulletGroup.push(bulletMatch[1]);
    } else {
      flushBullets();
      if (line.trim() === "") {
        elements.push(<div key={i} className="h-1" />);
      } else {
        elements.push(
          <p key={i} className="leading-relaxed">
            {renderInline(line)}
          </p>,
        );
      }
    }
  });
  flushBullets();

  return <div className="space-y-0.5 text-sm">{elements}</div>;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const userScrolledUp = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll to bottom when messages update, but only if the user
  // hasn't manually scrolled up to read previous messages.
  useEffect(() => {
    if (!userScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  // Track whether the user has scrolled away from the bottom.
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    // Consider "near bottom" within 80px
    userScrolledUp.current =
      el.scrollHeight - el.scrollTop - el.clientHeight > 80;
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = async (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;

    // Always scroll to bottom when the user sends a message
    userScrolledUp.current = false;
    const updated = [...messages, { role: "user", content: userMsg }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();

      const reply =
        data.choices?.[0]?.message?.content ||
        (data.error
          ? `⚠ Error: ${data.error.message}`
          : "⚠ Unexpected response. Please try again.");

      setMessages([...updated, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "⚠ Network error. Check your connection and try again.",
        },
      ]);
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

  const isChat = messages.length > 0;

  return (
    <div
      className={`flex flex-col bg-white transition-all duration-700 ease-out ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {/* ── TOP BAR ── */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 shadow-sm">
              <Bot className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide text-gray-900">
                Disaster Emergency Assistant
              </h1>
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-mono text-emerald-600">
                  Online
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Emergency number pills — desktop only */}
            <div className="hidden sm:flex items-center gap-1.5">
              {EMERGENCY_NUMBERS.map((e) => (
                <a
                  key={e.num}
                  href={`tel:${e.num}`}
                  title={e.name}
                  className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-red-600 hover:bg-red-100 transition-colors"
                >
                  {e.name.split(" ")[0]} {e.num}
                </a>
              ))}
            </div>
            {isChat && (
              <button
                onClick={() => setMessages([])}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        {!isChat ? (
          /* ── HOME SCREEN ── */
          <div className="mx-auto max-w-4xl px-4 pt-14 pb-12 sm:px-6">
            {/* Hero */}
            <div
              className={`mb-12 text-center transition-all duration-700 ease-out delay-100 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 shadow-sm">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                Smart Disaster &amp; Safety
                <br />
                <span className="text-emerald-600">Intelligence Assistant</span>
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
                AI-powered emergency guidance for Nepal&apos;s 77 districts. Ask
                about safety protocols, relief funds, evacuation routes, or any
                disaster-related question.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-mono text-slate-500 shadow-sm">
                  <Globe className="h-3 w-3 text-blue-500" /> 77 Districts
                  Coverage
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-mono text-slate-500 shadow-sm">
                  <Zap className="h-3 w-3 text-amber-500" /> Real-Time Guidance
                </span>
              </div>
            </div>

            {/* Quick prompts */}
            <div
              className={`mb-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm transition-all duration-700 ease-out delay-[350ms] ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <p className="mb-4 text-[11px] font-mono font-bold tracking-[0.15em] text-slate-400">
                QUICK PROMPTS
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {QUICK_PROMPTS.map(({ label, prompt, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(prompt)}
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                    </span>
                    <span className="flex-1 text-xs text-slate-600 group-hover:text-slate-900 transition-colors">
                      {prompt}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── CHAT VIEW ── */
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 flex-none items-center justify-center rounded-xl shadow-sm ${
                      msg.role === "assistant" ? "bg-slate-100" : "bg-gray-900"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "rounded-br-md bg-gray-900 text-white"
                        : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <MsgContent content={msg.content} />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">
                        {msg.content}
                      </div>
                    )}
                    <p className="mt-2 text-[10px] font-mono text-slate-400">
                      {msg.role === "assistant" ? "AI Assistant" : "You"}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-end gap-2.5">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-slate-100 shadow-sm">
                    <Bot className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                    <TypingDots />
                    <p className="mt-1 text-[10px] font-mono text-slate-400">
                      AI Assistant is thinking...
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Scroll sentinel — auto-scroll targets this */}
            <div ref={bottomRef} className="h-px" />
          </div>
        )}
      </div>

      {/* ── INPUT AREA ── */}
      <div className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          {/* Quick prompt chips when in chat mode */}
          {isChat && (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_PROMPTS.slice(0, 4).map(({ label, prompt }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="flex-shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] text-slate-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors disabled:opacity-40"
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm focus-within:border-emerald-400 focus-within:bg-white focus-within:shadow-md transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about disaster safety, emergency procedures, relief tracking, evacuation routes..."
                rows={1}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="flex h-[44px] w-[44px] flex-none items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md transition-all hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            For real emergencies call{" "}
            <a
              href="tel:100"
              className="text-red-500 hover:underline font-semibold"
            >
              100
            </a>{" "}
            or{" "}
            <a
              href="tel:1155"
              className="text-red-500 hover:underline font-semibold"
            >
              1155
            </a>
          </p>

          {/* ── CAPABILITY CARDS (home screen only, below send button) ── */}
          {!isChat && (
            <div
              className={`mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-700 ease-out delay-[450ms] ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {CAPABILITIES.map((cap) => (
                <button
                  key={cap.label}
                  onClick={() => sendMessage(cap.prompt)}
                  className="group flex flex-col items-start rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                >
                  <div
                    className={`mb-2.5 inline-flex rounded-lg ${cap.bg} border ${cap.border} p-2`}
                  >
                    <cap.icon className={`h-4 w-4 ${cap.color}`} />
                  </div>
                  <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {cap.label}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                    {cap.desc}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ask now <ChevronRight className="h-3 w-3" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
