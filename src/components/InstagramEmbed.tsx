import { useEffect } from "react";
import { Instagram } from "lucide-react";

type InstagramWindow = Window & {
  instgrm?: { Embeds?: { process?: () => void } };
};

function getInstagramPermalink(value: string): string | null {
  try {
    const url = new URL(value);
    const validHost = url.hostname === "instagram.com" || url.hostname === "www.instagram.com";
    const validPath = /^\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname);

    if (url.protocol !== "https:" || !validHost || !validPath) return null;
    return `https://www.instagram.com${url.pathname}`;
  } catch {
    return null;
  }
}

export function InstagramEmbed({ url, label }: { url: string; label: string }) {
  const permalink = getInstagramPermalink(url);

  useEffect(() => {
    if (!permalink) return;

    const processEmbeds = () => {
      (window as InstagramWindow).instgrm?.Embeds?.process?.();
    };
    const existingScript = document.getElementById("instagram-embed-script");

    if (existingScript) {
      if ((window as InstagramWindow).instgrm?.Embeds?.process) {
        processEmbeds();
      } else {
        existingScript.addEventListener("load", processEmbeds, { once: true });
      }

      return () => existingScript.removeEventListener("load", processEmbeds);
    }

    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.addEventListener("load", processEmbeds, { once: true });
    document.body.appendChild(script);

    return () => script.removeEventListener("load", processEmbeds);
  }, [permalink]);

  if (!permalink) {
    return (
      <div className="instagram-placeholder" aria-label={`${label}: Instagram embed placeholder`}>
        <span className="placeholder-index">— / AV</span>
        <Instagram aria-hidden="true" className="placeholder-icon" />
        <span className="placeholder-label">Instagram post placeholder</span>
        <span className="placeholder-category">{label}</span>
      </div>
    );
  }

  return (
    <div className="instagram-embed">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
      >
        <a href={permalink} target="_blank" rel="noreferrer">
          View {label} on Instagram
        </a>
      </blockquote>
    </div>
  );
}