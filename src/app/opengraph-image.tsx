import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pinky — The Fit Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#2B2247",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(217,11,145,0.35), transparent 45%), radial-gradient(circle at 10% 90%, rgba(217,11,145,0.2), transparent 40%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 96, fontWeight: 800, color: "#ffffff" }}>
          pinky
          <span style={{ color: "#D90B91" }}>.</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 40, fontWeight: 700, color: "#ffffff", maxWidth: 900 }}>
          Hacemos que tu marca crezca, se vea y venda más.
        </div>
        <div style={{ display: "flex", marginTop: 36, height: 8, width: 180, backgroundColor: "#D90B91", borderRadius: 999 }} />
      </div>
    ),
    { ...size }
  );
}
