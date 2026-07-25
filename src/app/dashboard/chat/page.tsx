"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Mic,
  MicOff,
  Trash2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useProjectStore } from "@/store/projectStore";
import { useChatStore } from "@/store/chatStore";

const suggestions = [
  "Summarize my PRD",
  "Generate user stories for the main features",
  "Suggest KPIs for this product",
  "What are the main risks?",
  "Create a competitive analysis",
  "Suggest sprint planning approach",
];

export default function ChatPage() {
  const { activeProject } = useProjectStore();
  const { messages, addMessage, setStreaming, isStreaming, clearMessages } =
    useChatStore();
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || isStreaming) return;

    const userMessage = {
      id: Date.now().toString(),
      project_id: activeProject?.id || "",
      role: "user" as const,
      content: messageText,
      created_at: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput("");
    setStreaming(true);

    try {
      const allMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: messageText },
      ];

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages,
          projectId: activeProject?.id,
        }),
      });

      const json = await res.json();

      if (json.success) {
        addMessage({
          id: (Date.now() + 1).toString(),
          project_id: activeProject?.id || "",
          role: "assistant",
          content: json.data.response,
          created_at: new Date().toISOString(),
        });
      } else {
        addMessage({
          id: (Date.now() + 1).toString(),
          project_id: activeProject?.id || "",
          role: "assistant",
          content: `Sorry, I encountered an error: ${json.error}`,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(err);
      addMessage({
        id: (Date.now() + 1).toString(),
        project_id: activeProject?.id || "",
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        created_at: new Date().toISOString(),
      });
    } finally {
      setStreaming(false);
    }
  }

  function toggleVoiceInput() {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput((prev) => prev + " " + transcript);
    };

    recognition.start();
    setTimeout(() => {
      recognition.stop();
      setIsListening(false);
    }, 30000);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        width: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            className="font-serif"
            style={{ fontSize: "42px", fontWeight: 500, marginBottom: "8px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "16px" }}
          >
            <MessageSquare size={38} color="#facc15" />
            AI Product Assistant
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            {activeProject
              ? `Chatting about: ${activeProject.name}`
              : "Chat with AI about your product"}
          </p>
        </div>

        {messages.length > 0 && (
          <button onClick={clearMessages} className="btn-ghost">
            <Trash2 size={16} /> Clear Chat
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div
        className="glass-card-static"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "20px",
                  background: "var(--gradient-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="animate-pulse-glow"
              >
                <Bot size={36} color="#09090b" />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: "24px",
                    fontWeight: 500,
                    marginBottom: "8px",
                    color: "var(--text-primary)",
                  }}
                >
                  How can I help you today?
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    maxWidth: "400px",
                  }}
                >
                  I can analyze your PRD, suggest improvements, generate user
                  stories, and more.
                </p>
              </div>

              {/* Suggestion chips */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  justifyContent: "center",
                  maxWidth: "600px",
                }}
              >
                {suggestions.map((s) => (
                  <span
                    key={s}
                    onClick={() => handleSend(s)}
                    className="suggestion-chip"
                    style={{
                      padding: "8px 16px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "9999px",
                      display: "inline-block",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="animate-fade-in"
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    flexDirection:
                      msg.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      minWidth: "32px",
                      borderRadius: "8px",
                      background:
                        msg.role === "user"
                          ? "var(--bg-tertiary)"
                          : "var(--gradient-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {msg.role === "user" ? (
                      <User size={16} color="var(--text-secondary)" />
                    ) : (
                      <Sparkles size={16} color="white" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "14px 18px",
                      borderRadius: "14px",
                      background:
                        msg.role === "user"
                          ? "rgba(250, 204, 21, 0.15)"
                          : "var(--bg-tertiary)",
                      border:
                        msg.role === "user"
                          ? "1px solid rgba(250, 204, 21, 0.3)"
                          : "1px solid var(--border-default)",
                      borderTopRightRadius:
                        msg.role === "user" ? "4px" : "14px",
                      borderTopLeftRadius:
                        msg.role === "user" ? "14px" : "4px",
                    }}
                  >
                    <div className="markdown-content" style={{ fontSize: "14px" }}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        marginTop: "6px",
                        textAlign: msg.role === "user" ? "right" : "left",
                      }}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming indicator */}
              {isStreaming && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      minWidth: "32px",
                      borderRadius: "8px",
                      background: "var(--gradient-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles size={16} color="white" />
                  </div>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: "14px",
                      borderTopLeftRadius: "4px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <div className="ai-thinking">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border-default)",
            display: "flex",
            gap: "12px",
            alignItems: "flex-end",
          }}
        >
          <button
            onClick={toggleVoiceInput}
            style={{
              width: "40px",
              height: "40px",
              minWidth: "40px",
              borderRadius: "10px",
              border: "none",
              background: isListening
                ? "rgba(239, 68, 68, 0.2)"
                : "var(--bg-tertiary)",
              color: isListening ? "#ef4444" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--transition-fast)",
            }}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "Listening..."
                : 'Ask anything about your product... (e.g., "Suggest KPIs")'
            }
            className="input-field"
            style={{
              flex: 1,
              minHeight: "40px",
              maxHeight: "120px",
              resize: "none",
              padding: "10px 16px",
            }}
            rows={1}
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            className="btn-gold-pill"
            style={{
              width: "42px",
              height: "42px",
              minWidth: "42px",
              padding: 0,
              justifyContent: "center",
              borderRadius: "50%",
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
