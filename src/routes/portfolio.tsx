import { useCallback, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Expand, Instagram } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WorkLightbox, type LightboxItem } from "@/components/WorkLightbox";
import { caseStudies, caseStudyFilters, totalVisuals } from "@/data/case-studies";
import { imageSources } from "@/lib/portfolio-images";

const instagramUrl = "https://www.instagram.com/avdesign.in/";
const whatsappNumber = "917351386456";
const sampleMessage =
  "Hi AV DESIGNS, I saw your portfolio and I'd like a free sample design for my brand.";
const whatsappSampleUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(sampleMessage)}`;

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — AV DESIGNS" },
      {
        name: "description",
        content:
          "Selected campaigns, product ads and social visuals by AV DESIGNS: jewellery, skincare, streetwear and product launch work.",
      },
      { property: "og:title", content: "Portfolio — AV DESIGNS" },
      {
        property: "og:description",
        content: "Campaigns, product ads and social visuals made to stop the scroll.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

type Filter = (typeof caseStudyFilters)[number];

function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleStudies = useMemo(
    () =>
      caseStudies.filter((study) => activeFilter === "All" || study.filters.includes(activeFilter)),
    [activeFilter],
  );

  const lightboxItems = useMemo<LightboxItem[]>(
    () => visibleStudies.flatMap((study) => study.images.map((image) => ({ study, image }))),
    [visibleStudies],
  );

  const openImage = useCallback(
    (file: string) => {
      const index = lightboxItems.findIndex((item) => item.image.file === file);
      if (index >= 0) setLightboxIndex(index);
    },
    [lightboxItems],
  );

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand-lockup" aria-label="AV DESIGNS home">
            <span className="brand-monogram">
              AV<span>.</span>
            </span>
            <span className="brand-caption">
              DESIGNS
              <br />
              STUDIO
            </span>
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link to="/">Home</Link>
            <Link to="/" hash="services">
              Services
            </Link>
            <a href="#work" aria-current="page">
              Portfolio
            </a>
            <Link to="/" hash="contact">
              Contact
            </Link>
          </nav>
          <a className="header-cta" href={whatsappSampleUrl} target="_blank" rel="noreferrer">
            Get a free sample <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="pf-hero" aria-labelledby="pf-title">
        <div className="section-shell">
          <div className="section-kicker">
            <span>PORTFOLIO / 2026</span>
            <span>SELECTED CONCEPT WORK</span>
          </div>
          <div className="pf-hero-grid">
            <div className="pf-hero-copy">
              <p className="eyebrow">
                <span className="eyebrow-dot" /> Campaigns · Product ads · Social
              </p>
              <h1 id="pf-title">
                Work that
                <br />
                <em>sells.</em>
              </h1>
              <p className="pf-hero-lead">
                Product photos turned into campaigns people stop for. Jewellery, skincare,
                streetwear and launch visuals, designed for the feed and built around one clear
                message.
              </p>
              <div className="pf-hero-actions">
                <a
                  className="cta-button pf-cta"
                  href={whatsappSampleUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get 1 free design <ArrowUpRight aria-hidden="true" />
                </a>
                <a className="text-link" href="#work">
                  View the work <ArrowDownRight aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="pf-hero-stack" aria-hidden="true">
              <img
                className="pf-stack-card pf-stack-back"
                {...imageSources("veil-form-2")}
                sizes="260px"
                alt=""
                width={1280}
                height={1600}
              />
              <img
                className="pf-stack-card pf-stack-mid"
                {...imageSources("form-09")}
                sizes="260px"
                alt=""
                width={1280}
                height={1600}
              />
              <img
                className="pf-stack-card pf-stack-front"
                {...imageSources("lumera-1")}
                sizes="300px"
                alt=""
                width={1280}
                height={1600}
                fetchPriority="high"
              />
            </div>
          </div>
          <dl className="pf-stats">
            <div>
              <dt>Projects</dt>
              <dd>{String(caseStudies.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Visuals</dt>
              <dd>{totalVisuals}</dd>
            </div>
            <div>
              <dt>Turnaround</dt>
              <dd>24–48h</dd>
            </div>
            <div>
              <dt>First design</dt>
              <dd>
                <em>Free</em>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="pf-work section-shell" id="work" aria-labelledby="pf-work-title">
        <h2 id="pf-work-title" className="sr-only">
          Projects
        </h2>
        <div className="portfolio-toolbar pf-toolbar">
          <div className="portfolio-filters" role="group" aria-label="Filter projects by type">
            {caseStudyFilters.map((filter) => (
              <Button
                key={filter}
                type="button"
                variant="ghost"
                size="sm"
                className={`filter-chip${activeFilter === filter ? " is-active" : ""}`}
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
          <span className="portfolio-count">
            {String(visibleStudies.length).padStart(2, "0")} PROJECTS
          </span>
        </div>

        <div className="pf-cases">
          {visibleStudies.map((study) => (
            <article
              className={`pf-case pf-case-${study.layout}`}
              key={study.id}
              aria-labelledby={`case-${study.id}`}
            >
              <header className="pf-case-head">
                <span className="pf-case-number">{study.id}</span>
                <div>
                  <p className="pf-case-discipline">{study.discipline}</p>
                  <h3 id={`case-${study.id}`}>{study.title}</h3>
                </div>
                <a
                  className="pf-case-ig"
                  href={study.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram aria-hidden="true" /> View post
                </a>
              </header>

              <div className="pf-case-body">
                <div className="pf-case-copy">
                  <p className="pf-case-summary">{study.summary}</p>
                  <div className="pf-case-detail">
                    <h4>The brief</h4>
                    <p>{study.brief}</p>
                  </div>
                  <div className="pf-case-detail">
                    <h4>What we did</h4>
                    <p>{study.approach}</p>
                  </div>
                  <ul className="pf-deliverables" aria-label="Deliverables">
                    {study.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className={`pf-gallery pf-gallery-${study.layout}`}>
                  {study.images.map((image, index) => (
                    <button
                      type="button"
                      className={`pf-shot${index === 0 ? " pf-shot-lead" : ""}`}
                      key={image.file}
                      onClick={() => openImage(image.file)}
                      aria-label={`Open larger view: ${image.alt}`}
                    >
                      <img
                        {...imageSources(image.file)}
                        sizes={
                          study.layout === "feature"
                            ? "(max-width: 760px) 100vw, 640px"
                            : "(max-width: 760px) 100vw, 420px"
                        }
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="pf-shot-zoom" aria-hidden="true">
                        <Expand />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="pf-disclaimer">
          All brands shown here (Lumera, Offgrid, Form/09, Atelier North, Veil/Form, Ember &amp;
          Oak, Frost &amp; Fresh and others) are fictional concepts created by AV DESIGNS to show
          our style. They are not client work.
        </p>
      </section>

      <section className="pf-cta-band" aria-labelledby="pf-cta-title">
        <div className="section-shell pf-cta-inner">
          <div>
            <div className="section-kicker">
              <span>YOUR BRAND NEXT</span>
              <span>FIRST DESIGN ON US</span>
            </div>
            <h2 id="pf-cta-title">
              Your product
              <br />
              could be <em>next.</em>
            </h2>
          </div>
          <div className="pf-cta-side">
            <p>
              Send one product photo and your brand name. We’ll design your first ad free, so you
              can judge the quality before paying anything.
            </p>
            <div className="pf-hero-actions">
              <a
                className="cta-button pf-cta"
                href={whatsappSampleUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get 1 free design on WhatsApp <ArrowUpRight aria-hidden="true" />
              </a>
              <a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">
                <Instagram aria-hidden="true" /> @avdesign.in
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-shell">
          <div className="footer-top">
            <Link to="/" className="brand-lockup" aria-label="AV DESIGNS home">
              <span className="brand-monogram">
                AV<span>.</span>
              </span>
              <span className="brand-caption">
                DESIGNS
                <br />
                STUDIO
              </span>
            </Link>
            <p>
              Creative visuals.
              <br />
              Unforgettable brands.
            </p>
            <Link className="footer-top-link" to="/">
              Back to home <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <div className="footer-bottom">
            <span>© 2026 AV DESIGNS. Made with intent.</span>
            <div>
              <a href={instagramUrl} target="_blank" rel="noreferrer">
                Instagram <ArrowUpRight aria-hidden="true" />
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                WhatsApp <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <WorkLightbox items={lightboxItems} index={lightboxIndex} onIndexChange={setLightboxIndex} />
    </main>
  );
}
