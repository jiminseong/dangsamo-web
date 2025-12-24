import { ImageResponse } from "next/og";
import { Zap } from "lucide-react";

export const runtime = "edge";

export const alt = "당사모 - 당하기 싫은 사람들의 모임";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #1e1b4b, #312e81)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Inter", sans-serif',
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            width: "120px",
            height: "120px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* 아이콘: 단순 svg path 사용 (lucide 아이콘을 직접 렌더링하기 어려울 경우) 또는 문자열 */}
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "#a5b4fc" }}
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div
          style={{
            fontSize: "60px",
            fontWeight: 900,
            marginBottom: "20px",
            letterSpacing: "-0.02em",
          }}
        >
          당사모
        </div>
        <div
          style={{
            fontSize: "30px",
            color: "#a5b4fc",
            fontWeight: 500,
          }}
        >
          당하기 싫은 사람들의 모임
        </div>
        <div
          style={{
            marginTop: "60px",
            background: "#4f46e5",
            padding: "15px 40px",
            borderRadius: "30px",
            fontSize: "24px",
            fontWeight: "bold",
            boxShadow: "0 10px 30px -10px rgba(79, 70, 229, 0.5)",
          }}
        >
          AI 과장광고 분석 솔루션
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
