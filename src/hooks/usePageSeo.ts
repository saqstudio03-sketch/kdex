import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

/**
 * Dynamic titles, meta descriptions, Open Graph, canonical URLs and
 * product structured data (SEO requirement §24).
 */
export function usePageSeo({
  title,
  description,
  canonicalPath,
  ogType = "website",
  jsonLd,
}: SeoOptions) {
  useEffect(() => {
    document.title = title;
    if (description)
      upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    if (description)
      upsertMeta('meta[property="og:description"]', {
        property: "og:description",
        content: description,
      });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: ogType });

    if (canonicalPath) {
      const href = `https://kdex-games.example.com${canonicalPath}`;
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = href;
      upsertMeta('meta[property="og:url"]', { property: "og:url", content: href });
    }

    let script = document.getElementById("seo-jsonld") as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.id = "seo-jsonld";
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, canonicalPath, ogType, jsonLd]);
}
