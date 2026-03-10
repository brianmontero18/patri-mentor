interface LandingProps {
  onStart: () => void;
}

function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={`sparkle ${className ?? ""}`}
      style={{ ...style }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z"
        fill="rgba(255, 255, 255, 0.9)"
      />
    </svg>
  );
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        gap: 0,
        position: "relative",
        minHeight: 0,
        background: "linear-gradient(170deg, #1A9E96 0%, #2BBCB3 40%, #1A8F88 100%)",
      }}
    >
      <div style={{ position: "absolute", top: "15%", right: "15%" }}>
        <Sparkle className="sparkle--delay-1" />
      </div>
      <div style={{ position: "absolute", bottom: "20%", left: "12%" }}>
        <Sparkle className="sparkle--sm sparkle--delay-3" />
      </div>

      {/* Logo — white on teal, matching her real banner */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          animation: "fadeIn 0.8s ease-out both",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-logo)",
            fontSize: 56,
            color: "#FFFFFF",
            lineHeight: 1.1,
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          Patri
        </span>
        <span
          style={{
            fontFamily: "var(--font-brand)",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "0.3em",
            color: "#FFFFFF",
            textTransform: "uppercase" as const,
            marginTop: -2,
          }}
        >
          ROBIANO
        </span>
      </div>

      <p
        style={{
          fontFamily: "var(--font-quote)",
          fontSize: 21,
          fontStyle: "italic",
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: 340,
          lineHeight: 1.5,
          marginTop: 36,
          textShadow: "0 1px 8px rgba(0, 0, 0, 0.1)",
          animation: "fadeIn 0.8s ease-out 0.2s both",
        }}
      >
        ¿Y si eso que tanto deseás... empezara a volverse realidad?
      </p>

      <p
        style={{
          fontFamily: "var(--font-brand)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.3em",
          color: "rgba(255, 255, 255, 0.85)",
          textTransform: "uppercase" as const,
          marginTop: 20,
          animation: "fadeIn 0.8s ease-out 0.3s both",
        }}
      >
        MANIFESTACIÓN CONSCIENTE
      </p>

      <button
        onClick={onStart}
        style={{
          marginTop: 52,
          padding: "16px 44px",
          background: "#FFFFFF",
          color: "#1A8F88",
          fontFamily: "var(--font-body)",
          fontSize: 16,
          fontWeight: 600,
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          transition: "var(--transition)",
          animation: "fadeIn 0.8s ease-out 0.5s both",
          border: "none",
          letterSpacing: "0.02em",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(0, 0, 0, 0.25)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Empezá tu sesión &rarr;
      </button>

      <p
        style={{
          marginTop: 44,
          fontSize: 13,
          color: "rgba(255, 255, 255, 0.6)",
          textAlign: "center",
          animation: "fadeIn 0.8s ease-out 0.7s both",
        }}
      >
        Basado en +30 años de metodología de Patricia Robiano
      </p>
    </div>
  );
}
