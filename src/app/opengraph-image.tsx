import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "How Is My Bitcoin Doing?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Bitcoin symbol */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 16,
            display: "flex",
          }}
        >
          <span style={{ color: "#f7931a" }}>&#8383;</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            textAlign: "center",
            display: "flex",
          }}
        >
          How Is My Bitcoin Doing?
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#a1a1aa",
            marginTop: 16,
            textAlign: "center",
            display: "flex",
          }}
        >
          Track your wallet&apos;s profit & loss
        </div>

        {/* Profit/Loss indicators */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#10b981",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 28 }}>&#9650;</span> Profit
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#ef4444",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 28 }}>&#9660;</span> Loss
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            color: "#52525b",
            fontSize: 18,
            display: "flex",
          }}
        >
          howismybitcoindoing.com
        </div>
      </div>
    ),
    { ...size }
  );
}
