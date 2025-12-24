import { createClient } from "@/lib/supabase";
import { AnalysisResult, AnalysisData } from "@/components/AnalysisResult";
import { Header } from "@/components/Header";
import { Copy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "./ShareButton";

// force-dynamic을 사용하여 항상 최신 데이터를 페치하도록 설정 (캐싱 방지)
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 공유 데이터 조회
  const { data: shareData, error } = await supabase
    .from("shared_results")
    .select("data")
    .eq("id", id)
    .single();

  if (error || !shareData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">분석 결과를 찾을 수 없습니다.</h1>
        <p className="text-zinc-500 mb-8">잘못된 주소이거나 삭제된 결과입니다.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const result = shareData.data as AnalysisData;
  // 유료/무료 구분은 데이터 구조로 추론 (nextActions가 있으면 유료인 셈)
  // 하지만 정확한 kind를 저장하지 않았으므로, nextActions 존재 여부로 판단하거나
  // AnalysisResult 컴포넌트가 kind를 요구하므로 추론해야 함.
  // 무료: shortReasons 있음, 유료: signals, implications, nextActions 있음.
  // 간단히: nextActions가 있으면 'paid', 없으면 'free'로 간주.
  const kind = result.nextActions ? "paid" : "free";

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20 space-y-8">
        {/* 상단 네비게이션 */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            나도 분석하러 가기
          </Link>
          <ShareButton />
        </div>

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900">
            공유된 AI 과장광고 분석 리포트
          </h1>
          <p className="text-zinc-500 text-sm md:text-base">
            당사모 AI가 분석한 결과를 확인해보세요.
          </p>
        </div>

        <AnalysisResult result={result} kind={kind} />

        {/* 하단 CTA */}
        <div className="mt-12 p-8 bg-white rounded-3xl border border-zinc-200 text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-zinc-900">혹시 보고 계신 제품도 의심되시나요?</h3>
            <p className="text-zinc-500 text-sm">
              지금 바로 AI 분석을 통해 과장광고 여부를 3초 만에 확인해보세요!
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-zinc-200"
          >
            내 제품 분석하러 가기
            <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
          </Link>
        </div>
      </main>
    </div>
  );
}
