import { useState, useRef, useCallback, useEffect } from "react";
import type { ChatMessage } from "../types";
import { streamChat } from "../api";
import { MessageBubble } from "./MessageBubble";
import { QuickActions } from "./QuickActions";
import { ChatInput } from "./ChatInput";
import { MenuDrawer } from "./MenuDrawer";

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hola. Soy Patri. Bienvenido a este espacio.\n\nAcá no venimos a quejarnos ni a buscar que alguien nos diga lo que queremos escuchar. Venimos a trabajar de verdad. Yo te voy a devolver lo que veo, sin edulcorar, porque te quiero bien — no te quiero cómodo.\n\nAsí que contame: ¿qué es lo que te está frenando? ¿Qué es eso que sabés que tenés que resolver y seguís pateando para adelante?",
};

export function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const abortRef = useRef<(() => void) | null>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el && !userScrolledRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    userScrolledRef.current = !atBottom;
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (isStreaming) return;
      setError(null);
      setShowQuickActions(false);

      const userMsg: ChatMessage = { role: "user", content: text };
      const allMessages = [...messages, userMsg];

      setMessages(allMessages);
      setIsStreaming(true);
      userScrolledRef.current = false;

      const assistantMsg: ChatMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMsg]);

      const cancel = streamChat(
        allMessages,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk,
              };
            }
            return updated;
          });
        },
        () => setIsStreaming(false),
        (err) => {
          setIsStreaming(false);
          setError(err.message);
          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length && updated[updated.length - 1].role === "assistant" && !updated[updated.length - 1].content) {
              updated.pop();
            }
            return updated;
          });
        },
      );

      cancel.then((abort) => {
        abortRef.current = abort;
      });
    },
    [isStreaming, messages],
  );

  const handleNewSession = useCallback(() => {
    abortRef.current?.();
    setMessages([WELCOME_MESSAGE]);
    setIsStreaming(false);
    setError(null);
    setShowQuickActions(true);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      const withoutLastAssistant = messages.filter(
        (_, i) => i < messages.length - 1 || messages[i].role !== "assistant",
      );
      setMessages(withoutLastAssistant);
      setTimeout(() => sendMessage(lastUser.content), 100);
    }
  }, [messages, sendMessage]);

  return (
    <>
      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNewSession={handleNewSession}
      />

      {/* Header — teal background, white logo (matching Patri's real brand) */}
      <header
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "linear-gradient(135deg, #1A9E96 0%, #2BBCB3 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span
              style={{
                fontFamily: "var(--font-logo)",
                fontSize: 24,
                color: "#FFFFFF",
                lineHeight: 1.1,
              }}
            >
              Patri
            </span>
            <span
              style={{
                fontFamily: "var(--font-brand)",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.3em",
                color: "rgba(255, 255, 255, 0.85)",
                textTransform: "uppercase" as const,
                marginTop: -1,
              }}
            >
              ROBIANO
            </span>
          </div>
          {isStreaming && (
            <span
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.7)",
                animation: "pulseGlow 1.5s ease-in-out infinite",
              }}
            >
              Patri está leyendo...
            </span>
          )}
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--radius-sm)",
            color: "rgba(255, 255, 255, 0.8)",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          padding: "24px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max-width)",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
            />
          ))}

          {showQuickActions && messages.length === 1 && (
            <QuickActions onSelect={sendMessage} />
          )}

          {error && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 8,
                padding: "12px 16px",
                background: "rgba(232, 93, 93, 0.08)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(232, 93, 93, 0.15)",
                animation: "fadeIn 0.3s ease-out both",
              }}
            >
              <span style={{ fontSize: 14, color: "var(--color-accent-warm)" }}>
                Algo falló, pero no te preocupes. Volvé a intentar.
              </span>
              <button
                onClick={handleRetry}
                style={{
                  padding: "6px 16px",
                  fontSize: 13,
                  color: "var(--color-primary)",
                  background: "rgba(43, 188, 179, 0.1)",
                  borderRadius: 6,
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(43, 188, 179, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(43, 188, 179, 0.1)";
                }}
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </>
  );
}
