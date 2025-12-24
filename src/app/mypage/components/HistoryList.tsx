import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Clock } from "lucide-react";
// import Link from 'next/link';

interface AnalysisLog {
  id: number;
  created_at: string;
  kind: "free" | "paid";
  risk_score: number;
  result: any; // 구체적인 타입은 실제 데이터에 따름
}

interface HistoryListProps {
  logs: AnalysisLog[];
}

export function HistoryList({ logs }: HistoryListProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-slate-500">아직 분석한 기록이 없어요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => {
        const result = log.result;
        const productName = result?.productName || "알 수 없는 제품";
        const score = log.risk_score || 0;

        // 위험도에 따른 색상 처리
        let scoreColor = "text-green-600 bg-green-50 border-green-200";
        if (score >= 70) scoreColor = "text-red-600 bg-red-50 border-red-200";
        else if (score >= 40) scoreColor = "text-amber-600 bg-amber-50 border-amber-200";

        return (
          <div
            key={log.id}
            className="group relative bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                      log.kind === "paid"
                        ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {log.kind === "paid" ? "정밀분석" : "무료분석"}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(log.created_at), "yyyy. MM. dd HH:mm", {
                      locale: ko,
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 truncate pr-4">{productName}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                  {result?.shortReasons?.[0] ||
                    result?.signals?.[0]?.reason ||
                    "분석 결과 확인하기"}
                </p>
              </div>

              <div className="flex-shrink-0 text-center">
                <div className={`px-3 py-2 rounded-lg border ${scoreColor}`}>
                  <div className="text-xs font-medium opacity-80">위험도</div>
                  <div className="text-xl font-black">{score}점</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
