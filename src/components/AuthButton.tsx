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

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "사용자";

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/mypage"
          className="group flex items-center gap-3 pl-3 pr-1 py-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
        >
          <div className="hidden sm:flex flex-col items-end -space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-500 transition-colors">
              마이페이지
            </span>
            <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate group-hover:text-slate-900">
              {userName}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 shadow-sm transition-all">
            <UserIcon className="w-5 h-5" />
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
          title="로그아웃"
        >
          <LogOut className="w-4 h-4" />
        </button>
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
