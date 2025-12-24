"use client";

import { useState } from "react";
import { AuthButton } from "@/components/AuthButton";
import { AnalysisForm } from "@/components/AnalysisForm";
import { AnalysisResult } from "@/components/AnalysisResult";
import { User } from "@supabase/supabase-js";
import {
  Search,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Zap,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnalysisData } from "@/components/AnalysisResult";

interface HomeContentProps {
  user: User | null;
  initialData: {
    freeCount: number;
    credits: number;
  };
}

export function HomeContent({ user, initialData }: HomeContentProps) {
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [kind, setKind] = useState<"free" | "paid">("free");
  const [stats, setStats] = useState(initialData);

  const handleResult = (newResult: AnalysisData, newKind: "free" | "paid") => {
    setResult(newResult);
    setKind(newKind);
    if (newKind === "free") {
      setStats((prev) => ({ ...prev, freeCount: prev.freeCount + 1 }));
    } else {
      setStats((prev) => ({ ...prev, credits: prev.credits - 1 }));
    }
    document
      .getElementById("analysis-result")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleStartPayment = async () => {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "결제 페이지 이동 실패");
      }
    } catch {
      alert("결제 요청 중 오류가 발생했습니다.");
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Abstract Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-linear-to-b from-indigo-50/50 to-transparent" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-rose-50/40 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm mb-12"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-zinc-600 tracking-tight">
              AI 기반 과장광고 분석 솔루션
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-900 mb-8 leading-[1.1]"
          >
            속지 말고, <br />
            <span className="text-indigo-600">똑똑하게 소비하세요.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-500 mb-16 max-w-2xl mx-auto leading-relaxed"
          >
            과장광고부터 가격 거품까지—
            <br className="md:hidden" />
            AI가 쇼핑몰 상품 페이지를 정밀 분석하여 <br className="hidden md:block" />
            숨겨진 함정과 위험 요소를 찾아냅니다.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-10" />
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl shadow-indigo-500/10 p-2 relative overflow-hidden">
            {!user ? (
              <div className="p-8 flex flex-col items-center justify-center gap-6 text-center">
                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center mb-2">
                  <Search className="w-6 h-6 text-zinc-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-zinc-900">분석을 시작해보세요</h3>
                  <p className="text-zinc-500 text-sm">로그인 후 상품 URL이나 이름을 입력하세요.</p>
                </div>
                <div className="w-full">
                  <AuthButton />
                </div>
              </div>
            ) : (
              <div className="p-6">
                <AnalysisForm
                  freeCount={stats.freeCount}
                  credits={stats.credits}
                  onResult={handleResult}
                  onStartPayment={handleStartPayment}
                />
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Analysis Result Section (Conditional) */}
      <AnimatePresence>
        {result && (
          <section
            id="analysis-result"
            className="relative z-10 w-full bg-zinc-50 border-y border-zinc-200 py-16"
          >
            <div className="max-w-5xl mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <AnalysisResult result={result} kind={kind} />
              </motion.div>
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* Features Grid (Bento Style) */}
      <section className="relative z-10 py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 md:text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 text-zinc-900">
              쇼핑의 모든 순간을 <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600">
                완벽하게 검증합니다
              </span>
            </h2>
            <p className="text-lg text-zinc-500">
              당사모의 AI 엔진은 수백만 건의 커머스 데이터를 학습하여 인간이 놓치기 쉬운 패턴을
              감지합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <motion.div
              {...fadeInUp}
              className="md:col-span-2 bg-zinc-50 rounded-4xl p-10 border border-zinc-100 flex flex-col md:flex-row gap-10 items-center overflow-hidden group hover:border-zinc-200 transition-colors"
            >
              <div className="flex-1 space-y-6 relative z-10">
                <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center shadow-sm">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-3">초고속 위험도 스캔</h3>
                  <p className="text-zinc-500 leading-relaxed">
                    URL을 입력하는 즉시. 과장광고, 가격 거품, 가짜 리뷰 여부를 확인하세요.
                  </p>
                </div>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-linear-to-tr from-amber-100/20 to-transparent rounded-2xl" />
                <div className="relative bg-white rounded-2xl border border-zinc-200 p-6 shadow-xl translate-x-4 translate-y-4 md:translate-x-0 md:translate-y-0 group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold text-zinc-600">실시간 분석 중</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">ID: #8921-A</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-3/4 bg-zinc-100 rounded-full" />
                    <div className="h-2 w-full bg-zinc-100 rounded-full" />
                    <div className="h-2 w-5/6 bg-zinc-100 rounded-full" />
                  </div>
                  <div className="mt-6 flex justify-between items-end">
                    <div className="text-xs text-zinc-400">위험도 점수</div>
                    <div className="text-2xl font-bold text-red-500">82%</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tall Card */}
            <motion.div
              {...fadeInUp}
              className="md:row-span-2 bg-zinc-900 rounded-4xl p-10 border border-zinc-800 text-white flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center mb-8">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-4">
                  가장 안전한 <br />
                  소비 가이드
                </h3>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  의학적 효능 오인 문구부터 <br />
                  소비자 기만행위까지. <br />
                  법적 기준에 근거하여 판단합니다.
                </p>
                <ul className="space-y-4">
                  {[
                    "식약처 금지 문구 DB 연동(예정)",
                    "공정위 제재 사례 학습(예정)",
                    "소비자 보호원 피해 사례 매칭(예정)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div
              {...fadeInUp}
              className="bg-zinc-50 rounded-4xl p-8 border border-zinc-100 hover:border-zinc-200 transition-colors group"
            >
              <div className="w-10 h-10 bg-white rounded-lg border border-zinc-200 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">가격 거품 탐지</h3>
              <p className="text-sm text-zinc-500">
                유사 상품군의 평균 가격 데이터와 비교하여 원가 대비 폭리를 취하고 있는지 분석합니다.
              </p>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div
              {...fadeInUp}
              className="bg-zinc-50 rounded-4xl p-8 border border-zinc-100 hover:border-zinc-200 transition-colors group"
            >
              <div className="w-10 h-10 bg-white rounded-lg border border-zinc-200 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">리뷰 조작 판별</h3>
              <p className="text-sm text-zinc-500">
                반복되는 문구, 생성형 AI 패턴, 비정상적 업로드 주기를 포착하여 가짜 리뷰를
                걸러냅니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-32 border-t border-zinc-100 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter text-zinc-900 mb-4">
                실제 탐지 사례
              </h2>
              <p className="text-zinc-500">당사모 AI가 분석한 최근 과장광고 적발 케이스입니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "다이어트 보조제 K사",
                issue: "임상 결과 왜곡 및 허위 전후 사진",
                risk: "HIGH",
                score: 92,
                tags: ["건강기능식품", "허위과장"],
              },
              {
                title: "기능성 앰플 S사",
                issue: "의약품 오인 문구 사용 ('피부 재생')",
                risk: "MEDIUM",
                score: 64,
                tags: ["화장품", "법규위반"],
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.risk === "HIGH"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {item.risk} 위험
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{item.title}</h3>
                <p className="text-zinc-500 mb-8">{item.issue}</p>

                <div className="flex items-center gap-4 pt-6 border-t border-zinc-50">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-zinc-400">분석 신뢰도</span>
                      <span className="font-bold text-zinc-900">{item.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.risk === "HIGH" ? "bg-rose-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Social Proof (Ticker style) */}
      {/* <section className="py-20 bg-zinc-900 border-t border-zinc-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-zinc-500 text-sm font-semibold uppercase tracking-widest mb-12">
            검증된 분석 플랫폼
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-80">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">540k+</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">분석된 상품 수</div>
            </div>
            <div className="w-px h-12 bg-zinc-800 hidden md:block" />
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">120k+</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">보호받은 소비자</div>
            </div>
            <div className="w-px h-12 bg-zinc-800 hidden md:block" />
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">98.4%</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">분석 정확도</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer / CTA */}
      <footer className="py-24 bg-white border-t border-zinc-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-zinc-900">
            현명한 소비자의 시작
          </h2>
          <p className="text-lg text-zinc-500">
            더 이상 속지 마세요.
            <br />
            지금 바로 당사모와 함께 상품을 검증하세요.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all hover:scale-105 cursor-pointer"
            >
              무료로 시작하기
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("링크가 복사되었습니다.");
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-xl font-bold hover:bg-zinc-50 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              공유하기
            </button>
          </div>

          <div className="pt-20 text-xs text-zinc-400">© 2024 Dangsamo. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
