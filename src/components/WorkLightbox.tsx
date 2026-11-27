import { useCallback, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { imageSources } from "@/lib/portfolio-images";
import type { CaseStudy, CaseStudyImage } from "@/data/case-studies";

export type LightboxItem = { study: CaseStudy; image: CaseStudyImage };

type WorkLightboxProps = {
  items: LightboxItem[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

export function WorkLightbox({ items, index, onIndexChange }: WorkLightboxProps) {
  const current = index === null ? null : items[index];

  const step = useCallback(
    (direction: 1 | -1) => {
      if (index === null || items.length === 0) return;
      onIndexChange((index + direction + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  return (
    <Dialog open={current !== null} onOpenChange={(open) => !open && onIndexChange(null)}>
      <DialogContent className="pf-lightbox" onKeyDown={handleKeys}>
        {current && (
          <>
            <DialogTitle className="sr-only">{current.study.title}</DialogTitle>
            <DialogDescription className="sr-only">{current.image.alt}</DialogDescription>
            <figure className="pf-lightbox-figure">
              <img
                src={imageSources(current.image.file).src}
                alt={current.image.alt}
                width={current.image.width}
                height={current.image.height}
              />
              <figcaption>
                <span>{current.study.title}</span>
                <span>
                  {(index ?? 0) + 1} / {items.length}
                </span>
              </figcaption>
            </figure>
            {items.length > 1 && (
              <div className="pf-lightbox-nav">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                >
                  <ArrowLeft aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => step(1)}
                  aria-label="Next image"
                >
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
