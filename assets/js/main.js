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
    const onScroll = throttle(() => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.background = 'rgba(10, 11, 16, 0.85)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.padding = '0';
            header.style.background = 'rgba(10, 11, 16, 0.7)';
            header.style.boxShadow = 'none';
        }
    }, 100);
    window.addEventListener('scroll', onScroll, { passive: true });

    // 2. Typewriter / Hacker text effect for the main title
    const siteTitle = document.querySelector('.site-title span:first-child');
    if (siteTitle) {
        const originalText = siteTitle.innerText;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
        let iterations = 0;
        
        const interval = setInterval(() => {
            siteTitle.innerText = originalText.split('')
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return characters[Math.floor(Math.random() * characters.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
            }
            
            iterations += 1 / 3;
        }, 30);
    }

    // 3. Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    document.body.appendChild(backToTopBtn);

    const onScrollBackTop = throttle(() => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, 150);
    window.addEventListener('scroll', onScrollBackTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 4. 背景视频性能优化：暂停不可见时的视频
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
        // 使用 IntersectionObserver 监控视频可见性
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bgVideo.play().catch(() => {});
                    } else {
                        bgVideo.pause();
                    }
                });
            }, { threshold: 0 });
            videoObserver.observe(bgVideo);
        }

        // 降低视频分辨率以提升性能
        bgVideo.style.imageRendering = 'auto';
    }
});
