import type { MetadataRoute } from "next";
import { getAllLessons } from "@/lib/lessons";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/curriculum`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/dashboard`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE.url}/glossary`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/settings`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const lessons = getAllLessons()
    .filter((l) => l.hasContent)
    .map<MetadataRoute.Sitemap[number]>((l) => ({
      url: `${SITE.url}/lessons/${l.level}/${l.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...lessons];
}
