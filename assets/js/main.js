document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect (Glassmorphism transition)
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.background = 'rgba(10, 11, 16, 0.85)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.padding = '0';
            header.style.background = 'rgba(10, 11, 16, 0.7)';
            header.style.boxShadow = 'none';
        }
    });

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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
