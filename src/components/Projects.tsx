import type { CSSProperties } from "react";
import { projects, type Project } from "@/data/projects";

const deferredImageProps = {
  decoding: "async",
  loading: "lazy"
} as const;

type Theme = {
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  panel: string;
  tileBg: string;
  tileFg: string;
};

const projectThemes: Record<string, Theme> = {
  bonghemia: {
    bg: "#0d120f",
    fg: "#f4f1eb",
    muted: "rgba(244, 241, 235, 0.66)",
    accent: "#fbb040",
    panel: "rgba(255, 255, 255, 0.06)",
    tileBg: "#16271f",
    tileFg: "#f4f1eb"
  },
  "dopamine-tour": {
    bg: "#07102a",
    fg: "#fefaeb",
    muted: "rgba(254, 250, 235, 0.7)",
    accent: "#73c9e6",
    panel: "rgba(255, 255, 255, 0.08)",
    tileBg: "#73c9e6",
    tileFg: "#10111d"
  },
  "syndikat-legal": {
    bg: "#062924",
    fg: "#eef5f1",
    muted: "rgba(238, 245, 241, 0.68)",
    accent: "#b9dcc6",
    panel: "rgba(185, 220, 198, 0.1)",
    tileBg: "#072924",
    tileFg: "#b9dcc6"
  },
  dvorek: {
    bg: "#d2360f",
    fg: "#fff4df",
    muted: "rgba(255, 244, 223, 0.78)",
    accent: "#1d1d1b",
    panel: "rgba(255, 244, 223, 0.12)",
    tileBg: "#d2360f",
    tileFg: "#fff4df"
  },
  "houby-space": {
    bg: "#3f6b58",
    fg: "#f4ecc4",
    muted: "rgba(244, 236, 196, 0.76)",
    accent: "#f48dad",
    panel: "rgba(255, 255, 255, 0.1)",
    tileBg: "#f4ecc4",
    tileFg: "#2d4437"
  },
  "cafe-olbracht": {
    bg: "#fdf1d3",
    fg: "#181818",
    muted: "rgba(24, 24, 24, 0.66)",
    accent: "#6a5652",
    panel: "rgba(24, 24, 24, 0.07)",
    tileBg: "#fdf1d3",
    tileFg: "#181818"
  },
  cotyploty: {
    bg: "#004643",
    fg: "#f0ede4",
    muted: "rgba(240, 237, 228, 0.72)",
    accent: "#f0ede4",
    panel: "rgba(255, 255, 255, 0.08)",
    tileBg: "#004643",
    tileFg: "#f0ede4"
  }
};

const detailContent: Record<
  string,
  {
    kicker: string;
    lead: string;
    category: string;
    systemTitle: string;
    ideaTitle: string;
    galleryTitle: string;
  }
> = {
  bonghemia: {
    kicker: "Branding · Creative Direction",
    lead:
      "Značka, kterou jsme spoluzaložili, abychom spojovali konopnou komunitu, bourali stereotypy a ukázali, že komunikace kolem konopí může být chytrá, vtipná, otevřená a fér.",
    category: "Lifestyle brand",
    systemTitle: "Logo & brand aplikace",
    ideaTitle: "Od nápadu ke značce",
    galleryTitle: "Vizuální svět značky"
  },
  "dopamine-tour": {
    kicker: "City experience",
    lead: "Tours designed for fast minds. The walking tour for people who usually hate walking tours.",
    category: "Turistická tour",
    systemTitle: "Logo & barevný systém",
    ideaTitle: "Logo jako dopaminová molekula",
    galleryTitle: "Vizuální svět značky"
  },
  "syndikat-legal": {
    kicker: "Advokátní kancelář",
    lead:
      "Identita pro právní tým, která stojí na důvěře, jasné typografii a výrazné zelené paletě místo starých oborových klišé.",
    category: "Advokátní kancelář",
    systemTitle: "Logo & vizuální systém",
    ideaTitle: "Právo bez těžkopádnosti",
    galleryTitle: "Brand aplikace"
  },
  dvorek: {
    kicker: "Lokální cafe & bistro",
    lead:
      "Jednoduchá značka pro místo, které má být přístupné, zapamatovatelné a živé od loga přes menu až po malé ilustrace.",
    category: "Cafe & bistro",
    systemTitle: "Ilustrace & identita",
    ideaTitle: "Lokální značka s lidským jazykem",
    galleryTitle: "Aplikace značky"
  },
  "houby-space": {
    kicker: "Psychedelic lifestyle",
    lead:
      "Brand, který propojuje produktový svět, koláže, fotografii a výraznou barevnost do jedné hravé vizuální řeči.",
    category: "Lifestyle brand",
    systemTitle: "Koláže & produktový systém",
    ideaTitle: "Vizuální jazyk komunity",
    galleryTitle: "Vizuální svět značky"
  },
  "cafe-olbracht": {
    kicker: "Kavárna",
    lead:
      "Kavárenská identita postavená na ilustraci, lokálním charakteru a drobných motivech, které fungují v prostoru i na sociálních sítích.",
    category: "Kavárna",
    systemTitle: "Ilustrace & značka",
    ideaTitle: "Kavárna s vlastním rukopisem",
    galleryTitle: "Vybrané výstupy"
  },
  cotyploty: {
    kicker: "Montáž plotů",
    lead:
      "Výrazná identita pro řemeslnou službu, která potřebuje být rychle čitelná, zapamatovatelná a použitelná v kampaních.",
    category: "Služby",
    systemTitle: "Logo & barevný systém",
    ideaTitle: "Srozumitelná značka pro službu",
    galleryTitle: "Brand aplikace"
  }
};

function getTheme(project: Project) {
  return projectThemes[project.id] ?? {
    bg: project.palette[0],
    fg: "#f4f1eb",
    muted: "rgba(244, 241, 235, 0.7)",
    accent: project.palette[1] ?? "#f4f1eb",
    panel: "rgba(255,255,255,0.08)",
    tileBg: project.palette[0],
    tileFg: "#f4f1eb"
  };
}

function cssVars(project: Project) {
  const theme = getTheme(project);
  return {
    "--case-bg": theme.bg,
    "--case-fg": theme.fg,
    "--case-muted": theme.muted,
    "--case-accent": theme.accent,
    "--case-panel": theme.panel,
    "--tile-bg": theme.tileBg,
    "--tile-fg": theme.tileFg
  } as CSSProperties;
}

function getDetail(project: Project) {
  return detailContent[project.id] ?? {
    kicker: project.category,
    lead: project.description,
    category: project.category,
    systemTitle: "Logo & vizuální systém",
    ideaTitle: "Od nápadu ke značce",
    galleryTitle: "Vizuální svět značky"
  };
}

function imageFitClass(src: string, role: "hero" | "feature" | "gallery" = "gallery") {
  const coverHero = /radnice|lifestyle|prague|olbracht|moment|grow/i.test(src);
  const containedAsset =
    /logo|desky|instagram|poradenstvi|book-your-hit|five-senses|sight|loyalty|pattern|menu|brand|visual|kit|packaging|symbol|banner/i.test(
      src
    );

  if (role === "hero" && coverHero) return "is-cover";
  return containedAsset ? "is-contained" : "is-cover";
}

function swatchTextColor(hex: string) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((part) => part + part).join("")
    : normalized;
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.58 ? "#070918" : "#f6f0e4";
}

function cardImages(project: Project) {
  const baseImage =
    project.id === "dopamine-tour" || project.id === "syndikat-legal" ? project.hero : project.cardImage;
  const hoverImage = baseImage === project.hero ? project.cardImage : project.hero;
  return { baseImage, hoverImage };
}

export function Projects() {
  return (
    <section className="section projects-section" id="projekty">
      <div className="section-head projects-head">
        <h2>Vybrané projekty</h2>
        <a href="#collabs">Spolupráce →</a>
      </div>

      <div className="project-grid">
        {projects.map((project) => {
          const { baseImage, hoverImage } = cardImages(project);

          return (
            <a
              key={project.id}
              className={`project-card project-${project.id}`}
              href={`#${project.id}`}
              style={cssVars(project)}
            >
              <figure className="project-media">
                <img className="project-card-image" src={baseImage} alt="" {...deferredImageProps} />
                <img className="project-card-hover-image" src={hoverImage} alt="" {...deferredImageProps} />
                <img className="project-logo" src={project.logo} alt={`${project.name} logo`} {...deferredImageProps} />
                <span className="project-hover-label">Zobrazit projekt</span>
              </figure>
              <div className="project-meta">
                <span>{project.category}</span>
                <span>{project.year}</span>
              </div>
              <h3>{project.displayName}</h3>
              <p>{project.description}</p>
              <div className="tag-row">
                {project.services.map((service) => (
                  <span key={service}>{service}</span>
                ))}
              </div>
            </a>
          );
        })}
      </div>

      {projects.map((project) => (
        <ProjectOverlay key={project.id} project={project} />
      ))}
    </section>
  );
}

function ProjectOverlay({ project }: { project: Project }) {
  const detail = getDetail(project);
  const feature = project.gallery[0];
  const gallery = project.gallery.slice(1);

  return (
    <div
      className="project-overlay"
      id={project.id}
      data-overlay-id={project.overlayId}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} detail projektu`}
    >
      <a className="overlay-backdrop" href="#projekty" aria-label="Zavřít projekt" />
      <article className={`overlay-panel detail-panel detail-${project.id}`} style={cssVars(project)}>
        <a className="overlay-close" data-project-close aria-label="Zavřít projekt" href="#projekty">
          &times;
        </a>

        <header className="detail-hero">
          <div className="detail-copy">
            <p className="detail-kicker">01 - {detail.kicker}</p>
            <h2>{project.displayName}</h2>
            <p className="detail-lead">{detail.lead}</p>
          </div>

          <figure className={`detail-hero-media ${imageFitClass(project.hero, "hero")}`}>
            <img src={project.hero} alt={`${project.name} hlavní vizuál`} {...deferredImageProps} />
          </figure>

          <div className="tag-row detail-tags">
            {project.services.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>

          <dl className="detail-meta-grid">
            <div>
              <dt>Studio</dt>
              <dd>vondrart</dd>
            </div>
            <div>
              <dt>Rok</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Kategorie</dt>
              <dd>{detail.category}</dd>
            </div>
          </dl>
        </header>

        <section className="detail-section detail-system">
          <p className="detail-number">02</p>
          <h3>{detail.systemTitle}</h3>
          {feature ? (
            <figure className={`detail-feature-media ${imageFitClass(feature.src, "feature")}`}>
              <img src={feature.src} alt={feature.alt} {...deferredImageProps} />
            </figure>
          ) : null}
        </section>

        <section className="detail-palette" aria-label={`${project.name} barevná paleta`}>
          {project.palette.map((color, index) => (
            <article key={color} style={{ backgroundColor: color, color: swatchTextColor(color) }}>
              <span>{index === 0 ? "Background" : index === 1 ? "Primary" : index === 2 ? "Accent" : "Tone"}</span>
              <strong>{color}</strong>
            </article>
          ))}
          <div className="detail-palette-gradient" style={{ background: `linear-gradient(100deg, ${project.palette.join(", ")})` }} />
        </section>

        <section className="detail-story">
          <p className="detail-number">03</p>
          <div>
            <h3>{detail.ideaTitle}</h3>
          </div>
          <div className="detail-story-copy">
            {project.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>{project.result}</p>
          </div>
        </section>

        <section className="detail-gallery-section">
          <p className="detail-number">05</p>
          <h3>{detail.galleryTitle}</h3>
          <div className="detail-gallery-grid">
            {gallery.map((item, index) => (
              <figure key={item.src} className={`${index % 3 === 0 ? "is-wide" : ""} ${imageFitClass(item.src)}`}>
                <img src={item.src} alt={item.alt} {...deferredImageProps} />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
