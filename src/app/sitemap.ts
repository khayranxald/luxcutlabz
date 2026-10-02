import type { MetadataRoute } from "next";

const BASE_URL = "https://luxcutlabz.com"; // ganti dengan domain asli saat deploy

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/barbers", "/gallery", "/about", "/location", "/contact", "/booking"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
