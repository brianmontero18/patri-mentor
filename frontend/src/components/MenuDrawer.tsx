interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  onNewSession: () => void;
}

export function MenuDrawer({ open, onClose, onNewSession }: MenuDrawerProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          zIndex: 100,
          animation: "fadeIn 0.2s ease-out both",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          maxWidth: "80vw",
          background: "linear-gradient(180deg, #1A9E96 0%, #158780 50%, #0D5E59 100%)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px",
          animation: "slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) both",
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span
              style={{
                fontFamily: "var(--font-logo)",
                fontSize: 28,
                color: "#FFFFFF",
                lineHeight: 1.1,
              }}
            >
              Patri
            </span>
            <span
              style={{
                fontFamily: "var(--font-brand)",
                fontSize: 10,
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
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <DrawerItem
            label="Nueva sesión"
            onClick={() => {
              onNewSession();
              onClose();
            }}
          />
          <DrawerItem label="Sobre Patri" href="https://www.instagram.com/patrirobianook/" />
          <DrawerItem label="Metodología VAF" href="https://www.youtube.com/@patrirobianook" />
        </nav>

        <div
          style={{
            marginTop: 24,
            paddingTop: 24,
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <SocialLink icon="ig" handle="@patrirobianook" href="https://www.instagram.com/patrirobianook/" />
          <SocialLink icon="yt" handle="/patrirobianook" href="https://www.youtube.com/@patrirobianook" />
        </div>

        <div style={{ marginTop: "auto" }}>
          <span style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.35)" }}>
            v0.1.0 MVP
          </span>
        </div>
      </div>
    </>
  );
}

function DrawerItem({ label, onClick, href }: { label: string; onClick?: () => void; href?: string }) {
  const style: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: 15,
    color: "#FFFFFF",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    transition: "background 0.2s",
    textDecoration: "none",
    display: "block",
  };

  const handleHover = (e: React.MouseEvent, enter: boolean) => {
    (e.currentTarget as HTMLElement).style.background = enter
      ? "rgba(255, 255, 255, 0.1)"
      : "transparent";
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      style={{ ...style, textAlign: "left", border: "none", background: "none", width: "100%" }}
      onMouseEnter={(e) => handleHover(e, true)}
      onMouseLeave={(e) => handleHover(e, false)}
    >
      {label}
    </button>
  );
}

function SocialLink({ icon, handle, href }: { icon: "ig" | "yt"; handle: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: 13,
        color: "rgba(255, 255, 255, 0.6)",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 0",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#FFFFFF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
      }}
    >
      <span style={{ fontSize: 11, opacity: 0.6 }}>{icon === "ig" ? "IG" : "YT"}</span>
      {handle}
    </a>
  );
}
