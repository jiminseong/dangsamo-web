import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const { result } = body;

    if (!result) {
      return NextResponse.json({ error: "No result data" }, { status: 400 });
    }

    // 데이터 저장
    const { data, error } = await supabase
      .from("shared_results")
      .insert({
        user_id: user?.id || null, // 비로그인 유저도 허용 (nullable)
        data: result,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Share API Insert Error:", error);
      return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
    }

    // 생성된 공유 URL 반환
    const shareUrl = `${new URL(request.url).origin}/share/${data.id}`;
    return NextResponse.json({ url: shareUrl });
  } catch (error) {
    console.error("Share API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
