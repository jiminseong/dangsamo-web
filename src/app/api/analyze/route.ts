import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { analyzeFree, analyzePaid } from "@/lib/ai";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { input, kind } = await bodyToJSON(request);

  if (!input) {
    return NextResponse.json({ error: "분석할 내용을 입력해주세요." }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];

  if (kind === "free") {
    // 무료 점검 횟수 확인 (일 3회)
    const { data: usage } = await supabase
      .from("usage_logs")
      .select("free_count")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    const count = usage?.free_count || 0;
    if (count >= 3) {
      return NextResponse.json({ error: "무료 점검은 하루 3회까지만 가능해요." }, { status: 403 });
    }

    // AI 분석 실행
    const result = await analyzeFree(input);

    // 로그 및 횟수 업데이트
    await supabase.from("usage_logs").upsert({
      user_id: user.id,
      date: today,
      free_count: count + 1,
    });

    await supabase.from("analysis_logs").insert({
      user_id: user.id,
      kind: "free",
      input,
      risk_score: result.riskScore,
      result,
    });

    return NextResponse.json(result);
  } else if (kind === "paid") {
    // 크레딧 확인
    const { data: credits } = await supabase
      .from("credits")
      .select("remaining")
      .eq("user_id", user.id)
      .single();

    if (!credits || credits.remaining <= 0) {
      return NextResponse.json({ error: "크레딧이 부족해요. 충전 후 이용해주세요." }, { status: 403 });
    }

    // AI 상세 분석 실행
    const result = await analyzePaid(input);

    // 크레딧 차감 및 로그 저장
    await supabase
      .from("credits")
      .update({ remaining: credits.remaining - 1 });

    await supabase.from("analysis_logs").insert({
      user_id: user.id,
      kind: "paid",
      input,
      risk_score: result.riskScore,
      result,
    });

    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
}

async function bodyToJSON(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}
