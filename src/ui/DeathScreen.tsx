type DeathScreenProps = {
  onRetry: () => void;
};

const DeathScreen = ({ onRetry }: DeathScreenProps) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "min(520px, calc(100% - 32px))",
          borderRadius: 12,
          background: "rgba(20,20,20,0.95)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.15)",
          padding: 18,
          boxShadow: "0 12px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
          Out of power
        </div>
        <div style={{ opacity: 0.9, marginBottom: 14 }}>
          You don’t have any power left.
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onRetry}
            autoFocus
            style={{
              cursor: "pointer",
              borderRadius: 10,
              padding: "10px 14px",
              fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.12)",
              color: "white",
            }}
          >
            Retry
          </button>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
          Tip: press <b>R</b> to retry.
        </div>
      </div>
    </div>
  );
};

export default DeathScreen;
