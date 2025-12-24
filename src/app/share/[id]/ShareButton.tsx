"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

export function ShareButton() {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 복사되었습니다!");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <button
      onClick={handleCopyLink}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
    >
      <Copy className="w-3.5 h-3.5" />
      링크 복사
    </button>
  );
}
