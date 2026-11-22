import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Instagram,
  Menu,
  MoveUpRight,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InstagramEmbed } from "@/components/InstagramEmbed";
import { portfolioItems, type PortfolioCategory } from "@/data/portfolio";

const instagramUrl = "https://www.instagram.com/avdesign.in/";
const whatsappNumber = "917351386456";
const mascotUrl = "/av-designs-mascot.png";
const categories = ["All", "Product", "Brand", "Fashion", "Social"] as const;
const services = [
  "AI Product Posters",
  "Social Media Ad Creatives",
  "Brand Identity & Branding",
  "Product Photography & Visuals",
  "Apparel & Fashion Campaigns",
  "Social Media Content Design",
] as const;
const budgets = ["Under ₹10,000", "₹10,000–₹25,000", "₹25,000–₹50,000", "₹50,000+", "Not sure yet"] as const;

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Add your name.").max(80, "Keep your name under 80 characters."),
  business: z
    .string()
    .trim()
    .min(2, "Add your business name.")
    .max(100, "Keep your business name under 100 characters."),
  email: z.string().trim().email("Enter a valid email address.").max(254, "Email address is too long."),
  service: z.enum(services, { errorMap: () => ({ message: "Choose a service." }) }),
  budget: z.enum(budgets, { errorMap: () => ({ message: "Choose a budget range." }) }),
  details: z
    .string()
    .trim()
    .min(20, "Share a little more about your project (at least 20 characters).")
    .max(1400, "Keep project details under 1,400 characters."),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AV DESIGNS — Creative & Digital Marketing Studio" },
      {
        name: "description",
        content:
          "AV DESIGNS creates bold brand identities, product visuals, and digital campaigns for brands ready to stand out.",
      },
      { property: "og:title", content: "AV DESIGNS — Creative & Digital Marketing Studio" },
      {
        property: "og:description",
        content: "Creative visuals, bold identities, and digital experiences made to be impossible to ignore.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [formMessage, setFormMessage] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  const visiblePortfolio = portfolioItems.filter(
    (item) => activeCategory === "All" || item.category === (activeCategory as PortfolioCategory),
  );

  function handleEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");
    setWhatsappLink("");

    const values = Object.fromEntries(new FormData(event.currentTarget));
    const result = enquirySchema.safeParse(values);

    if (!result.success) {
      setFormMessage(result.error.issues[0]?.message ?? "Please check the form and try again.");
      return;
    }

    const { name, business, email, service, budget, details } = result.data;
    const message = [
      "Hello AV DESIGNS, I’d like to discuss a project.",
      `Name: ${name}`,
      `Business: ${business}`,
      `Email: ${email}`,
      `Service: ${service}`,
      `Budget: ${budget}`,
      `Project details: ${details}`,
    ].join("\n");
    const destination = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    setWhatsappLink(destination);
    setFormMessage("Your message is ready. Open WhatsApp to review and send it.");
    window.open(destination, "_blank", "noopener,noreferrer");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <a href="#top" className="brand-lockup" aria-label="AV DESIGNS home" onClick={closeMenu}>
            <span className="brand-monogram">AV<span>.</span></span>
            <span className="brand-caption">DESIGNS<br />STUDIO</span>
          </a>
          <nav className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
            <a href="#about" onClick={closeMenu}>Studio</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#work" onClick={closeMenu}>Selected work</a>
            <a href="#process" onClick={closeMenu}>Process</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </nav>
          <a className="header-cta" href="#contact">
            Start a project <ArrowUpRight aria-hidden="true" />
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mobile-menu-button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
        <div id="mobile-navigation" className="mobile-nav-panel" data-open={menuOpen}>
          <nav aria-label="Mobile navigation">
            <a href="#about" onClick={closeMenu}>Studio <ArrowUpRight aria-hidden="true" /></a>
            <a href="#services" onClick={closeMenu}>Services <ArrowUpRight aria-hidden="true" /></a>
            <a href="#work" onClick={closeMenu}>Selected work <ArrowUpRight aria-hidden="true" /></a>
            <a href="#process" onClick={closeMenu}>Process <ArrowUpRight aria-hidden="true" /></a>
            <a href="#contact" onClick={closeMenu}>Contact <ArrowUpRight aria-hidden="true" /></a>
          </nav>
        </div>
      </header>

      <section className="hero-section" id="top" aria-labelledby="hero-title">
        <div className="hero-wrap section-shell">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Independent creative studio</p>
            <h1 id="hero-title">WE MAKE<br />BRANDS<br /><span>IMPOSSIBLE</span><br />TO IGNORE.</h1>
            <div className="hero-bottomline">
              <p>Creative visuals. Bold identities. Digital experiences that make your brand stand out.</p>
              <a className="text-link hero-work-link" href="#work">Explore our work <ArrowDownRight aria-hidden="true" /></a>
            </div>
          </div>
          <div className="hero-art" aria-label="AV DESIGNS mascot">
            <span className="hero-orbit hero-orbit-one" aria-hidden="true" />
            <span className="hero-orbit hero-orbit-two" aria-hidden="true" />
            <img src={mascotUrl} alt="AV DESIGNS ghost mascot wearing headphones" fetchPriority="high" />
            <span className="art-index">A little<br />studio spirit <Sparkles aria-hidden="true" /></span>
          </div>
          <div className="hero-footer-row">
            <span>Visuals with a point of view.</span>
            <a className="scroll-cue" href="#about">Scroll to explore <ArrowDown aria-hidden="true" /></a>
            <span>01 — 06</span>
          </div>
        </div>
      </section>

      <section className="intro-section section-shell" id="about" aria-labelledby="about-title">
        <div className="section-kicker"><span>01 / THE STUDIO</span><span>AV DESIGNS · CREATIVE & DIGITAL</span></div>
        <div className="intro-grid">
          <h2 id="about-title">Good design<br />gets <em>noticed.</em><br />Great design<br />gets remembered.</h2>
          <div className="intro-copy">
            <p className="eyebrow">Built to make you stand out</p>
            <p>AV DESIGNS is a creative and digital marketing studio helping businesses communicate with clarity, character, and conviction.</p>
            <p>From the first spark of a brand to the final campaign visual, we make thoughtful work that gives good ideas a sharper edge.</p>
            <a href="#services" className="text-link">Meet the studio’s craft <ArrowDownRight aria-hidden="true" /></a>
          </div>
        </div>
        <div className="intro-signoff"><span>Small details. Big presence.</span><span className="signoff-mark">AV<span>.</span></span></div>
      </section>

      <section className="services-section" id="services" aria-labelledby="services-title">
        <div className="section-shell">
          <div className="section-kicker"><span>02 / WHAT WE DO</span><span>IDEA TO IMPACT</span></div>
          <div className="services-heading">
            <h2 id="services-title">Made to<br /><em>make a mark.</em></h2>
            <p>Distinctive creative for every place your brand shows up.</p>
          </div>
          <div className="service-list">
            {services.map((service, index) => (
              <a className="service-row" href="#contact" key={service}>
                <span className="service-number">0{index + 1}</span>
                <span className="service-name">{service}</span>
                <span className="service-arrow"><ArrowUpRight aria-hidden="true" /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="work-section section-shell" id="work" aria-labelledby="work-title">
        <div className="section-kicker"><span>03 / SELECTED WORK</span><span>FROM THE AV DESIGNS INSTAGRAM</span></div>
        <div className="work-heading">
          <div>
            <h2 id="work-title">Work that<br /><em>speaks first.</em></h2>
            <p>A living collection of visuals from the studio.</p>
          </div>
          <a className="text-link instagram-link" href={instagramUrl} target="_blank" rel="noreferrer">
            <Instagram aria-hidden="true" /> Follow on Instagram <MoveUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="portfolio-toolbar" aria-label="Filter Instagram posts">
          <div className="portfolio-filters" role="group" aria-label="Filter portfolio by category">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                variant="ghost"
                size="sm"
                className={`filter-chip${activeCategory === category ? " is-active" : ""}`}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <span className="portfolio-count">{String(visiblePortfolio.length).padStart(2, "0")} POSTS</span>
        </div>
        <div className="portfolio-grid">
          {visiblePortfolio.map((item) => (
            <article className="portfolio-item" key={item.id}>
              <InstagramEmbed url={item.instagramUrl} label={item.label} />
              <div className="portfolio-caption"><span>{item.label}</span><span>{item.category}</span></div>
            </article>
          ))}
        </div>
        <div className="portfolio-bottomline">
          <span>Thirteen public posts, organized by creative category.</span>
          <a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">Visit @avdesign.in <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </section>

      <section className="process-section" id="process" aria-labelledby="process-title">
        <div className="section-shell">
          <div className="section-kicker"><span>04 / HOW WE WORK</span><span>GOOD THINGS, WITH INTENTION</span></div>
          <div className="process-heading">
            <h2 id="process-title">Clear thinking.<br /><em>Beautiful doing.</em></h2>
            <p>A considered process keeps the work focused, collaborative, and true to your brand.</p>
          </div>
          <ol className="process-list">
            {[
              ["01", "Discover", "We get to know your brand, your audience, and what you want to change."],
              ["02", "Strategy", "We find the clearest direction for the idea and the people it needs to reach."],
              ["03", "Design", "We shape the direction into thoughtful, distinctive creative."],
              ["04", "Delivery", "Polished, ready-to-use work, shared with care and clarity."],
            ].map(([number, title, description]) => (
              <li className="process-step" key={number}>
                <span className="process-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <ArrowUpRight className="process-arrow" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="principles-section section-shell" aria-labelledby="principles-title">
        <div className="section-kicker"><span>05 / THE AV WAY</span><span>THE THINGS THAT MATTER</span></div>
        <div className="principles-grid">
          <div className="principles-intro">
            <p className="eyebrow">A little more thought in every frame</p>
            <h2 id="principles-title">Not just<br />good-looking.<br /><em>Good for you.</em></h2>
          </div>
          <div className="principle-list">
            <article><span>01</span><div><h3>Creative thinking</h3><p>Ideas begin with your brand, not a template.</p></div><Check aria-hidden="true" /></article>
            <article><span>02</span><div><h3>Attention to detail</h3><p>Every choice has a reason. Every finish feels considered.</p></div><Check aria-hidden="true" /></article>
            <article><span>03</span><div><h3>Premium presentation</h3><p>Work with the polish to earn a second look.</p></div><Check aria-hidden="true" /></article>
            <article><span>04</span><div><h3>Made for your brand</h3><p>Personalized creative, shaped around your goals.</p></div><Check aria-hidden="true" /></article>
          </div>
        </div>
      </section>

      <section className="faq-section" id="faq" aria-labelledby="faq-title">
        <div className="section-shell faq-layout">
          <div className="faq-intro">
            <div className="section-kicker"><span>06 / GOOD TO KNOW</span></div>
            <h2 id="faq-title">The little<br /><em>details.</em></h2>
            <p>Something else on your mind? We’re happy to talk it through.</p>
            <a className="text-link" href="#contact">Ask us anything <ArrowDownRight aria-hidden="true" /></a>
          </div>
          <div className="faq-list">
            <details>
              <summary>What kind of projects do you take on?<span aria-hidden="true">+</span></summary>
              <p>We work across branding, product visuals, social campaigns, fashion, and digital content. Tell us what you have in mind and we’ll explore the right fit.</p>
            </details>
            <details>
              <summary>How is pricing decided?<span aria-hidden="true">+</span></summary>
              <p>Every quote is shaped around the project, deliverables, and scope. Share a few details and we’ll come back with a tailored estimate.</p>
            </details>
            <details>
              <summary>How do revisions work?<span aria-hidden="true">+</span></summary>
              <p>Revision rounds are agreed as part of each project’s scope, so expectations are clear before the work begins.</p>
            </details>
            <details>
              <summary>How long does a project take?<span aria-hidden="true">+</span></summary>
              <p>Timing depends on the brief and deliverables. We’ll confirm a realistic schedule with your proposal before starting.</p>
            </details>
            <details>
              <summary>Can you create something custom?<span aria-hidden="true">+</span></summary>
              <p>Absolutely. If your project doesn’t fit neatly into a service, tell us about it and we’ll shape an approach around your needs.</p>
            </details>
            <details>
              <summary>How do we get started?<span aria-hidden="true">+</span></summary>
              <p>Send a note through the enquiry form or start a conversation on WhatsApp. A clear first idea is all you need.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="section-shell">
          <div className="section-kicker"><span>07 / YOUR NEXT MOVE</span><span>LET’S MAKE SOMETHING MATTER</span></div>
          <div className="contact-heading">
            <h2 id="contact-title">Have a brand<br />in <em>mind?</em></h2>
            <p>Tell us what you’re building. We’ll take it from there, together.</p>
          </div>
          <div className="contact-grid">
            <div className="contact-aside">
              <span className="contact-aside-mark">AV<span>.</span></span>
              <p>Good things start<br />with a conversation.</p>
              <a className="contact-direct-link" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                <span>Prefer WhatsApp?</span><ArrowUpRight aria-hidden="true" />
              </a>
              <a className="contact-direct-link" href={instagramUrl} target="_blank" rel="noreferrer">
                <span>Find us on Instagram</span><ArrowUpRight aria-hidden="true" />
              </a>
              <img src={mascotUrl} alt="" loading="lazy" className="contact-mascot" />
            </div>
            <form className="enquiry-form" onSubmit={handleEnquiry} noValidate>
              <div className="form-row">
                <label className="form-field"><span>Your name</span><Input name="name" autoComplete="name" placeholder="Name" maxLength={80} required /></label>
                <label className="form-field"><span>Business name</span><Input name="business" autoComplete="organization" placeholder="Brand or business" maxLength={100} required /></label>
              </div>
              <div className="form-row">
                <label className="form-field"><span>Email address</span><Input type="email" name="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required /></label>
                <label className="form-field"><span>Service required</span>
                  <select className="field-control" name="service" defaultValue="" required>
                    <option value="" disabled>Select a service</option>
                    {services.map((service) => <option value={service} key={service}>{service}</option>)}
                  </select>
                </label>
              </div>
              <label className="form-field"><span>Budget range</span>
                <select className="field-control" name="budget" defaultValue="" required>
                  <option value="" disabled>Select a range</option>
                  {budgets.map((budget) => <option value={budget} key={budget}>{budget}</option>)}
                </select>
              </label>
              <label className="form-field"><span>Tell us about your project</span><Textarea name="details" placeholder="What are you working on? What would you like to create?" rows={4} maxLength={1400} required /></label>
              <div className="form-submit-row">
                <Button type="submit" className="cta-button">Prepare WhatsApp message <ArrowUpRight aria-hidden="true" /></Button>
                <span>Opens WhatsApp to review and send.<br />This site does not store form submissions.</span>
              </div>
              {formMessage && <p className="form-status" role="status">{formMessage}</p>}
              {whatsappLink && (
                <a className="whatsapp-fallback" href={whatsappLink} target="_blank" rel="noreferrer">
                  Continue to WhatsApp <ArrowRight aria-hidden="true" />
                </a>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-shell">
          <div className="footer-top">
            <a href="#top" className="brand-lockup" aria-label="AV DESIGNS home">
              <span className="brand-monogram">AV<span>.</span></span>
              <span className="brand-caption">DESIGNS<br />STUDIO</span>
            </a>
            <p>Creative visuals.<br />Unforgettable brands.</p>
            <a className="footer-top-link" href="#top">Back to top <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <div className="footer-bottom">
            <span>© 2026 AV DESIGNS. Made with intent.</span>
            <div><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <ArrowUpRight aria-hidden="true" /></a><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight aria-hidden="true" /></a></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
