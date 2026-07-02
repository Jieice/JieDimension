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
});
