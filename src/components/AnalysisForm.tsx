"use client";

import { useState } from "react";
import { Search, Zap, CreditCard, Loader2, Sparkles } from "lucide-react";

import { AnalysisData } from "./AnalysisResult";

interface AnalysisFormProps {
  freeCount: number;
  credits: number;
  onResult: (result: AnalysisData, kind: "free" | "paid") => void;
  onStartPayment: () => void;
}

export function AnalysisForm({ freeCount, credits, onResult, onStartPayment }: AnalysisFormProps) {
  const [input, setInput] = useState("");
  const [loadingType, setLoadingType] = useState<"free" | "paid" | null>(null);

  const handleAnalyze = async (kind: "free" | "paid") => {
    if (!input) return alert("상품명이나 URL을 입력해주세요.");

    setLoadingType(kind);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ input, kind }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "분석 실패");

      onResult(data, kind);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag?.("event", "analysis_complete", { kind });
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-3xl p-6 md:p-8 space-y-8 border border-border shadow-sm">
      <div className="space-y-4">
        <label className="text-sm font-bold ml-1 flex items-center gap-2 text-foreground">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          점검할 상품명 또는 URL
        </label>
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="쿠팡, 11번가 상품 링크나 상품명을 입력하세요."
            className="w-full h-40 p-5 rounded-2xl border border-input focus:outline-none focus:ring-4 focus:ring-ring/20 resize-none bg-muted/30 text-foreground placeholder:text-muted-foreground transition-all text-base font-medium leading-relaxed group-hover:bg-muted/50 group-hover:border-ring/30 focus:bg-background focus:border-ring"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <button
            onClick={() => handleAnalyze("free")}
            disabled={!!loadingType || freeCount >= 3}
            className="w-full h-16 bg-card border border-input text-card-foreground rounded-2xl font-bold hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            {loadingType === "free" ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            )}
            요약 점검 <span className="text-muted-foreground font-medium text-sm">(무료)</span>
          </button>
          <div className="flex justify-center items-center gap-2">
            <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${(Math.max(0, 3 - freeCount) / 3) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
              오늘 {Math.max(0, 3 - freeCount)}회 남음
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {credits > 0 ? (
            <button
              onClick={() => handleAnalyze("paid")}
              disabled={!!loadingType}
              className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100/20 active:scale-[0.98] cursor-pointer"
            >
              {loadingType === "paid" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 text-indigo-200 fill-indigo-200" />
              )}
              상세 정밀 점검 <span className="text-indigo-200 font-medium text-sm">(1회)</span>
            </button>
          ) : (
            <button
              onClick={onStartPayment}
              className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-zinc-200 active:scale-[0.98] cursor-pointer"
            >
              <CreditCard className="w-5 h-5 text-indigo-400" />
              10회 이용권{" "}
              <span className="text-muted-foreground font-medium text-sm">(₩1,000)</span>
            </button>
          )}
          <div className="flex justify-center items-center gap-2">
            <div className="h-1 flex-1 bg-muted rounded-full">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: credits > 0 ? "100%" : "0%" }}
              />
            </div>
            <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
              보유 크레딧 {credits}개
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
