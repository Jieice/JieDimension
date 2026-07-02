document.addEventListener('DOMContentLoaded', () => {
    // 节流函数
    function throttle(fn, wait) {
        let last = 0;
        return function(...args) {
            const now = Date.now();
            if (now - last >= wait) {
                last = now;
                fn.apply(this, args);
            }
        };
    }

    // 1. Navbar Scroll Effect
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = throttle(() => {
            header.classList.toggle('is-scrolled', window.scrollY > 50);
        }, 100);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // 2. Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.type = 'button';
    backToTopBtn.setAttribute('aria-label', '回到顶部');
    document.body.appendChild(backToTopBtn);

    const onScrollBackTop = throttle(() => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, 150);
    window.addEventListener('scroll', onScrollBackTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Warm same-origin game detail pages as soon as intent is clear.
    const prefetched = new Set();
    function prefetchGamePage(href) {
        if (!href || prefetched.has(href)) return;
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin || !url.pathname.startsWith('/games/')) return;
        prefetched.add(href);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url.pathname;
        link.as = 'document';
        document.head.appendChild(link);
    }

    document.querySelectorAll('a[href^="/games/"]').forEach((link) => {
        const href = link.getAttribute('href');
        link.addEventListener('pointerenter', () => prefetchGamePage(href), { passive: true });
        link.addEventListener('focus', () => prefetchGamePage(href));
        link.addEventListener('touchstart', () => prefetchGamePage(href), { passive: true });
    });
});
