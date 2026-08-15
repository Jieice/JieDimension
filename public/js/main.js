/* ============================================================
   main.js — Navigation, language toggle, scroll reveals
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Language toggle ---------- */
  const STORAGE_KEY = "jiedim.lang";
  const langToggle = document.getElementById("langToggle");
  const langLabel = document.getElementById("langLabel");

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "zh";
  }
  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.body.classList.add("lang-switching");
    setTimeout(() => {
      window.applyI18n(lang);
      langLabel.textContent = lang === "zh" ? "EN" : "中";
      document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
      document.body.classList.remove("lang-switching");
    }, 180);
  }

  langToggle.addEventListener("click", () => {
    const next = getLang() === "zh" ? "en" : "zh";
    setLang(next);
  });

  // Initial language
  setLang(getLang());

  /* ---------- 樱花飘落 ---------- */
  const petalsBox = document.getElementById("petals");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (petalsBox && !reduceMotion) {
    const count = window.innerWidth < 640 ? 10 : 16;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      p.className = "petal";
      const size = 8 + Math.random() * 8;
      const duration = 9 + Math.random() * 9;
      p.style.width = size.toFixed(1) + "px";
      p.style.height = (size * 0.82).toFixed(1) + "px";
      p.style.left = (Math.random() * 100).toFixed(2) + "vw";
      p.style.opacity = (0.45 + Math.random() * 0.45).toFixed(2);
      p.style.animationDuration = duration.toFixed(2) + "s";
      p.style.animationDelay = (-Math.random() * duration).toFixed(2) + "s";
      frag.appendChild(p);
    }
    petalsBox.appendChild(frag);
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    backToTop.classList.toggle("visible", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("mobile-open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---------- Skill bars animation ---------- */
  const skillBars = document.querySelectorAll(".skill-bar");
  const skillIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          skillIo.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillBars.forEach((el) => skillIo.observe(el));

  /* ---------- Smooth-scroll anchor fix for sticky header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    });
  });

  /* ---------- Lazy-load featured videos ---------- */
  // Videos are autoplay muted loop — pause when offscreen for perf
  const videos = document.querySelectorAll(".featured-media video");
  const videoIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const v = entry.target;
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    },
    { threshold: 0.25 }
  );
  videos.forEach((v) => videoIo.observe(v));

  /* ---------- ESC closes modal ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("blogModal");
      if (modal.classList.contains("open")) {
        closeModal();
      }
    }
  });

  function closeModal() {
    const modal = document.getElementById("blogModal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Expose for blog.js
  window.closeBlogModal = closeModal;
})();
