"use client";

import { Share2, AlertCircle, ShieldCheck, Info, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";

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
    if (score < 30) return "bg-emerald-500";
    if (score < 70) return "bg-amber-500";
    return "bg-rose-500";
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
      });

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error("이미지 생성 실패");

        const file = new File([blob], "dangsamo-analysis.png", { type: "image/png" });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "당사모 분석 결과",
            text: "AI 과장광고 분석 결과를 확인해보세요! #당사모 #과장광고분석",
          });
        } else {
          const link = document.createElement("a");
          link.download = "dangsamo-analysis.png";
          link.href = canvas.toDataURL();
          link.click();
          toast.success("이미지가 저장되었습니다.");
        }
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
      ref={captureRef}
      className="bg-card text-card-foreground rounded-3xl p-8 md:p-10 space-y-10 shadow-2xl shadow-zinc-200/50 border border-border animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      <div className="flex flex-col items-center text-center space-y-6">
        {/* 제품명 표시 (있을 경우에만) */}
        {result.productName && (
          <div className="bg-zinc-100/80 px-4 py-2 rounded-full border border-zinc-200 mb-2">
            <span className="text-zinc-500 text-xs font-bold mr-2">분석 대상</span>
            <span className="text-zinc-900 text-sm font-bold tracking-tight">
              {result.productName}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            AI 분석 위험도 점수
          </span>
          <div className="flex items-center justify-center gap-4">
            <h3
              className={`text-6xl md:text-7xl font-black tabular-nums tracking-tighter ${
                result.riskScore < 30
                  ? "text-emerald-500"
                  : result.riskScore < 70
                  ? "text-amber-500"
                  : "text-rose-500"
              }`}
            >
              {result.riskScore}
            </h3>
            <div
              className={`px-4 py-1.5 rounded-2xl text-xs font-black text-white shadow-lg shadow-zinc-100/50 ${getRiskColor(
                result.riskScore
              )}`}
            >
              {getRiskLabel(result.riskScore)}
            </div>
          </div>
        </div>

        <div className="w-full max-sm h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${getRiskColor(
              result.riskScore
            )}`}
            style={{ width: `${result.riskScore}%` }}
          />
        </div>
      </div>

      {kind === "free" ? (
        <div className="space-y-6 bg-muted/30 p-6 rounded-4xl border border-border">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-indigo-500" />
            </div>
            <h4 className="text-base font-bold text-foreground tracking-tight">핵심 체크 포인트</h4>
          </div>
          <div className="grid gap-3">
            {result.shortReasons?.map((reason: string, i: number) => (
              <div
                key={i}
                className="flex gap-4 bg-card p-5 rounded-2xl border border-input shadow-sm text-sm font-medium text-muted-foreground leading-relaxed hover:border-indigo-100 transition-colors"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-[10px] font-bold">
                  {i + 1}
                </span>
                {reason}
              </div>
            ))}
          </div>
          <div className="pt-2 px-1">
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              * 무료 요약 점검은 핵심 위험 요소만 표시합니다. 정밀한 분석은 상세 점검을
              이용해주세요.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-base font-bold text-foreground tracking-tight">
                상세 정밀 분석 리포트
              </h4>
            </div>
            <div className="grid gap-4">
              {result.signals?.map((signal, i) => (
                <div
                  key={i}
                  className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:border-indigo-100 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 text-[10px] font-bold text-indigo-600 uppercase tracking-wider border border-indigo-100">
                      {signal.type}
                    </div>
                  </div>
                  <div className="text-foreground text-[15px] leading-relaxed font-bold tracking-tight">
                    {signal.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-10 border-t border-border">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 px-1">
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                  <Info className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <h4 className="text-sm font-bold text-foreground">주의가 필요한 지점</h4>
              </div>
              <ul className="space-y-3 px-1">
                {result.implications?.map((item: string, i: number) => (
                  <li
                    key={i}
                    className="text-[13px] text-muted-foreground leading-relaxed flex gap-3 font-medium"
                  >
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-rose-200 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 px-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <h4 className="text-sm font-bold text-foreground">AI 권장 가이드</h4>
              </div>
              <ul className="space-y-3 px-1">
                {result.nextActions?.map((item: string, i: number) => (
                  <li
                    key={i}
                    className="text-[13px] text-muted-foreground leading-relaxed flex gap-3 font-medium"
                  >
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-200 mt-1.5" />
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
      </div>
    </div>
  );
}
