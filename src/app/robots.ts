import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dangsamo.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/callback", "/mypage", "/payment"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
