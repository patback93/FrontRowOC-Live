import Link from "next/link";

// Branded 404 — Tally Red V3 voice, self-contained styles so it renders
// identically no matter which route's CSS is loaded.
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        background: "#111013",
        color: "#F6F3EC",
        fontFamily: "var(--font-archivo), Archivo, sans-serif",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-plex-mono), 'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#D93A2B",
        }}
      >
        404 — No signal on this channel
      </div>
      <h1
        style={{
          margin: 0,
          fontWeight: 800,
          fontStretch: "125%",
          fontSize: "clamp(30px, 5vw, 56px)",
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          maxWidth: 720,
        }}
      >
        This page isn&rsquo;t on the program<span style={{ color: "#D93A2B" }}>.</span>
      </h1>
      <Link
        href="/"
        style={{
          marginTop: 10,
          display: "inline-block",
          background: "#F6F3EC",
          color: "#111013",
          textDecoration: "none",
          fontWeight: 800,
          fontStretch: "125%",
          fontSize: 13,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          padding: "16px 24px 17px",
        }}
      >
        Back to the homepage
      </Link>
    </div>
  );
}
