import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";

import { caseStudies } from "@/data/case-studies";

type WorkIndexProps = {
  onOpen: (file: string) => void;
};

/**
 * Project index list. On devices with a precise pointer, hovering a row shows a preview
 * that trails the cursor; on touch screens each row carries its own thumbnail instead.
 */
export function WorkIndex({ onOpen }: WorkIndexProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  // Keyboard focus also highlights rows, but the floating preview only follows a real pointer.
  const [pointerActive, setPointerActive] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function animate() {
    const preview = previewRef.current;
    if (!preview) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce ? 1 : 0.16;
    const dx = target.current.x - position.current.x;
    const dy = target.current.y - position.current.y;
    position.current.x += dx * ease;
    position.current.y += dy * ease;
    const tilt = reduce ? 0 : Math.max(-10, Math.min(10, dx * 0.08));
    preview.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0) translate(36px, -50%) rotate(${tilt}deg)`;
    frame.current = Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3 ? requestAnimationFrame(animate) : 0;
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (!pointerActive) setPointerActive(true);
    target.current = { x: event.clientX, y: event.clientY };
    if (hovered === null) position.current = { ...target.current };
    if (!frame.current) frame.current = requestAnimationFrame(animate);
  }

  return (
    <div
      className="work-index section-shell"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        setHovered(null);
        setPointerActive(false);
      }}
    >
      <div className="section-kicker">
        <span>THE FULL INDEX</span>
        <span className="work-index-hint-pointer">HOVER TO PREVIEW · CLICK TO OPEN</span>
        <span className="work-index-hint-touch">TAP A PROJECT TO OPEN</span>
      </div>
      <ol className="work-index-list">
        {caseStudies.map((study, index) => (
          <li key={study.id}>
            <button
              type="button"
              className={`work-index-row${hovered === index ? " is-hovered" : ""}`}
              onPointerEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              onClick={() => onOpen(study.images[0].file)}
            >
              <span className="work-index-number">{study.id}</span>
              <span className="work-index-title">{study.shortTitle ?? study.title}</span>
              <span className="work-index-discipline">{study.discipline}</span>
              <span className="work-index-frames">
                {study.images.length} {study.images.length === 1 ? "frame" : "frames"}
              </span>
              <img
                className="work-index-thumb"
                src={`/portfolio/${study.images[0].file}-720.jpg`}
                alt=""
                width={720}
                height={900}
                loading="lazy"
                decoding="async"
              />
              <ArrowUpRight className="work-index-arrow" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
      <div
        className="work-index-preview"
        ref={previewRef}
        data-visible={hovered !== null && pointerActive}
        aria-hidden="true"
      >
        {caseStudies.map((study, index) => (
          <img
            key={study.id}
            className={index === hovered ? "is-active" : undefined}
            src={`/portfolio/${study.images[0].file}-720.jpg`}
            alt=""
            width={720}
            height={900}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}
