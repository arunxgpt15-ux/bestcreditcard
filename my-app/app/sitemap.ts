import type { MetadataRoute } from "next";
import { SITE } from "@/src/lib/site";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: SITE.url, lastModified: new Date() }]; }
