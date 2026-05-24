import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Loida British";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#232c65",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: 50, right: 70, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 60, left: 80, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", display: "flex" }} />
        <div style={{ position: "absolute", top: "45%", left: 40, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", display: "flex" }} />

        {/* Shield icon */}
        <svg width="90" height="108" viewBox="0 0 90 108" xmlns="http://www.w3.org/2000/svg">
          <path d="M45 0 L90 18 L90 58 Q90 90 45 108 Q0 90 0 58 L0 18 Z" fill="#c12032" />
          <path d="M45 12 L78 26 L78 58 Q78 84 45 96 Q12 84 12 58 L12 26 Z" fill="rgba(255,255,255,0.08)" />
          <path d="M45 24 L66 33 L66 58 Q66 77 45 86 Q24 77 24 58 L24 33 Z" fill="rgba(193,32,50,0.4)" />
        </svg>

        {/* Brand name */}
        <div style={{ color: "white", fontSize: 86, fontWeight: 700, letterSpacing: "-2px", lineHeight: 1, marginTop: 24 }}>
          Loida British
        </div>

        {/* Tagline */}
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 22, letterSpacing: "3px", marginTop: 18, textTransform: "uppercase" }}>
          We Pave The Path To Excellence
        </div>

        {/* Domain */}
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 17, marginTop: 10 }}>
          loidabritish.com
        </div>

        {/* Red bottom bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 7, background: "#c12032", display: "flex" }} />
      </div>
    ),
    { ...size }
  );
}
