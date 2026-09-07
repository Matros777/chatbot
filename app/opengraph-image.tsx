import { ImageResponse } from "next/og";

// OpenGraph-карточка: чёрный фон + перечень инструментов
export const alt = "chatbot-gold-iota — AI Chat Assistant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TOOLS = [
  "Web Search",
  "Web Fetch",
  "Crypto Prices",
  "Crypto News",
  "AI Agent News",
  "GitHub Fetch",
  "X / Twitter Fetch",
  "Weather",
  "Code / Docs",
  "Save to Blob",
];

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
          padding: "56px 72px",
          boxSizing: "border-box",
        }}
      >
        {/* Граница */}
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 36,
            right: 36,
            bottom: 36,
            borderRadius: 28,
            border: "1px solid #2e2e40",
          }}
        />

        {/* Заголовок */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: 62,
              fontWeight: 900,
              color: "#e8eaf0",
              margin: "0 0 10px 0",
              letterSpacing: "-1px",
            }}
          >
            chatbot-gold-iota
          </h1>
          <p
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: "#a4a9b8",
              margin: 0,
            }}
          >
            Free AI Chat Assistant · Multiple Models
          </p>
        </div>

        {/* Перечень инструментов */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 14,
            maxWidth: 940,
          }}
        >
          {TOOLS.map((tool) => (
            <div
              key={tool}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 24px",
                borderRadius: 14,
                background: "#16161f",
                border: "1px solid #2a2a3a",
                fontSize: 24,
                fontWeight: 700,
                color: "#cfd3dd",
              }}
            >
              {tool}
            </div>
          ))}
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