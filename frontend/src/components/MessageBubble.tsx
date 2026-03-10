import type { ChatMessage } from "../types";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          animation: "fadeIn 0.3s ease-out both",
        }}
      >
        <div
          style={{
            maxWidth: "80%",
            padding: "12px 16px",
            background: "var(--color-user-bubble)",
            borderRadius: "var(--radius-lg) var(--radius-lg) 4px var(--radius-lg)",
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--color-text)",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        animation: "fadeIn 0.3s ease-out both",
        paddingRight: "12%",
      }}
    >
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.75,
          color: "var(--color-text)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {message.content}
        {isStreaming && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 18,
              background: "var(--color-primary)",
              marginLeft: 2,
              verticalAlign: "text-bottom",
              animation: "pulseGlow 1s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}
