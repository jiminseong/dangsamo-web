import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { LogoutButton } from "./components/LogoutButton";
import { CreditSection } from "./components/CreditSection";
import { HistoryList } from "./components/HistoryList";
import { User, History, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // 데이터 병렬 조회
  const [creditsResult, logsResult] = await Promise.all([
    supabase.from("credits").select("remaining").eq("user_id", user.id).single(),
    supabase
      .from("analysis_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const remaining = creditsResult.data?.remaining || 0;
  const logs = logsResult.data || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {user.user_metadata?.name || "사용자"}님
                </h1>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </section>

        {/* Credit Section */}
        <section>
          <CreditSection remainingCredentials={remaining} />
        </section>

        {/* History Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" />
              최근 분석 기록
            </h2>
            {/* 더보기 링크가 필요하다면 추가 */}
          </div>
          <HistoryList logs={logs} />
        </section>

        {/* Account Management Section */}
        <section className="pt-8 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-400 mb-4">계정 관리</h3>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            <div className="px-5 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-red-500">회원 탈퇴</span>
              <span className="text-xs text-slate-400">고객센터로 문의해주세요</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
