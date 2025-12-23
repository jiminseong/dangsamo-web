import { createClient } from "@/lib/supabase";
import { HomeContent } from "./HomeContent";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialData = { freeCount: 0, credits: 0 };

  if (user) {
    const today = new Date().toISOString().split("T")[0];
    
    // 무료 사용량 조회
    const { data: usage } = await supabase
      .from("usage_logs")
      .select("free_count")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    // 크레딧 조회
    const { data: credits } = await supabase
      .from("credits")
      .select("remaining")
      .eq("user_id", user.id)
      .single();

    initialData = {
      freeCount: usage?.free_count || 0,
      credits: credits?.remaining || 0,
    };
  }

  return <HomeContent user={user} initialData={initialData} />;
}
