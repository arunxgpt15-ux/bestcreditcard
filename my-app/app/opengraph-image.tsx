import { ImageResponse } from "next/og";

export const alt = "JourneyCard - smart travel, better rewards";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#060a12", color: "#f5f7fb", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", width: "100%", height: "100%", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "18px", color: "#2dd4bf", fontSize: 30, fontWeight: 800 }}>
        <div style={{ background: "#2dd4bf", color: "#060a12", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", width: 58, height: 58 }}>J</div>
        JourneyCard
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 900 }}>
        <div style={{ color: "#2dd4bf", fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase" }}>Travel smarter</div>
        <div style={{ fontSize: 72, lineHeight: 1, fontWeight: 800 }}>The right card makes every journey go further.</div>
        <div style={{ color: "#b4c0d0", fontSize: 28 }}>Compare Indian credit cards by rewards, lounge access, fees, and real-world value.</div>
      </div>
      <div style={{ color: "#fcd34d", fontSize: 24 }}>bestcreditcard.me</div>
    </div>,
    { ...size },
  );
}
