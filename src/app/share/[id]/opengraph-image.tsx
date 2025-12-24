import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase";

export const runtime = "edge";

export const alt = "당사모 분석 결과";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: record } = await supabase
    .from("shared_results")
    .select("data")
    .eq("id", id)
    .single();

  const data = record?.data;
  const score = data?.riskScore || 0;
  const productName = data?.productName || "제품";

  // 점수에 따른 색상/텍스트 결정
  let bgColor = "#10b981"; // green-500
  let levelText = "안전";
  if (score >= 70) {
    bgColor = "#ef4444"; // red-500
    levelText = "위험";
  } else if (score >= 40) {
    bgColor = "#f59e0b"; // amber-500
    levelText = "주의";
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage: "linear-gradient(to bottom right, #f8fafc, #eff6ff)",
        }}
      >
        {/* Background Patterns */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `${bgColor}20`, // 20% opacity
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "#6366f120", // indigo 20% opacity
            filter: "blur(60px)",
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            border: "1px solid #e2e8f0",
            borderRadius: "32px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
            width: "80%",
          }}
        >
          {/* Logo / Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1e293b",
              color: "white",
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 30,
            }}
          >
            당사모 AI 분석 리포트
          </div>

          {/* Product Name */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 10,
              textAlign: "center",
              lineHeight: 1.2,
              wordBreak: "keep-all",
            }}
          >
            {productName}
          </div>

          <div
            style={{
              fontSize: 24,
              color: "#64748b",
              marginBottom: 40,
            }}
          >
            과장광고 위험도 분석 결과
          </div>

          {/* Score Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            {/* Score Circle */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: `8px solid ${bgColor}`,
                backgroundColor: "white",
              }}
            >
              <div style={{ fontSize: 48, fontWeight: 900, color: bgColor }}>{score}</div>
              <div style={{ fontSize: 16, color: "#64748b", fontWeight: 600 }}>점</div>
            </div>

            {/* Level Label */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontSize: 24, color: "#64748b" }}>판정 결과</div>
              <div style={{ fontSize: 64, fontWeight: 900, color: bgColor }}>{levelText}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#94a3b8",
          }}
        >
          dangsamo.shop
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
