"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon } from "lucide-react";

export function AuthButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/mypage"
          className="hidden sm:flex flex-col items-end -space-y-1 hover:opacity-70 transition-opacity"
        >
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            마이페이지
          </span>
          <span className="text-xs font-medium text-zinc-600 max-w-[120px] truncate">
            {user.email}
          </span>
        </Link>
        <div className="flex items-center gap-1 bg-zinc-50 p-1 rounded-full border border-zinc-100">
          <Link
            href="/mypage"
            className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-indigo-600 hover:border-indigo-300 transition-all"
            title="마이페이지"
          >
            <UserIcon className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white hover:text-red-500 rounded-full transition-all text-zinc-400"
            title="로그아웃"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors shadow-sm shadow-zinc-200"
    >
      시작하기
    </button>
  );
}
