/* ============================================================
   blog.js — Markdown blog loader (fetches manifest + posts)
   ============================================================ */
(function () {
  "use strict";

  const grid = document.getElementById("blogGrid");
  if (!grid) return;

  // Configure marked
  if (window.marked) {
    marked.setOptions({
      gfm: true,
      breaks: false,
      headerIds: false,
      mangle: false,
    });
  }

  // Simple frontmatter parser (YAML subset)
  function parseFrontmatter(text) {
    const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) return { meta: {}, body: text };
    const yaml = m[1];
    const body = m[2];
    const meta = {};
    yaml.split("\n").forEach((line) => {
      const kv = line.match(/^([\w-]+):\s*(.*)$/);
      if (!kv) return;
      const key = kv[1];
      let val = kv[2].trim();
      // strip quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      // arrays
      if (val.startsWith("[") && val.endsWith("]")) {
        val = val.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      }
      meta[key] = val;
    });
    return { meta, body };
  }

  function formatDate(iso, lang) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const locale = lang === "en" ? "en-US" : "zh-CN";
    return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  let postsCache = [];
  let currentLang = (localStorage.getItem("jiedim.lang") || "zh");

  function renderCards(posts) {
    if (!posts.length) {
      const empty = document.createElement("div");
      empty.className = "blog-empty";
      empty.style.gridColumn = "1 / -1";
      empty.style.textAlign = "center";
      empty.style.padding = "48px 0";
      empty.textContent = currentLang === "en" ? "No posts yet" : "暂无文章";
      grid.innerHTML = "";
      grid.appendChild(empty);
      return;
    }

    grid.innerHTML = "";
    posts.forEach((post, idx) => {
      const card = document.createElement("article");
      card.className = "blog-card reveal";
      card.dataset.delay = String((idx % 3) + 1);
      card.dataset.slug = post.slug;

      const title = currentLang === "en" && post.title_en ? post.title_en : post.title;
      const excerpt = currentLang === "en" && post.description_en ? post.description_en : post.description;
      const date = formatDate(post.published, currentLang);
      const category = post.category || "Blog";
      const image = post.image || "/og/default.jpg";
      const readMore = currentLang === "en" ? "Read More" : "阅读全文";
      const pin = post.pinned ? `<span class="blog-pin">📌</span>` : "";

      card.innerHTML = `
        <div class="blog-thumb">
          ${pin}
          <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy" />
        </div>
        <div class="blog-body">
          <div class="blog-meta">
            <span class="cat">${escapeHtml(category)}</span>
            <span>·</span>
            <span>${date}</span>
          </div>
          <h3 class="blog-title">${escapeHtml(title)}</h3>
          <p class="blog-excerpt">${escapeHtml(excerpt)}</p>
          <span class="blog-more">${readMore} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
        </div>
      `;

      card.addEventListener("click", () => openPost(post));
      grid.appendChild(card);

      // Observe for reveal
      if (window.IntersectionObserver) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("visible");
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.1 }
        );
        io.observe(card);
      } else {
        card.classList.add("visible");
      }
    });
  }

  async function openPost(post) {
    const modal = document.getElementById("blogModal");
    const modalHero = document.getElementById("blogModalHero");
    const modalMeta = document.getElementById("blogModalMeta");
    const modalTitle = document.getElementById("blogModalTitle");
    const modalContent = document.getElementById("blogModalContent");

    const title = currentLang === "en" && post.title_en ? post.title_en : post.title;
    const date = formatDate(post.published, currentLang);
    const category = post.category || "Blog";

    modalTitle.textContent = title;
    modalMeta.innerHTML = `<span class="cat">${escapeHtml(category)}</span><span>·</span><span>${date}</span>`;
    modalHero.innerHTML = post.image
      ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(title)}" />`
      : "";
    modalContent.innerHTML = `<p style="color: var(--ink-3);">${currentLang === "en" ? "Loading…" : "加载中…"}</p>`;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const scroller = modal.querySelector(".blog-modal-content");
    if (scroller) scroller.scrollTo({ top: 0 });

    try {
      const res = await fetch(`/content/posts/${post.slug}.md`);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const text = await res.text();
      const { body } = parseFrontmatter(text);
      const html = window.marked ? marked.parse(body) : `<pre>${escapeHtml(body)}</pre>`;
      modalContent.innerHTML = html;

      // Highlight code blocks
      if (window.hljs) {
        modalContent.querySelectorAll("pre code").forEach((block) => {
          try { hljs.highlightElement(block); } catch (e) {}
        });
      }
    } catch (err) {
      modalContent.innerHTML = `<p style="color: var(--pink-deep);">${currentLang === "en" ? "Failed to load post." : "文章加载失败。"}</p>`;
    }
  }

  // Modal close handlers
  document.getElementById("blogModalClose").addEventListener("click", () => {
    if (window.closeBlogModal) window.closeBlogModal();
  });
  document.getElementById("blogModalBackdrop").addEventListener("click", () => {
    if (window.closeBlogModal) window.closeBlogModal();
  });

  // Load manifest and render
  async function load() {
    try {
      const res = await fetch("/content/posts.json");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const posts = await res.json();
      postsCache = posts;
      renderCards(posts);
    } catch (err) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--ink-3); padding: 48px 0;">${currentLang === "en" ? "Failed to load posts." : "博客加载失败。"}</div>`;
    }
  }

  // Re-render on language change
  document.addEventListener("langchange", (e) => {
    currentLang = e.detail.lang;
    if (postsCache.length) renderCards(postsCache);
  });

  load();
})();
