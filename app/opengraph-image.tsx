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
          background: "#0a0a0f",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Лёгкий декоративный контур-граница */}
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 36,
            right: 36,
            bottom: 36,
            borderRadius: 28,
            border: "1px solid #232330",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#c8ccd4",
              margin: "0 0 16px 0",
              letterSpacing: "-1px",
            }}
          >
            chatbot-gold-iota
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "#8b909c",
              margin: 0,
            }}
          >
            Free AI Chat Assistant · Multiple Models
          </p>
        </div>

        {/* Favicon маленький в правом верхнем углу */}
        <img
          src="https://chatbot-gold-iota-13.vercel.app/icon.svg"
          width={64}
          height={64}
          style={{
            position: "absolute",
            top: 48,
            right: 48,
            borderRadius: 14,
          }}
        />
      </div>
    ),
    size,
  );
}