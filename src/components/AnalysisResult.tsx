"use client";

import {
  Share2,
  AlertCircle,
  ShieldCheck,
  Info,
  ArrowRight,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { shareContent } from "@/lib/share";

export interface AnalysisData {
  productName?: string;
  riskScore: number;
  shortReasons?: string[];
  signals?: { type: string; reason: string }[];
  implications?: string[];
  nextActions?: string[];
}

interface AnalysisResultProps {
  result: AnalysisData | null;
  kind: "free" | "paid";
}

export function AnalysisResult({ result, kind }: AnalysisResultProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!result) return null;

  const getRiskColor = (score: number) => {
    if (score < 30) return "#10b981"; // emerald-500
    if (score < 70) return "#f59e0b"; // amber-500
    return "#f43f5e"; // rose-500
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return "안심";
    if (score < 70) return "주의";
    return "위험";
  };

  const handleShare = async () => {
    if (isSharing || !captureRef.current) return;
    setIsSharing(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById("analysis-result-capture");
          if (element) {
            element.style.transform = "none";
            element.style.animation = "none";
            element.style.transition = "none";
            element.classList.remove("animate-in", "fade-in", "slide-in-from-bottom-4");
          }
        },
      });

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error("이미지 생성 실패");

        const file = new File([blob], "dangsamo-analysis.png", { type: "image/png" });

        await shareContent({
          title: "당사모 분석 결과",
          text: "AI 과장광고 분석 결과를 확인해보세요! #당사모 #과장광고분석",
          files: [file],
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag?.("event", "share_image_click");
    } catch (e) {
      console.error(e);
      toast.error("이미지 공유 실패");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div
      id="analysis-result-capture"
      ref={captureRef}
      className="rounded-3xl p-8 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
      style={{
        backgroundColor: "#ffffff",
        color: "#18181b",
        border: "1px solid #e4e4e7",
        boxShadow: "0 25px 50px -12px rgba(228, 228, 231, 0.5)",
      }}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        {/* 제품명 표시 (있을 경우에만) */}
        {result.productName && (
          <div
            className="px-4 py-2 rounded-full border mb-2"
            style={{
              backgroundColor: "rgba(244, 244, 245, 0.8)",
              borderColor: "#e4e4e7",
            }}
          >
            <span className="text-xs font-bold mr-2" style={{ color: "#71717a" }}>
              분석 대상
            </span>
            <span className="text-sm font-bold tracking-tight" style={{ color: "#18181b" }}>
              {result.productName}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "#71717a" }}
          >
            AI 분석 위험도 점수
          </span>
          <div className="flex items-center justify-center gap-4">
            <h3
              className="text-6xl md:text-7xl font-black tabular-nums tracking-tighter"
              style={{
                color:
                  result.riskScore < 30 ? "#10b981" : result.riskScore < 70 ? "#f59e0b" : "#f43f5e",
              }}
            >
              {result.riskScore}
            </h3>
            <div
              className="px-4 py-1.5 rounded-2xl text-xs font-black text-white"
              style={{
                backgroundColor: getRiskColor(result.riskScore),
                boxShadow: "0 10px 15px -3px rgba(244, 244, 245, 0.5)",
              }}
            >
              {getRiskLabel(result.riskScore)}
            </div>
          </div>
        </div>

        <div
          className="w-full max-sm h-3 rounded-full overflow-hidden p-0.5 border"
          style={{ backgroundColor: "#f4f4f5", borderColor: "#e4e4e7" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${result.riskScore}%`,
              backgroundColor: getRiskColor(result.riskScore),
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          />
        </div>
      </div>

      {kind === "free" ? (
        <div
          className="space-y-6 p-6 rounded-4xl border"
          style={{ backgroundColor: "rgba(244, 244, 245, 0.3)", borderColor: "#e4e4e7" }}
        >
          <div className="flex items-center gap-2.5 px-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#eef2ff" }} // indigo-50
            >
              <AlertCircle className="w-4 h-4" style={{ color: "#6366f1" }} /> {/* indigo-500 */}
            </div>
            <h4 className="text-base font-bold tracking-tight" style={{ color: "#18181b" }}>
              핵심 체크 포인트
            </h4>
          </div>
          <div className="grid gap-3">
            {result.shortReasons?.map((reason: string, i: number) => (
              <div
                key={i}
                className="flex gap-4 p-5 rounded-2xl border text-sm font-medium leading-relaxed transition-colors"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e4e4e7",
                  color: "#71717a",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
              >
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: "#eef2ff", color: "#6366f1" }}
                >
                  {i + 1}
                </span>
                {reason}
              </div>
            ))}
          </div>
          <div className="pt-2 px-1">
            <p className="text-xs font-medium leading-relaxed" style={{ color: "#71717a" }}>
              * 무료 요약 점검은 핵심 위험 요소만 표시합니다. 정밀한 분석은 상세 점검을
              이용해주세요.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 px-1">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#4f46e5" }} // indigo-600
              >
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-base font-bold tracking-tight" style={{ color: "#18181b" }}>
                상세 정밀 분석 리포트
              </h4>
            </div>
            <div className="grid gap-4">
              {result.signals?.map((signal, i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl border transition-colors group"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e4e4e7",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border"
                      style={{
                        backgroundColor: "#eef2ff", // indigo-50
                        color: "#4f46e5", // indigo-600
                        borderColor: "#e0e7ff", // indigo-100
                      }}
                    >
                      {signal.type}
                    </div>
                  </div>
                  <div
                    className="text-[15px] leading-relaxed font-bold tracking-tight"
                    style={{ color: "#18181b" }}
                  >
                    {signal.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="grid md:grid-cols-2 gap-8 pt-10 border-t"
            style={{ borderColor: "#e4e4e7" }}
          >
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 px-1">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#fff1f2" }} // rose-50
                >
                  <Info className="w-3.5 h-3.5" style={{ color: "#f43f5e" }} /> {/* rose-500 */}
                </div>
                <h4 className="text-sm font-bold" style={{ color: "#18181b" }}>
                  주의가 필요한 지점
                </h4>
              </div>
              <ul className="space-y-3 px-1">
                {result.implications?.map((item: string, i: number) => (
                  <li
                    key={i}
                    className="text-[13px] leading-relaxed flex gap-3 font-medium"
                    style={{ color: "#71717a" }}
                  >
                    <span
                      className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                      style={{ backgroundColor: "#fecdd3" }} // rose-200
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 px-1">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#ecfdf5" }} // emerald-50
                >
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: "#10b981" }} />{" "}
                  {/* emerald-500 */}
                </div>
                <h4 className="text-sm font-bold" style={{ color: "#18181b" }}>
                  AI 권장 가이드
                </h4>
              </div>
              <ul className="space-y-3 px-1">
                {result.nextActions?.map((item: string, i: number) => (
                  <li
                    key={i}
                    className="text-[13px] leading-relaxed flex gap-3 font-medium"
                    style={{ color: "#71717a" }}
                  >
                    <span
                      className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                      style={{ backgroundColor: "#a7f3d0" }} // emerald-200
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="pt-6" data-html2canvas-ignore>
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold transition-all hover:opacity-90 shadow-xl shadow-zinc-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {isSharing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          {isSharing ? "이미지 생성 중..." : "분석 결과 이미지로 공유하기"}
        </button>
        <button
          onClick={async () => {
            await shareContent({
              title: "당사모 분석 결과",
              text: `AI 과장광고 분석 결과: 위험도 ${result.riskScore}점`,
              data: result, // API를 통해 URL 생성
            });
          }}
          className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-white border border-zinc-200 text-zinc-900 text-sm font-bold transition-all hover:bg-zinc-50 active:scale-[0.98] cursor-pointer mt-3"
        >
          <LinkIcon className="w-4 h-4" />
          결과 링크로 공유하기
        </button>
      </div>
    </div>
  );
}
