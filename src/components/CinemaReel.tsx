import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUpRight, Instagram, Play } from "lucide-react";

import { WorkIndex } from "@/components/WorkIndex";
import { WorkLightbox, type LightboxItem } from "@/components/WorkLightbox";
import { caseStudies } from "@/data/case-studies";
import { imageSources } from "@/lib/portfolio-images";

const FPS = 24;
const REEL_SECONDS = 96;

function formatTimecode(progress: number) {
  const totalFrames = Math.round(progress * REEL_SECONDS * FPS);
  const frames = totalFrames % FPS;
  const seconds = Math.floor(totalFrames / FPS) % 60;
  const minutes = Math.floor(totalFrames / (FPS * 60));
  return ["00", minutes, seconds, frames].map((part) => String(part).padStart(2, "0")).join(":");
}

type CinemaReelProps = {
  instagramUrl: string;
  sampleUrl: string;
};

/**
 * "Now showing" work reel. On wide screens with motion allowed, the reel is pinned and
 * scrolls sideways as the page scrolls; everywhere else it is a swipeable strip.
 */
export function CinemaReel({ instagramUrl, sampleUrl }: CinemaReelProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxItems = useMemo<LightboxItem[]>(
    () => caseStudies.flatMap((study) => study.images.map((image) => ({ study, image }))),
    [],
  );

  const openStudy = useCallback(
    (file: string) => {
      const index = lightboxItems.findIndex((item) => item.image.file === file);
      if (index >= 0) setLightboxIndex(index);
    },
    [lightboxItems],
  );

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
    );
    const sync = () => setIsPinned(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const scenes = Array.from(track.querySelectorAll<HTMLElement>("[data-scene]"));
    let frame = 0;

    if (!isPinned) {
      pin.style.height = "";
      track.style.transform = "";
      scenes.forEach((scene) => {
        scene.style.removeProperty("--focus");
        scene.style.removeProperty("--shift");
        scene.style.removeProperty("--reveal");
      });

      const onStripScroll = () => {
        const strip = track.parentElement;
        if (!strip) return;
        const max = strip.scrollWidth - strip.clientWidth;
        const progress = max > 0 ? strip.scrollLeft / max : 0;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
        if (timecodeRef.current) timecodeRef.current.textContent = formatTimecode(progress);
      };
      const strip = track.parentElement;
      strip?.addEventListener("scroll", onStripScroll, { passive: true });
      onStripScroll();
      return () => strip?.removeEventListener("scroll", onStripScroll);
    }

    const stage = track.closest<HTMLElement>(".cinema-stage");
    // The stage sticks just below the site header, so it is shorter than the window.
    const stickyTop = () => (stage ? parseFloat(getComputedStyle(stage).top) || 0 : 0);
    const stageHeight = () => window.innerHeight - stickyTop();

    // How far the track slides: until the closing end card sits in the middle of the screen.
    const trackDistance = () => {
      const last = scenes[scenes.length - 1];
      if (!last) return 0;
      return Math.max(0, last.offsetLeft + last.offsetWidth / 2 - window.innerWidth / 2);
    };

    const measure = () => {
      pin.style.height = `${trackDistance() + stageHeight()}px`;
    };

    const targetProgress = () => {
      const rect = pin.getBoundingClientRect();
      const travel = pin.offsetHeight - stageHeight();
      const scrolled = stickyTop() - rect.top;
      return travel > 0 ? Math.min(1, Math.max(0, scrolled / travel)) : 0;
    };

    let current = -1;
    let lastActive = -1;

    const apply = (progress: number) => {
      track.style.transform = `translate3d(${-progress * trackDistance()}px, 0, 0)`;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      if (timecodeRef.current) timecodeRef.current.textContent = formatTimecode(progress);

      const width = window.innerWidth;
      const center = width / 2;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      scenes.forEach((scene, index) => {
        const box = scene.getBoundingClientRect();
        const signed = box.left + box.width / 2 - center;
        const offset = Math.abs(signed);
        const focus = Math.max(0, 1 - offset / (width * 0.75));
        // --focus drives scale/colour, --shift the parallax inside the frame, --reveal the clip.
        scene.style.setProperty("--focus", focus.toFixed(3));
        scene.style.setProperty("--shift", Math.max(-1, Math.min(1, signed / width)).toFixed(3));
        scene.style.setProperty("--reveal", Math.min(1, focus * 1.6).toFixed(3));
        if (offset < closestDistance) {
          closestDistance = offset;
          closest = index;
        }
      });
      if (closest !== lastActive) {
        lastActive = closest;
        setActiveScene(closest);
      }
    };

    // Ease towards the scroll position each frame, so the reel glides with a little inertia.
    const render = () => {
      frame = 0;
      const target = targetProgress();
      current = current < 0 ? target : current + (target - current) * 0.11;
      if (Math.abs(target - current) < 0.0004) current = target;
      apply(current);
      if (current !== target) frame = window.requestAnimationFrame(render);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    // Lazy images change the track's width after they load, so re-measure when it resizes.
    const observer = new ResizeObserver(onResize);
    observer.observe(track);

    measure();
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isPinned]);

  const sceneCount = String(caseStudies.length).padStart(2, "0");
  const activeTitle =
    activeScene < caseStudies.length
      ? caseStudies[activeScene].title
      : `Your brand · Scene ${String(caseStudies.length + 1).padStart(2, "0")}`;

  return (
    <section
      className={`cinema${isPinned ? " is-pinned" : ""}`}
      id="work"
      aria-labelledby="work-title"
    >
      <div className="cinema-titlecard">
        <div className="section-shell">
          <div className="section-kicker cinema-kicker">
            <span>03 / SELECTED WORK</span>
            <span className="cinema-rec">
              <span aria-hidden="true" className="cinema-rec-dot" /> NOW SHOWING · AV REEL 2026
            </span>
          </div>
          <div className="cinema-heading">
            <p className="cinema-presents">AV DESIGNS presents</p>
            <h2 id="work-title">
              Work that
              <br />
              <em>speaks first.</em>
            </h2>
            <p className="cinema-logline">
              {caseStudies.length} campaigns. One reel. Jewellery, skincare, streetwear and launch
              ads, made to stop the scroll. Keep scrolling to roll the film.
            </p>
            <a className="cinema-scrollcue" href="#work-reel">
              <span>Scroll to play</span>
              <span className="cinema-scrollcue-line" aria-hidden="true" />
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="cinema-pin" id="work-reel" ref={pinRef}>
        <div className="cinema-stage">
          <div className="cinema-letterbox cinema-letterbox-top" aria-hidden="true">
            <span>AV REEL · 35MM</span>
            <span ref={timecodeRef}>00:00:00:00</span>
          </div>

          <div className="cinema-strip">
            <div className="cinema-track" ref={trackRef}>
              {caseStudies.map((study, index) => {
                const poster = study.images[0];
                return (
                  <article
                    className={`cinema-scene${index === activeScene ? " is-active" : ""}`}
                    data-scene
                    key={study.id}
                    aria-labelledby={`scene-${study.id}`}
                  >
                    <span className="cinema-scene-bg" aria-hidden="true">
                      {study.id}
                    </span>
                    <button
                      type="button"
                      className="cinema-poster"
                      onClick={() => openStudy(poster.file)}
                      aria-label={`Open ${study.title} in full screen`}
                    >
                      <span className="cinema-frame">
                        <img
                          {...imageSources(poster.file)}
                          sizes="(max-width: 899px) 78vw, 34vw"
                          alt={poster.alt}
                          width={poster.width}
                          height={poster.height}
                          loading={index < 2 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </span>
                      <span className="cinema-play" aria-hidden="true">
                        <Play />
                      </span>
                    </button>
                    <div className="cinema-scene-meta">
                      <span className="cinema-scene-number">
                        SCENE {study.id} <span>/ {sceneCount}</span>
                      </span>
                      <h3 id={`scene-${study.id}`}>{study.title}</h3>
                      <p className="cinema-scene-discipline">{study.discipline}</p>
                      <p className="cinema-scene-summary">{study.summary}</p>
                      <button
                        type="button"
                        className="cinema-watch"
                        onClick={() => openStudy(poster.file)}
                      >
                        <Play aria-hidden="true" /> Watch the cut
                        <span>
                          {study.images.length} {study.images.length === 1 ? "frame" : "frames"}
                        </span>
                      </button>
                      {study.images.length > 1 && (
                        <div
                          className="cinema-thumbs"
                          aria-label={`More frames from ${study.title}`}
                        >
                          {study.images.slice(1).map((image) => (
                            <button
                              type="button"
                              key={image.file}
                              onClick={() => openStudy(image.file)}
                              aria-label={`Open frame: ${image.alt}`}
                            >
                              <img
                                src={`/portfolio/${image.file}-720.jpg`}
                                alt=""
                                width={720}
                                height={900}
                                loading="lazy"
                                decoding="async"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}

              <article
                className="cinema-scene cinema-endcard"
                data-scene
                aria-labelledby="scene-end"
              >
                <span className="cinema-scene-bg" aria-hidden="true">
                  {String(caseStudies.length + 1).padStart(2, "0")}
                </span>
                <p className="cinema-presents">Coming soon</p>
                <h3 id="scene-end">
                  Your brand.
                  <br />
                  <em>Scene {String(caseStudies.length + 1).padStart(2, "0")}.</em>
                </h3>
                <p>
                  Send one product photo. We’ll design your first ad free, so you can judge the
                  quality first.
                </p>
                <div className="cinema-endcard-actions">
                  <a
                    className="cta-button pf-cta"
                    href={sampleUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get 1 free design <ArrowUpRight aria-hidden="true" />
                  </a>
                  <Link className="text-link" to="/portfolio">
                    Full case studies <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </div>
          </div>

          <div className="cinema-letterbox cinema-letterbox-bottom">
            <span className="cinema-progress" aria-hidden="true">
              <span ref={progressRef} />
            </span>
            <span className="cinema-now">
              Now playing <strong>{activeTitle}</strong>
            </span>
            <span className="cinema-counter" aria-live="polite">
              {String(Math.min(activeScene + 1, caseStudies.length)).padStart(2, "0")} /{" "}
              {sceneCount}
            </span>
            <a className="cinema-ig" href={instagramUrl} target="_blank" rel="noreferrer">
              <Instagram aria-hidden="true" /> @avdesign.in
            </a>
          </div>
        </div>
      </div>

      <WorkIndex onOpen={openStudy} />

      <div className="cinema-credits" aria-label="Brands in this reel">
        <div className="cinema-credits-track">
          {[0, 1].map((loop) => (
            <span key={loop} aria-hidden={loop === 1}>
              {caseStudies.map((study) => (
                <span key={study.id}>
                  {study.title}
                  <i aria-hidden="true">✦</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <p className="cinema-disclaimer section-shell">
        Concept work: every brand in this reel is fictional and created by AV DESIGNS to show our
        style.
      </p>

      <WorkLightbox items={lightboxItems} index={lightboxIndex} onIndexChange={setLightboxIndex} />
    </section>
  );
}
