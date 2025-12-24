import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { contact, type } = await request.json();

    if (!contact || !type) {
      return NextResponse.json({ error: "연락처를 입력해주세요." }, { status: 400 });
    }

    // 간단한 중복 체크 (선택 사항이나 UX를 위해 추천)
    const { data: existing } = await supabase
      .from("pre_launch_subscribers")
      .select("id")
      .eq("contact", contact)
      .single();

    if (existing) {
      return NextResponse.json({ message: "이미 신청 완료된 연락처입니다." }, { status: 200 });
    }

    const { error } = await supabase.from("pre_launch_subscribers").insert({
      contact,
      type,
    });

    if (error) {
      console.error("Subscription Error:", error);
      return NextResponse.json({ error: "신청 처리에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
