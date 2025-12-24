import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

import { validateEvent } from "@polar-sh/sdk/webhooks";

export async function POST(request: Request) {
  const body = await request.text();
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  console.log("[Webhook] Received request");
  // console.log("[Webhook] Headers:", JSON.stringify(headers)); // 보안상 헤더 전체 로깅은 주의

  if (!headers["polar-webhook-signature"]) {
    console.error("[Webhook] No signature found");
    return new Response("No signature", { status: 401 });
  }

  try {
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[Webhook] POLAR_WEBHOOK_SECRET is not set");
      return new Response("Server Configuration Error", { status: 500 });
    }

    const event = validateEvent(body, headers, webhookSecret);
    console.log("[Webhook] Event validated:", event.type);

    if (event.type === "checkout.updated") {
      const checkout = event.data;
      console.log("[Webhook] Checkout status:", checkout.status);
      console.log("[Webhook] Checkout metadata:", checkout.metadata);

      if (checkout.status === "succeeded" && checkout.metadata?.user_id) {
        const userId = checkout.metadata.user_id as string;
        const supabase = await createClient();

        // 1. 중복 결제 확인 (provider_ref = checkout.id)
        const { data: existing, error: findError } = await supabase
          .from("purchases")
          .select("id")
          .eq("provider_ref", checkout.id)
          .single();

        if (findError && findError.code !== "PGRST116") {
          console.error("[Webhook] Error checking duplicate:", findError);
        }

        if (!existing) {
          console.log("[Webhook] Processing new purchase for user:", userId);

          // 2. 결제 기록 저장
          const { error: insertError } = await supabase.from("purchases").insert({
            user_id: userId,
            provider: "polar",
            provider_ref: checkout.id,
            amount: checkout.amount || 1000,
            credits_added: 10,
          });

          if (insertError) {
            console.error("[Webhook] Purchase insert error:", insertError);
            return new Response("DB Error", { status: 500 });
          }

          // 3. 크레딧 추가
          const { data: credits, error: creditError } = await supabase
            .from("credits")
            .select("remaining")
            .eq("user_id", userId)
            .single();

          if (creditError) {
            console.error("[Webhook] Fetch credit error:", creditError);
            // 크레딧 레코드가 없을 수도 있으므로 에러 처리 주의
          }

          const currentRemaining = credits?.remaining || 0;
          const { error: updateError } = await supabase.from("credits").upsert(
            {
              user_id: userId, // upsert를 위해 user_id 필요
              remaining: currentRemaining + 10,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          ); // user_id 충돌 시 업데이트

          if (updateError) {
            console.error("[Webhook] Credit update error:", updateError);
            return new Response("DB Error", { status: 500 });
          }

          console.log("[Webhook] Successfully added credits");
        } else {
          console.log("[Webhook] Purchase already processed:", checkout.id);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook] Error processing webhook:", err);
    return new Response("Webhook Error", { status: 400 });
  }
}
