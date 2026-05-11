interface Props {
  src: string | null;
  loading: boolean;
  error: string | null;
}

export default function CardPreview({ src, loading, error }: Props) {
  return (
    <div className="flex-1 flex flex-col" style={{ minHeight: "400px" }}>

      {/* Title bar */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <span style={{ fontFamily: '"Rye", cursive', color: "#5c3810", fontSize: "11px", letterSpacing: "0.2em" }}>
          ── PREVIEW ──
        </span>
      </div>

      {/* Frame */}
      <div
        className="flex-1 flex items-center justify-center rounded"
        style={{
          background: "#120a03",
          border: "1px solid #3a2010",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
          padding: "24px",
          position: "relative",
        }}
      >
        {/* Corner decorations */}
        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos}`}
            style={{ color: "#3a2010", fontSize: "14px", lineHeight: 1 }}
          >✦</span>
        ))}

        {error && (
          <div style={{
            color: "#c05050",
            fontSize: "12px",
            background: "rgba(120,30,30,0.2)",
            border: "1px solid rgba(120,30,30,0.4)",
            borderRadius: "3px",
            padding: "10px 16px",
            maxWidth: "300px",
            textAlign: "center",
            fontFamily: '"Lora", serif',
          }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px",
              border: "2px solid rgba(200,134,12,0.2)",
              borderTop: "2px solid #c8860c",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <span style={{ fontFamily: '"Rye", cursive', color: "#5c3810", fontSize: "11px", letterSpacing: "0.15em" }}>
              Shuffling…
            </span>
          </div>
        )}

        {!loading && src && (
          <img
            src={src}
            alt="Card preview"
            style={{
              maxWidth: "100%",
              maxHeight: "75vh",
              objectFit: "contain",
              borderRadius: "4px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.8)",
            }}
          />
        )}

        {!loading && !src && !error && (
          <span style={{ fontFamily: '"Rye", cursive', color: "#2a1808", fontSize: "13px", letterSpacing: "0.15em" }}>
            Your card will appear here
          </span>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
