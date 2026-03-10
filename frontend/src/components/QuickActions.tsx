interface QuickActionsProps {
  onSelect: (text: string) => void;
}

const SUGGESTIONS = [
  "Estoy estancado y no sé por qué",
  "Quiero manifestar algo pero no me sale",
  "Tengo un vínculo que me drena",
];

export function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        padding: "8px 0",
        animation: "fadeIn 0.6s ease-out 0.4s both",
      }}
    >
      {SUGGESTIONS.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          style={{
            padding: "8px 16px",
            fontSize: 13,
            color: "var(--color-primary)",
            background: "rgba(43, 188, 179, 0.08)",
            border: "1px solid rgba(43, 188, 179, 0.2)",
            borderRadius: 20,
            cursor: "pointer",
            transition: "var(--transition)",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(43, 188, 179, 0.15)";
            e.currentTarget.style.borderColor = "rgba(43, 188, 179, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(43, 188, 179, 0.08)";
            e.currentTarget.style.borderColor = "rgba(43, 188, 179, 0.2)";
          }}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
