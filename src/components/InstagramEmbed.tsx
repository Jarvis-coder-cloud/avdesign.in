import { useEffect } from "react";
import { Instagram } from "lucide-react";

type InstagramWindow = Window & {
  instgrm?: { Embeds?: { process?: () => void } };
};

let instagramScriptPromise: Promise<void> | null = null;
let instagramProcessTimer: number | null = null;

function loadInstagramScript() {
  if ((window as InstagramWindow).instgrm?.Embeds?.process) return Promise.resolve();
  if (instagramScriptPromise) return instagramScriptPromise;

  instagramScriptPromise = new Promise<void>((resolve) => {
    let script = document.getElementById("instagram-embed-script") as HTMLScriptElement | null;
    const finish = () => resolve();

    if (!script) {
      script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
    }

    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", finish, { once: true });
    if (!script.isConnected) document.body.appendChild(script);
  });

  return instagramScriptPromise;
}

function queueInstagramProcessing() {
  if (instagramProcessTimer !== null) return;

  instagramProcessTimer = window.setTimeout(() => {
    instagramProcessTimer = null;
    (window as InstagramWindow).instgrm?.Embeds?.process?.();
  }, 0);
}

function getInstagramPermalink(value: string): string | null {
  try {
    const url = new URL(value);
    const validHost = url.hostname === "instagram.com" || url.hostname === "www.instagram.com";
    const postMatch = url.pathname.match(/^\/(?:[A-Za-z0-9._]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)\/?$/);
    const profileMatch = url.pathname.match(/^\/([A-Za-z0-9._]+)\/?$/);
    const reservedProfileNames = new Set(["accounts", "direct", "explore", "p", "reel", "stories", "tv"]);
    const username = profileMatch?.[1]?.toLowerCase();
    const isProfile = Boolean(username && !reservedProfileNames.has(username));

    if (url.protocol !== "https:" || !validHost || (!postMatch && !isProfile)) return null;
    const normalizedPath = postMatch ? `/${postMatch[1]}/${postMatch[2]}/` : url.pathname;
    return `https://www.instagram.com${normalizedPath}`;
  } catch {
    return null;
  }
}

export function InstagramEmbed({
  url,
  label,
  kind = "post",
}: {
  url: string;
  label: string;
  kind?: "post" | "profile";
}) {
  const permalink = getInstagramPermalink(url);

  useEffect(() => {
    if (!permalink) return;

    let active = true;
    void loadInstagramScript().then(() => {
      if (active) queueInstagramProcessing();
    });

    return () => {
      active = false;
    };
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
    <div
      className={
        kind === "profile"
          ? "instagram-embed instagram-profile-embed"
          : "instagram-embed instagram-post-embed"
      }
    >
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
