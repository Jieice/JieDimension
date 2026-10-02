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

  /* ---------- Theme toggle (day / night) ---------- */
  // data-theme 已由 <head> 内联脚本按 localStorage / 系统偏好预设，此处只负责切换与持久化
  const THEME_KEY = "jiedim.theme";
  const THEME_COLOR = { day: "#fff8fa", night: "#0d0a1a" };
  const themeToggle = document.getElementById("themeToggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "night" ? "night" : "day";
  }

  let themeAnimTimer;
  function applyTheme(theme, animate) {
    if (theme === "night") {
      document.documentElement.setAttribute("data-theme", "night");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (themeMeta) themeMeta.setAttribute("content", THEME_COLOR[theme]);
    themeToggle.setAttribute("aria-pressed", theme === "night" ? "true" : "false");
    if (animate) {
      document.documentElement.classList.add("theme-anim");
      clearTimeout(themeAnimTimer);
      themeAnimTimer = setTimeout(() => {
        document.documentElement.classList.remove("theme-anim");
      }, 520);
    }
  }

  themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "night" ? "day" : "night";
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    applyTheme(next, true);
  });

  applyTheme(currentTheme(), false);

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

  /* ---------- 夜景装饰：星空 + 萤火虫 ---------- */
  // 元素始终生成，显隐完全由 .night-layer 的 CSS 控制，避免切换主题时重建 DOM
  if (!reduceMotion) {
    const starsBox = document.getElementById("stars");
    const firefliesBox = document.getElementById("fireflies");

    if (starsBox) {
      const starCount = window.innerWidth < 640 ? 26 : 54;
      const starFrag = document.createDocumentFragment();
      for (let i = 0; i < starCount; i++) {
        const s = document.createElement("i");
        s.className = "star";
        const size = 1.2 + Math.random() * 1.8;
        s.style.width = size.toFixed(2) + "px";
        s.style.height = size.toFixed(2) + "px";
        s.style.left = (Math.random() * 100).toFixed(2) + "%";
        s.style.top = (Math.random() * 62).toFixed(2) + "%";
        s.style.animationDuration = (2.4 + Math.random() * 3.2).toFixed(2) + "s";
        s.style.animationDelay = (-Math.random() * 4).toFixed(2) + "s";
        starFrag.appendChild(s);
      }
      starsBox.appendChild(starFrag);
    }

    if (firefliesBox) {
      const flyCount = window.innerWidth < 640 ? 8 : 16;
      const flyFrag = document.createDocumentFragment();
      for (let i = 0; i < flyCount; i++) {
        const f = document.createElement("i");
        f.className = "firefly";
        const size = 2.5 + Math.random() * 3;
        f.style.width = size.toFixed(2) + "px";
        f.style.height = size.toFixed(2) + "px";
        f.style.left = (Math.random() * 100).toFixed(2) + "%";
        f.style.top = (30 + Math.random() * 65).toFixed(2) + "%";
        const dur = 7 + Math.random() * 9;
        f.style.animationDuration = dur.toFixed(2) + "s";
        f.style.animationDelay = (-Math.random() * dur).toFixed(2) + "s";
        if (Math.random() > 0.65) {
          f.style.background = "#ffc9e2";
          f.style.boxShadow = "0 0 10px 3px rgba(255, 142, 196, 0.75)";
        }
        flyFrag.appendChild(f);
      }
      firefliesBox.appendChild(flyFrag);
    }
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

  /* ---------- QQ 群：移动端显示唤起按钮 + 复制群号 ---------- */
  const qqCopyBtn = document.getElementById("qqCopyBtn");
  const qqJoinBtn = document.getElementById("qqJoinBtn");
  const qqNumber = document.getElementById("qqNumber");

  if (qqJoinBtn && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) {
    // 桌面端点击 mqqapi: 协议会弹出系统「找不到应用」，仅在移动端展示
    qqJoinBtn.hidden = false;
  }

  if (qqCopyBtn) {
    const qqText = (qqNumber && qqNumber.textContent.trim()) || qqCopyBtn.dataset.qq || "";
    const copyLabel = qqCopyBtn.querySelector("span");
    const defaultKey = "qq.copy";
    let restoreTimer;

    qqCopyBtn.addEventListener("click", async () => {
      let ok = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(qqText);
          ok = true;
        }
      } catch (e) { ok = false; }

      if (!ok) {
        // 回退：旧浏览器 / 非安全上下文用临时输入框 + execCommand
        try {
          const tmp = document.createElement("textarea");
          tmp.value = qqText;
          tmp.setAttribute("readonly", "");
          tmp.style.cssText = "position:fixed;top:-1000px;opacity:0;";
          document.body.appendChild(tmp);
          tmp.select();
          ok = document.execCommand("copy");
          document.body.removeChild(tmp);
        } catch (e) { ok = false; }
      }

      if (!ok) return;

      const lang = localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh";
      qqCopyBtn.classList.add("copied");
      if (copyLabel) copyLabel.textContent = window.I18N[lang]["qq.copied"];
      clearTimeout(restoreTimer);
      restoreTimer = setTimeout(() => {
        qqCopyBtn.classList.remove("copied");
        if (copyLabel) copyLabel.setAttribute("data-i18n", defaultKey);
        window.applyI18n(lang);
      }, 2000);

      // 同步无障碍状态
      qqCopyBtn.setAttribute("aria-label", window.I18N[lang]["qq.copied"]);
    });

    // 语言切换后恢复按钮文案（applyI18n 只处理 [data-i18n]，此处补一次兜底）
    document.addEventListener("langchange", () => {
      if (!qqCopyBtn.classList.contains("copied") && copyLabel) {
        copyLabel.setAttribute("data-i18n", defaultKey);
      }
    });
  }

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
