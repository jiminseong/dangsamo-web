import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
});

export async function createCheckout(userId: string, userEmail: string) {
  const result = await polar.checkouts.custom.create({
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID!,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/return?checkout_id={CHECKOUT_ID}`,
    customerEmail: userEmail,
    metadata: {
      user_id: userId,
    },
  });

  return result.url;
}
