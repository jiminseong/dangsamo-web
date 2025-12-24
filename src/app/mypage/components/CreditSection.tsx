"use client";

import { CreditCard, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreditSectionProps {
  remainingCredentials: number;
}

export function CreditSection({ remainingCredentials }: CreditSectionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("결제 페이지 로딩 실패");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error(error);
      toast.error("결제 페이지로 이동하는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            보유 크레딧
          </h2>
          <p className="text-sm text-slate-500 mt-1">정밀 분석을 이용할 수 있는 잔여 횟수입니다.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-indigo-600">
            {remainingCredentials}
            <span className="text-lg font-medium text-slate-400 ml-1">회</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <CreditCard className="w-5 h-5" />
        {loading ? "이동 중..." : "크레딧 충전하기 (10회)"}
      </button>
      <p className="text-xs text-center text-slate-400 mt-3">
        1회 충전 시 10회의 정밀 분석이 추가됩니다.
      </p>
    </div>
  );
}
