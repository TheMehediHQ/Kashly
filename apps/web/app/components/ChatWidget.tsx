"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "assistant";
  content: string;
  timestamp: Date;
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-msg",
  role: "model",
  content:
    "👋 **Hello! I'm your Kashly Financial Assistant.**\n\nI can help you analyze spending, create category budgets, explain financial strategies (like the 50/30/20 rule), or guide you through Kashly features.\n\nHow can I help you take control of your finances today?",
  timestamp: new Date(),
};

const SUGGESTED_PROMPTS = [
  "💡 How do I set up a budget in Kashly?",
  "📊 Explain the 50/30/20 budgeting rule",
  "💰 How do I reduce my monthly expenses?",
  "💳 What's the best way to build an emergency fund?",
];

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-1.5" />;

        // Horizontal divider
        if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
          return <hr key={lineIdx} className="border-zinc-800 my-2" />;
        }

        // Markdown Headings (###, ##, #)
        if (trimmed.startsWith("#### ")) {
          return (
            <h5 key={lineIdx} className="text-white font-semibold text-xs tracking-wide uppercase mt-2 mb-1">
              {formatInline(trimmed.slice(5))}
            </h5>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={lineIdx} className="text-white font-bold text-sm tracking-wide mt-2.5 mb-1 flex items-center gap-1.5">
              {formatInline(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={lineIdx} className="text-white font-bold text-base tracking-wide mt-3 mb-1.5">
              {formatInline(trimmed.slice(3))}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={lineIdx} className="text-[#1FBFD8] font-bold text-base tracking-wide mt-3.5 mb-2">
              {formatInline(trimmed.slice(2))}
            </h2>
          );
        }

        // Bullet lists (*, -, •)
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const itemText = trimmed.slice(2);
          return (
            <div key={lineIdx} className="flex items-start space-x-2 pl-1 my-0.5">
              <span className="text-[#1FBFD8] font-bold mt-1 text-xs">•</span>
              <span className="flex-1 text-zinc-200">{formatInline(itemText)}</span>
            </div>
          );
        }

        // Numbered lists (e.g. 1. Step title)
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={lineIdx} className="flex items-start space-x-2 pl-1 mt-1.5 mb-0.5">
              <span className="text-[#1FBFD8] font-bold text-xs mt-0.5">
                {numberedMatch[1]}.
              </span>
              <span className="flex-1 font-medium text-white">
                {formatInline(numberedMatch[2])}
              </span>
            </div>
          );
        }

        // Regular paragraph
        return <p key={lineIdx} className="text-zinc-300">{formatInline(line)}</p>;
      })}
    </div>
  );
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-xs text-[#1FBFD8]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom("auto");
      setHasUnread(false);
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isLoading) return;

    setError(null);
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const apiEndpoint = process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/chat`
        : "/api/chat";

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, history }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to receive a response from AI.");
      }

      const botMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: data.reply || "No response received.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      if (!isOpen) setHasUnread(true);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
      if (window.innerWidth > 640) {
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([{ ...INITIAL_WELCOME_MESSAGE, timestamp: new Date() }]);
    setError(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ── Chat Modal ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Kashly AI Chatbot"
          className={`
            fixed sm:absolute bottom-0 right-0 sm:bottom-16 sm:right-0
            w-full sm:w-[420px] h-[85vh] sm:h-[600px] sm:max-h-[82vh]
            flex flex-col
            bg-[#09090b] text-zinc-100
            border border-zinc-800/90 sm:rounded-2xl
            shadow-2xl shadow-black/80
            backdrop-blur-md overflow-hidden
            animate-in fade-in zoom-in-95 duration-200
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-800/80 bg-zinc-950/80">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1FBFD8] to-cyan-400 text-zinc-950 shadow-md shadow-[#1FBFD8]/20">
                <Sparkles className="w-5 h-5 fill-current" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#09090b]" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Kashly AI
                  </h3>
                  <span className="rounded bg-[#1FBFD8]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#1FBFD8] border border-[#1FBFD8]/20">
                    Gemini Flash
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Smart Personal Finance Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 rounded-lg transition-colors cursor-pointer"
                aria-label="Clear chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 rounded-lg transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-[#1FBFD8] border border-zinc-700/60 mb-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[84%] rounded-2xl px-4 py-3 text-sm
                      ${
                        isUser
                          ? "bg-[#1FBFD8] text-zinc-950 font-medium rounded-br-xs shadow-md shadow-[#1FBFD8]/10"
                          : "bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-bl-xs shadow-sm"
                      }
                    `}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed select-text">
                        {message.content}
                      </p>
                    ) : (
                      <MarkdownRenderer content={message.content} />
                    )}

                    <div
                      className={`text-[10px] mt-1.5 flex justify-end font-normal ${
                        isUser ? "text-zinc-800/80" : "text-zinc-500"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {isUser && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 border border-zinc-700/60 mb-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick suggested prompt pills */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2">
                <p className="text-[11px] font-medium text-zinc-400 mb-2 px-1">
                  Suggested topics:
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-xs bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/80 hover:border-[#1FBFD8]/40 rounded-xl px-3 py-2 transition-all cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing state */}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-[#1FBFD8] border border-zinc-700/60 mb-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl rounded-bl-xs px-4 py-3 shadow-sm flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1FBFD8] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#1FBFD8] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#1FBFD8] animate-bounce" />
                  </div>
                  <span className="text-xs text-zinc-400 pl-1">
                    Kashly AI is thinking...
                  </span>
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2 bg-red-950/40 border border-red-800/50 rounded-xl p-3 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-200">Error</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/90">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Kashly AI anything... (Enter to send)"
                  rows={1}
                  disabled={isLoading}
                  className="w-full resize-none rounded-xl bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-800 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1FBFD8] focus:border-[#1FBFD8] transition-colors disabled:opacity-50"
                  style={{ maxHeight: "120px" }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                title="Send message"
                className={`
                  flex items-center justify-center w-10 h-10 rounded-xl transition-all cursor-pointer flex-shrink-0
                  ${
                    inputValue.trim() && !isLoading
                      ? "bg-[#1FBFD8] hover:bg-[#1bb0c7] text-zinc-950 shadow-md shadow-[#1FBFD8]/20"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60"
                  }
                `}
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between px-1">
              <span className="text-[10px] text-zinc-500">
                Shift + Enter for new line
              </span>
              <span className="text-[10px] text-zinc-500">
                Powered by Gemini Gemini Flash
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Toggle Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
        aria-expanded={isOpen}
        className={`
          relative flex items-center justify-center
          w-14 h-14 rounded-full
          bg-[#1FBFD8] hover:bg-[#1bb0c7] text-zinc-950
          shadow-lg shadow-[#1FBFD8]/30
          transition-transform hover:scale-105 active:scale-95 duration-200
          cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1FBFD8]/60 focus:ring-offset-2 focus:ring-offset-[#09090b]
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform rotate-0 duration-200" />
        ) : (
          <MessageSquare className="w-6 h-6 transition-transform rotate-0 duration-200" />
        )}

        {/* Unread indicator */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#1FBFD8] ring-2 ring-[#09090b]" />
          </span>
        )}
      </button>
    </div>
  );
}
