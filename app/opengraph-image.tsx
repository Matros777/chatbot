import { ImageResponse } from "next/og";

// OpenGraph-карточка: фон + favicon маленький в правом верхнем углу
export const alt = "chatbot-gold-iota — AI Chat Assistant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 20% 10%, #1e1b4b 0%, #0b1020 55%, #04050c 100%)",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Декоративные свечения */}
        <div
          style={{
            position: "absolute",
            left: "-120px",
            top: "-120px",
            width: 500,
            height: 500,
            borderRadius: 999,
            background: "rgba(99,102,241,0.25)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-80px",
            bottom: "-140px",
            width: 480,
            height: 480,
            borderRadius: 999,
            background: "rgba(168,85,247,0.18)",
            filter: "blur(90px)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#f3f4f6",
              margin: "0 0 16px 0",
              letterSpacing: "-1px",
            }}
          >
            chatbot-gold-iota
          </h1>
          <p
            style={{
              fontSize: 30,
              color: "#9ca3af",
              margin: 0,
            }}
          >
            Free AI Chat Assistant · Multiple Models
          </p>
        </div>

        {/* Favicon маленький в правом верхнем углу */}
        <img
          src="https://chatbot-gold-iota-13.vercel.app/icon.svg"
          width={72}
          height={72}
          style={{
            position: "absolute",
            top: 32,
            right: 32,
            borderRadius: 14,
          }}
        />
      </div>
    ),
    size,
  );
}