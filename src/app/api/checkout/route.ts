import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { createCheckout } from "@/lib/polar";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const url = await createCheckout(user.id, user.email!);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: "결제 페이지를 불러오지 못했습니다." }, { status: 500 });
  }
}
