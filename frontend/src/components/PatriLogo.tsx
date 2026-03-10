interface PatriLogoProps {
  size?: "sm" | "lg";
  breathing?: boolean;
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      className={`sparkle ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z"
        fill="var(--color-accent-gold)"
      />
    </svg>
  );
}

export function PatriLogo({ size = "lg", breathing = true }: PatriLogoProps) {
  const isLarge = size === "lg";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isLarge ? 4 : 2,
        position: "relative",
        animation: breathing ? "breathe 4s ease-in-out infinite" : undefined,
        padding: isLarge ? "16px 24px" : "4px 12px",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {isLarge && (
        <>
          <Sparkle className="sparkle--sm sparkle--delay-1" />
          <div style={{ position: "absolute", top: -8, right: -12 }}>
            <Sparkle className="sparkle--sm sparkle--delay-2" />
          </div>
        </>
      )}

      <span
        style={{
          fontFamily: "var(--font-logo)",
          fontSize: isLarge ? 52 : 22,
          color: "var(--color-primary)",
          lineHeight: 1.1,
          textShadow: "0 0 40px rgba(43, 188, 179, 0.3)",
        }}
      >
        Patri
      </span>
      <span
        style={{
          fontFamily: "var(--font-brand)",
          fontSize: isLarge ? 18 : 10,
          fontWeight: 600,
          letterSpacing: "0.3em",
          color: "var(--color-text)",
          textTransform: "uppercase" as const,
          marginTop: isLarge ? -4 : -2,
        }}
      >
        ROBIANO
      </span>
    </div>
  );
}
