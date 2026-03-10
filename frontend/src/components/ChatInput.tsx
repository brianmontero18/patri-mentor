import { useRef, useCallback } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const text = el.value.trim();
    if (!text || disabled) return;
    onSend(text);
    el.value = "";
    el.style.height = "auto";
  }, [onSend, disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  return (
    <div
      style={{
        flexShrink: 0,
        padding: "12px 16px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        borderTop: "1px solid rgba(43, 188, 179, 0.08)",
        background: "rgba(10, 26, 25, 0.95)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        <textarea
          ref={textareaRef}
          placeholder="¿Qué necesitás trabajar hoy?"
          rows={1}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          style={{
            flex: 1,
            resize: "none",
            padding: "12px 16px",
            background: "var(--color-bg-card)",
            border: "1px solid rgba(43, 188, 179, 0.12)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text)",
            fontSize: 15,
            lineHeight: 1.5,
            maxHeight: 120,
            transition: "border-color 0.2s",
            opacity: disabled ? 0.5 : 1,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(43, 188, 179, 0.35)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(43, 188, 179, 0.12)";
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled}
          aria-label="Enviar mensaje"
          style={{
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: disabled
              ? "rgba(43, 188, 179, 0.15)"
              : "var(--color-primary)",
            borderRadius: "var(--radius-md)",
            color: disabled ? "var(--color-text-muted)" : "#0A1A19",
            transition: "var(--transition)",
            flexShrink: 0,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
