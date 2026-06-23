"use client";

import { useEffect } from "react";

/**
 * ScrollFX — pohybová vrstva (progressive enhancement) na NATIVNÍM scrollu.
 *
 *  • scroll reveal — sekce/nadpisy jednotlivě, mřížky jako koordinovaná skupina
 *  • jemný parallax dekorací
 *  • scroll-velocity marquee (rychlost + jemný skew dle scrollu)
 *  • magnetická tlačítka/odkazy + 3D tilt karet (kurzor)
 *  • plynulé skoky na sekční kotvy (nativní scrollIntoView)
 *  • úvodní „opona" při prvním načtení
 *
 * Záměrně BEZ smooth-scroll knihovny — nativní scroll je 100% spolehlivý
 * (nahoru i dolů, každé zařízení). Vše guardované přes prefers-reduced-motion
 * a (pointer: coarse). Bez JS zůstává web plně viditelný.
 */
export function ScrollFX() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const enableMotion = !reduceMotion && !coarse;

    root.classList.add("scroll-fx-ready");
    const cleanups: Array<() => void> = [];

    /* ----------------------------- INTRO ----------------------------- */
    // Koule + „vondrart studio" → koule PŘESNĚ dosedne na homepage auroru
    // (.blob-a) technikou FLIP a celé intro se s ní plynule prolne (crossfade),
    // takže přechod je bezešvý — koule vypadá identicky jako ta na webu.
    const curtain = document.querySelector<HTMLElement>(".intro-curtain");
    if (curtain) {
      if (reduceMotion) {
        curtain.style.display = "none"; // skrýt, NE remove (uzel renderuje React)
      } else {
        const orb = curtain.querySelector<HTMLElement>(".intro-orb");
        const brand = curtain.querySelector<HTMLElement>(".intro-brand");
        const blob = document.querySelector<HTMLElement>(".blob-a");
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          // NEodstraňovat z DOM — uzel renderuje React, remove() způsobí
          // insertBefore/NotFoundError při reconcile. Jen skrýt.
          curtain.style.display = "none";
        };
        const merge = () => {
          // FLIP: koule se PŘESNĚ přesune + zvětší na pozici/velikost aurory a
          // ZŮSTÁVÁ plně viditelná po celou dobu přesunu. (Base .intro-orb má
          // opacity:0 + scale(0.6); po vypnutí animace je proto musíme ručně
          // přebít, jinak koule zmizí dřív, než doletí.)
          let moved = false;
          if (orb && blob) {
            const o = orb.getBoundingClientRect();
            const b = blob.getBoundingClientRect();
            if (o.width > 0 && b.width > 0) {
              const scale = b.width / o.width;
              const dx = b.left + b.width / 2 - (o.left + o.width / 2);
              const dy = b.top + b.height / 2 - (o.top + o.height / 2);
              orb.style.animation = "none";
              orb.style.opacity = "1"; // DRŽ viditelnost
              orb.style.transform = "none"; // přebij base scale(0.6)
              void orb.offsetWidth; // reflow, ať transition naváže plynule
              orb.style.transition = "transform 1s cubic-bezier(0.65, 0, 0.35, 1)";
              orb.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
              moved = true;
            }
          }
          if (brand) {
            brand.style.animation = "none";
            brand.style.opacity = "1";
            void brand.offsetWidth;
            brand.style.transition = "opacity 0.45s ease, transform 0.45s ease";
            brand.style.opacity = "0";
            brand.style.transform = "translateY(-12px)";
          }
          // Až koule DOSEDNE na auroru, teprve pak prolnout krémovou oponu pryč
          // → bezešvý přechod koule → identická aurora pod ní.
          const fadeDelay = moved ? 1000 : 350;
          window.setTimeout(() => {
            curtain.style.transition = "opacity 0.6s ease";
            curtain.style.opacity = "0";
          }, fadeDelay);
          window.setTimeout(finish, fadeDelay + 750);
        };
        const start = window.setTimeout(merge, 1250); // po náletu koule + textu
        const safety = window.setTimeout(finish, 4200);
        cleanups.push(() => {
          window.clearTimeout(start);
          window.clearTimeout(safety);
        });
      }
    }

    /* ------------------------------- REVEAL -------------------------------- */
    // Jednotná, ucelená animace (fade + nájezd zdola; karty navíc scale-settle).
    // Mřížky se odhalují jako KOORDINOVANÁ SKUPINA — celá mřížka se zkomponuje
    // při příchodu do sekce (ne karta-po-kartě podle scrollu). Čistě opacity +
    // transform → kompozitor, takže to neseká.
    const singles: Array<[string, string]> = [
      [".hero-label", "fade"],
      [".hero-title .title-line", "up"],
      [".hero-desc", "fade"],
      [".hero-scroll", "fade"],
      [".section-head", "up"],
      [".about-section > *", "up"],
      [".contact-section > *", "up"],
      [".ill-top", "up"],
      [".ill-title-row", "up"]
    ];
    // [container, child, variant] — container je trigger, děti se odhalí naráz se staggerem
    const groups: Array<[string, string, string]> = [
      [".project-grid", ":scope > *", "card"],
      [".services-grid", ".service-item", "up"],
      [".collabs-grid", ".collab-item", "up"]
    ];

    const revealEls: Element[] = [];
    const tag = (el: Element, variant: string, index = 0, observe = true) => {
      if (el.hasAttribute("data-reveal")) return;
      el.setAttribute("data-reveal", variant);
      if (index) (el as HTMLElement).style.setProperty("--rv-i", String(index));
      if (observe) revealEls.push(el);
    };

    singles.forEach(([selector, variant]) => {
      document.querySelectorAll(selector).forEach((el) => tag(el, variant));
    });
    groups.forEach(([containerSel, childSel, variant]) => {
      document.querySelectorAll(containerSel).forEach((container) => {
        container.querySelectorAll(childSel).forEach((child, i) => tag(child, variant, i % 8, false));
        revealEls.push(container); // trigger (sám se neschovává)
      });
    });
    // Ilustrace — celá karta jako celek; odhalí se hromadně přes trigger carouselu.
    document.querySelectorAll(".ill-card").forEach((el, i) => tag(el, "card", i % 6, false));
    document.querySelectorAll(".ill-carousel").forEach((el) => revealEls.push(el));

    const reveal = (el: Element) => {
      el.classList.add("is-revealed");
      el.querySelectorAll?.("[data-reveal]:not(.is-revealed)").forEach((c) => c.classList.add("is-revealed"));
    };
    const inViewport = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(reveal);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        // threshold 0 + záporný spodní okraj → spustí se, když horní hrana prvku
        // přejde ~12 % nad spodek viewportu (sekce/mřížka „při příchodu").
        { threshold: 0, rootMargin: "0px 0px -12% 0px" }
      );
      revealEls.forEach((el) => (inViewport(el) ? reveal(el) : io.observe(el)));
      cleanups.push(() => io.disconnect());
    }

    /* ------------------- PLYNULÉ KOTVY (nativní, spolehlivé) ---------------- */
    // Skoky na sekční kotvy; odkazy projektových overlayů necháme nativní (:target).
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      if (target.closest(".project-overlay") || link.closest(".project-overlay")) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", href);
    };
    document.addEventListener("click", onAnchorClick);
    cleanups.push(() => document.removeEventListener("click", onAnchorClick));

    if (!enableMotion) {
      return () => {
        cleanups.forEach((fn) => fn());
        root.classList.remove("scroll-fx-ready");
      };
    }

    /* ----------------------------- PARALLAX -------------------------------- */
    // Marquee NEovládáme z JS — běží na vlastní konstantní CSS animaci (ticker),
    // takže se hýbe NEZÁVISLE na scrollu. Parallax běží jen PŘI scrollu (scroll
    // event + rAF flag), ne v nepřetržité smyčce → minimální zátěž, svižný scroll.
    type PItem = { el: HTMLElement; speed: number; base: number };
    const parallaxItems: PItem[] = [];
    const collect = (selector: string, speed: number) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.style.willChange = "transform";
        parallaxItems.push({ el, speed, base: 0 });
      });
    };
    collect(".dot-grid", 0.08);
    collect(".hero-side-label", 0.12);

    // AURORA jako fixní pozadí — jede dolů, nafukuje se a zjemňuje (řízeno scrollem).
    const aurora = document.querySelector<HTMLElement>(".hero-mesh");

    const measure = () => {
      const sy = window.scrollY;
      for (const it of parallaxItems) it.el.style.transform = "";
      for (const it of parallaxItems) {
        const r = it.el.getBoundingClientRect();
        it.base = r.top + sy + r.height / 2;
      }
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("load", measure);
    cleanups.push(() => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    });

    const applyParallax = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      for (const it of parallaxItems) {
        const rel = it.base - sy;
        if (rel < -vh || rel > vh * 2) continue;
        const offset = (sy + vh / 2 - it.base) * it.speed;
        it.el.style.transform = `translate3d(0, ${(-offset).toFixed(2)}px, 0)`;
      }

    };

    // AURORA (fixní pozadí) — plynulé houpání zleva↔doprava + výrazné
    // opakované nafukování/vyfukování, řízené scrollem. Cílové hodnoty
    // dotahujeme lerpem v samostatném rAF loopu → hedvábný pohyb i při
    // rychlém scrollu. Loop se po ustálení sám zastaví.
    // BARVA KOULE PODLE SCROLLU — růžová (nahoře) → oranžová (střed) → světlá modrá (dole).
    // hue-rotate (CSS var --blob-hue) na hlavní kouli .blob-a (a intro kouli); base
    // gradient je oranžová ~25°. 1. půlka rotace STOUPÁ (růžová→červená→oranžová), 2. půlka
    // KLESÁ (oranžová→magenta→fialová→modrá) → záměrně se VYHÝBÁ zelené. Vše ladí dohromady.
    // Hodnoty lze ladit (klient si může barvy doladit).
    const HUE_TOP = 305; //   p=0   → neon růžová (displayed ~330°)
    const HUE_MID = 360; //   p=0.5 → oranžová (≡ 0°, bez posunu)
    const HUE_BOTTOM = 190; // p=1  → světlá neon modrá (displayed ~215°), přes magentu/fialovou
    const scrollHue = (p: number) =>
      p <= 0.5
        ? HUE_TOP + (p / 0.5) * (HUE_MID - HUE_TOP)
        : HUE_MID + ((p - 0.5) / 0.5) * (HUE_BOTTOM - HUE_MID);

    // POZN. k výkonu: .hero-mesh dostává z JS jen translate3d (houpání L↔R) + opacity —
    // obojí je kompozitované (GPU), žádný repaint. „Dýchání" (scale) řeší CSS animace
    // floatA/B/C přímo na blobech (vlastní GPU vrstvy). Scale jsme z JS ODSTRANILI: scale
    // na nepromovaném .hero-mesh přerastroval velké gradienty každý frame → sekání.
    const auroraTarget = { tx: 0, ty: 0, op: 1 };
    const auroraCurr = { tx: 0, ty: 0, op: 1 };
    let auroraRAF = 0;
    const computeAuroraTarget = () => {
      if (!aurora) return;
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, sy / max)); // 0..1 průběh scrollu
      // Houpání L↔R, ale ASYMETRICKY: výrazně DOLEVA (koule se line do plochy),
      // jen jemně doprava (koule je ukotvená vpravo, doprava jen mizí z obrazu).
      const sway = Math.sin(p * Math.PI * 2); // >0 v 1. půlce → doleva, <0 ve 2. → doprava
      auroraTarget.tx = -sway * vw * (sway >= 0 ? 0.42 : 0.08);
      auroraTarget.ty = p * vh * 0.35; // jemný drift dolů s obsahem
      const dim = Math.min(1, Math.max(0, (sy - vh * 0.4) / (vh * 0.7)));
      auroraTarget.op = 1 - dim * 0.62; // 1 → ~0.38 (čitelnost obsahu)
    };
    const auroraTick = () => {
      if (!aurora) return;
      const e = 0.08; // lerp faktor → hedvábné dotahování k cíli
      auroraCurr.tx += (auroraTarget.tx - auroraCurr.tx) * e;
      auroraCurr.ty += (auroraTarget.ty - auroraCurr.ty) * e;
      auroraCurr.op += (auroraTarget.op - auroraCurr.op) * e;
      aurora.style.transform = `translate3d(${auroraCurr.tx.toFixed(2)}px, ${auroraCurr.ty.toFixed(2)}px, 0)`;
      aurora.style.opacity = auroraCurr.op.toFixed(3);
      const settled =
        Math.abs(auroraTarget.tx - auroraCurr.tx) < 0.1 &&
        Math.abs(auroraTarget.ty - auroraCurr.ty) < 0.1 &&
        Math.abs(auroraTarget.op - auroraCurr.op) < 0.002;
      auroraRAF = settled ? 0 : window.requestAnimationFrame(auroraTick);
    };
    // BARVA koule (--blob-hue) je ODDĚLENÁ od lerp smyčky: aktualizuje se POUZE při
    // reálném scrollu a kvantovaně na celé stupně. Když se nescrolluje, filtr na
    // .blob-a se nemění → blob zůstává kompozitovaný (žádné přerastrování) → plynulý
    // float. Hue-rotate jede jen na .blob-a (bez blur) → levné i během scrollu.
    let lastHueDeg = -999;
    const updateBlobHue = () => {
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const deg = Math.round(scrollHue(p));
      if (deg !== lastHueDeg) {
        lastHueDeg = deg;
        root.style.setProperty("--blob-hue", `${deg}deg`);
      }
    };
    const kickAurora = () => {
      if (!aurora || reduceMotion) return;
      computeAuroraTarget();
      if (!auroraRAF) auroraRAF = window.requestAnimationFrame(auroraTick);
    };
    if (aurora && !reduceMotion) {
      const onAuroraResize = () => kickAurora();
      window.addEventListener("resize", onAuroraResize, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("resize", onAuroraResize);
        if (auroraRAF) window.cancelAnimationFrame(auroraRAF);
      });
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        applyParallax();
        kickAurora();
        updateBlobHue();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));
    applyParallax();
    kickAurora();
    updateBlobHue();

    /* --------------------- KURZOR: MAGNET + 3D TILT ------------------------ */
    document
      .querySelectorAll<HTMLElement>(".header-cta, .desktop-nav a, .brand-mark, .contact-actions a, .ill-arrow")
      .forEach((el) => {
        el.classList.add("fx-magnetic");
        const strength = el.classList.contains("header-cta") ? 0.4 : 0.3;
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const mx = e.clientX - (r.left + r.width / 2);
          const my = e.clientY - (r.top + r.height / 2);
          el.style.transform = `translate(${(mx * strength).toFixed(1)}px, ${(my * strength).toFixed(1)}px)`;
        };
        const onLeave = () => {
          el.style.transform = "";
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        });
      });

    document.querySelectorAll<HTMLElement>(".project-card").forEach((card) => {
      card.classList.add("fx-tilt");
      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "";
        card.style.transform = `perspective(900px) rotateY(${(px * 6).toFixed(2)}deg) rotateX(${(-py * 6).toFixed(2)}deg)`;
      };
      const onLeave = () => {
        card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
      };
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      root.classList.remove("scroll-fx-ready");
    };
  }, []);

  return null;
}
