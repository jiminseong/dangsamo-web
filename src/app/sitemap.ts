import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dangsamo.com";

  // 기본 정적 페이지들
  const routes = ["", "/privacy", "/terms", "/auth"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 동적 공유 페이지들은 너무 많을 수 있으므로 여기서는 제외하거나,
  // 주요 공유 페이지만 별도로 추가하는 방식을 고려할 수 있습니다.

  return routes;
}
