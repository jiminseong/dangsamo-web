"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, BellRing, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ShoppingAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingAlertModal({ isOpen, onClose }: ShoppingAlertModalProps) {
  const [contact, setContact] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 이메일 정규식 (간단 버전)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // 전화번호 정규식 (숫자, 하이픈, 공백 허용)
  const phoneRegex = /^[\d\s-]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    let type = "";
    if (emailRegex.test(contact)) type = "email";
    else if (phoneRegex.test(contact) && contact.replace(/\D/g, "").length >= 10) type = "phone";
    else {
      toast.error("올바른 이메일 또는 전화번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "오류가 발생했습니다.");

      setSubmitted(true);
      toast.success("신청이 완료되었습니다!");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-zinc-100 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900">신청 완료!</h3>
                <p className="text-zinc-500 font-medium">
                  안심 쇼핑 기능이 오픈되면
                  <br />
                  가장 먼저 알려드릴게요.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 w-full py-3.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                >
                  확인
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BellRing className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 text-balance">
                    AI가 검증한 상품만 모아
                    <br />
                    안심 쇼핑을 준비중이에요
                  </h3>
                  <p className="text-zinc-500 text-sm font-medium">
                    오픈 알림을 신청하시면 특별한 혜택과 함께
                    <br />
                    가장 먼저 소식을 전해드려요.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 ml-1">
                      이메일 또는 전화번호
                    </label>
                    <input
                      type="text"
                      placeholder="example@email.com 또는 010-1234-5678"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>

                  <label className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer group">
                    <div className="relative flex items-center mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="peer h-4 w-4 appearance-none rounded border border-zinc-300 bg-white checked:border-indigo-500 checked:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <svg
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-zinc-500 leading-relaxed font-medium group-hover:text-zinc-700 transition-colors text-left flex-1">
                      서비스 오픈 알림 전송을 위한 개인정보(연락처) 수집 및 이용에 동의합니다.
                      수집된 정보는 알림 발송 후 파기됩니다.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading || !contact}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        신청 중...
                      </>
                    ) : (
                      "오픈 알림 신청하기"
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
