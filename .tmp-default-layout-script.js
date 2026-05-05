
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const bgVideoSource = document.getElementById('bg-video-source');
        const bgVideo = document.getElementById('bg-video');
        const bgmToggle = document.getElementById('bgm-toggle');
        const bgmAudio = document.getElementById('bgm-audio');
        const bgmStorageKey = 'jiedimension.bgm';

        const themes = [
            { id: 'dark', text: '\u{1F319}', src: "{{ '/assets/images/bgs/bg_dark.mp4' | relative_url }}", class: '' },
            { id: 'light', text: '\u2600\uFE0F', src: "{{ '/assets/images/bgs/bg_light.mp4' | relative_url }}", class: 'theme-light' },
            { id: 'pixel', text: '\u{1F47E}', src: "{{ '/assets/images/bgs/bg_pixel.mp4' | relative_url }}", class: '' }
        ];

        function readBgmState() {
            try {
                const raw = sessionStorage.getItem(bgmStorageKey);

                if (!raw) {
                    return null;
                }

                const parsed = JSON.parse(raw);

                return {
                    shouldPlay: parsed.shouldPlay === true,
                    currentTime: Number.isFinite(parsed.currentTime) ? parsed.currentTime : 0
                };
            } catch (error) {
                return null;
            }
        }

        const savedBgmState = readBgmState();
        let currentThemeIndex = new Date().getHours() >= 6 && new Date().getHours() < 18 ? 1 : 0;
        let bgmStartedOnce = false;
        let hasBgmPreference = Boolean(savedBgmState);
        let wantsBgmPlayback = savedBgmState?.shouldPlay === true;
        let bgmResumeTime = savedBgmState?.currentTime || 0;

        function setVideoOpacity() {
            bgVideo.style.opacity = getComputedStyle(document.body).getPropertyValue('--video-opacity').trim() || '0.85';
        }

        function playVideo() {
            bgVideo.muted = true;
            const playPromise = bgVideo.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => { });
            }
        }

        function applyTheme(index, isInit = false) {
            const theme = themes[index];
            body.classList.toggle('theme-light', theme.class === 'theme-light');
            themeToggle.innerText = theme.text;

            const revealVideo = () => {
                setVideoOpacity();
                playVideo();
            };

            if (!isInit) {
                bgVideo.style.opacity = 0;
                setTimeout(() => {
                    bgVideoSource.setAttribute('src', theme.src);
                    bgVideo.load();
                    bgVideo.addEventListener('loadeddata', revealVideo, { once: true });
                }, 350);
                return;
            }

            bgVideoSource.setAttribute('src', theme.src);
            bgVideo.load();
            bgVideo.addEventListener('loadeddata', revealVideo, { once: true });
        }

        function syncBgmUi(isPlaying) {
            bgmToggle.style.opacity = isPlaying ? '1' : '0.55';
            bgmToggle.setAttribute('aria-pressed', String(isPlaying));
            bgmToggle.title = isPlaying ? '暂停背景音乐' : '播放背景音乐';
            bgmToggle.style.animation = isPlaying ? 'float 2s infinite ease-in-out alternate' : 'none';
        }

        function ensureBgmSource() {
            if (!bgmAudio.getAttribute('src')) {
                bgmAudio.setAttribute('src', bgmAudio.dataset.src);
                bgmAudio.load();
            }
        }

        function persistBgmState() {
            if (!hasBgmPreference) {
                return;
            }

            bgmResumeTime = Number.isFinite(bgmAudio.currentTime) && bgmAudio.currentTime > 0
                ? bgmAudio.currentTime
                : bgmResumeTime;

            try {
                sessionStorage.setItem(bgmStorageKey, JSON.stringify({
                    shouldPlay: wantsBgmPlayback,
                    currentTime: bgmResumeTime
                }));
            } catch (error) { }
        }

        async function waitForBgmMetadata() {
            if (bgmAudio.readyState >= 1) {
                return;
            }

            await new Promise((resolve) => {
                bgmAudio.addEventListener('loadedmetadata', resolve, { once: true });
            });
        }

        async function startBgm(resumeTime = bgmResumeTime) {
            ensureBgmSource();

            try {
                if (bgmAudio.currentTime === 0 && Number.isFinite(resumeTime) && resumeTime > 0) {
                    await waitForBgmMetadata();

                    const safeResumeTime = Number.isFinite(bgmAudio.duration) && bgmAudio.duration > 0
                        ? Math.min(resumeTime, Math.max(0, bgmAudio.duration - 0.25))
                        : resumeTime;

                    bgmAudio.currentTime = safeResumeTime;
                }

                await bgmAudio.play();
                bgmStartedOnce = true;
            } catch (error) {
                syncBgmUi(false);
                throw error;
            }
        }

        async function restoreBgmIfNeeded() {
            if (!hasBgmPreference || !wantsBgmPlayback) {
                return;
            }

            try {
                await startBgm(bgmResumeTime);
            } catch (error) { }
        }

        themeToggle.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            applyTheme(currentThemeIndex);
        });

        bgmToggle.addEventListener('click', async (event) => {
            event.stopPropagation();

            if (bgmAudio.paused) {
                hasBgmPreference = true;
                wantsBgmPlayback = true;
                persistBgmState();

                try {
                    await startBgm(bgmResumeTime);
                } catch (error) { }
                return;
            }

            hasBgmPreference = true;
            wantsBgmPlayback = false;
            persistBgmState();
            bgmAudio.pause();
        });

        document.addEventListener('pointerdown', async (event) => {
            if (bgmStartedOnce || (hasBgmPreference && !wantsBgmPlayback)) {
                return;
            }

            if (event.target instanceof Element && event.target.closest('.theme-controls')) {
                return;
            }

            hasBgmPreference = true;
            wantsBgmPlayback = true;
            persistBgmState();

            try {
                await startBgm(bgmResumeTime);
            } catch (error) { }
        });

        bgmAudio.addEventListener('play', () => {
            syncBgmUi(true);
            persistBgmState();
        });
        bgmAudio.addEventListener('pause', () => {
            bgmResumeTime = Number.isFinite(bgmAudio.currentTime) && bgmAudio.currentTime > 0
                ? bgmAudio.currentTime
                : bgmResumeTime;
            syncBgmUi(false);
        });
        window.addEventListener('pagehide', () => persistBgmState());

        applyTheme(currentThemeIndex, true);
        syncBgmUi(false);
        restoreBgmIfNeeded();
    
