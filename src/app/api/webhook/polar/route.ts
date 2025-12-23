import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { polar } from "@/lib/polar";
import { Webhooks } from "@polar-sh/sdk/webhooks";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("polar-webhook-signature");

  if (!signature) {
    return new Response("No signature", { status: 401 });
  }

  try {
    const event = Webhooks.validate(
      body,
      signature,
      process.env.POLAR_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.updated") {
      const checkout = event.data;
      
      if (checkout.status === "succeeded" && checkout.metadata?.user_id) {
        const userId = checkout.metadata.user_id as string;
        const supabase = await createClient();

        // 1. 중복 결제 확인 (provider_ref = checkout.id)
        const { data: existing } = await supabase
          .from("purchases")
          .select("id")
          .eq("provider_ref", checkout.id)
          .single();

        if (!existing) {
          // 2. 결제 기록 저장
          await supabase.from("purchases").insert({
            user_id: userId,
            provider: "polar",
            provider_ref: checkout.id,
            amount: checkout.amount || 1000,
            credits_added: 10,
          });

          // 3. 크레딧 추가
          const { data: credits } = await supabase
            .from("credits")
            .select("remaining")
            .eq("user_id", userId)
            .single();

          const currentRemaining = credits?.remaining || 0;
          await supabase
            .from("credits")
            .update({ 
              remaining: currentRemaining + 10,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return new Response("Webhook Error", { status: 400 });
  }
}
