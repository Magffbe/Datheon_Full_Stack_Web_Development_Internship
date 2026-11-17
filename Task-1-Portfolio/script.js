
/* ========================================
   PORTFOLIO - MAIN JAVASCRIPT
   ======================================== */

const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

let prefersReducedMotion = motionPreference.matches;


// ========================================
// 1. SCROLL REVEAL ANIMATIONS
// ========================================

const animatedElements = document.querySelectorAll(
    "#about, " +
    "#projects, " +
    "#skills, " +
    "#certifications, " +
    "#contact, " +
    "#projects .project-card, " +
    "#skills .skill-card, " +
    "#certifications .certification-card"
);

let revealObserver = null;

function showAllElements() {
    animatedElements.forEach((element) => {
        element.classList.remove("will-animate");
        element.classList.add("is-visible");
        element.style.transitionDelay = "";
    });
}

function initializeRevealAnimations() {
    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        showAllElements();
        return;
    }

    revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px 35px 0px"
        }
    );

    animatedElements.forEach((element, index) => {
        element.classList.add("will-animate");

        element.style.transitionDelay =
            `${(index % 4) * 110}ms`;

        revealObserver.observe(element);
    });
}

initializeRevealAnimations();


// ========================================
// 2. PARTICLE BACKGROUND
// ========================================

let startParticleAnimation = () => {};
let stopParticleAnimation = () => {};
let renderStaticParticles = () => {};

function initializeParticleBackground() {
    const canvas = document.createElement("canvas");

    canvas.id = "particle-background";
    canvas.setAttribute("aria-hidden", "true");

    document.body.prepend(canvas);

    const context = canvas.getContext("2d");

    if (!context) return;

    let canvasWidth = 0;
    let canvasHeight = 0;
    let particles = [];
    let animationFrame = null;
    let lastFrameTime = 0;

    const particleCount = 90;

    const pointer = {
        x: -1000,
        y: -1000
    };

    function createParticles() {
        particles = Array.from(
            { length: particleCount },
            () => ({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                radius: Math.random() * 1.8 + 0.8,
                speedX: (Math.random() - 0.5) * 0.9,
                speedY: (Math.random() - 0.5) * 0.9,
                alpha: Math.random() * 0.4 + 0.4,
                phase: Math.random() * Math.PI * 2
            })
        );
    }

    function renderParticles(time = 0) {
        context.clearRect(
            0,
            0,
            canvasWidth,
            canvasHeight
        );

        const elapsed = lastFrameTime
            ? Math.min((time - lastFrameTime) / 16.67, 2)
            : 1;

        lastFrameTime = time;

        particles.forEach((particle) => {
            if (!prefersReducedMotion) {
                particle.x += particle.speedX * elapsed;
                particle.y += particle.speedY * elapsed;
                particle.phase += 0.035 * elapsed;

                if (particle.x < -6) {
                    particle.x = canvasWidth + 6;
                } else if (particle.x > canvasWidth + 6) {
                    particle.x = -6;
                }

                if (particle.y < -6) {
                    particle.y = canvasHeight + 6;
                } else if (particle.y > canvasHeight + 6) {
                    particle.y = -6;
                }
            }

            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (
                !prefersReducedMotion &&
                distance < 135 &&
                distance > 0
            ) {
                context.beginPath();
                context.moveTo(particle.x, particle.y);
                context.lineTo(pointer.x, pointer.y);

                context.strokeStyle =
                    `rgba(56, 217, 245, ${
                        (1 - distance / 135) * 0.22
                    })`;

                context.lineWidth = 0.8;
                context.stroke();
            }

            const twinkle = prefersReducedMotion
                ? 1
                : 0.55 +
                    (Math.sin(particle.phase) + 1) * 0.3;

            const opacity = particle.alpha * twinkle;

            context.beginPath();

            context.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            context.fillStyle =
                `rgba(56, 217, 245, ${opacity})`;

            context.shadowBlur = 10;
            context.shadowColor = "rgba(56, 217, 245, 0.8)";

            context.fill();

            context.shadowBlur = 0;
        });
    }

    function resizeCanvas() {
        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;

        canvas.width = Math.round(canvasWidth * pixelRatio);
        canvas.height = Math.round(canvasHeight * pixelRatio);

        context.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        createParticles();

        lastFrameTime = 0;
        renderParticles(0);
    }

    function animateParticles(time) {
        animationFrame = null;

        if (document.hidden || prefersReducedMotion) {
            return;
        }

        renderParticles(time);

        animationFrame =
            window.requestAnimationFrame(animateParticles);
    }

    startParticleAnimation = function () {
        if (
            prefersReducedMotion ||
            document.hidden ||
            animationFrame !== null
        ) {
            return;
        }

        lastFrameTime = 0;

        animationFrame =
            window.requestAnimationFrame(animateParticles);
    };

    stopParticleAnimation = function () {
        if (animationFrame !== null) {
            window.cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        lastFrameTime = 0;
    };

    renderStaticParticles = function () {
        renderParticles(0);
    };

    window.addEventListener("resize", () => {
        resizeCanvas();
        startParticleAnimation();
    });

    window.addEventListener(
        "pointermove",
        (event) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
        },
        { passive: true }
    );

    window.addEventListener("pointerleave", () => {
        pointer.x = -1000;
        pointer.y = -1000;
    });

    resizeCanvas();
    startParticleAnimation();
}

initializeParticleBackground();


// ========================================
// 3. ROTATING HERO TITLE
// ========================================

let startTitleRotation = () => {};
let stopTitleRotation = () => {};

function initializeTitleRotation() {
    const title = document.querySelector(".rotating-title");

    if (!title) return;

    const titles = [
        "Web Developer",
        "WordPress & Frontend Specialist",
        "Problem Solver"
    ];

    let currentIndex = 0;
    let titleInterval = null;
    let titleTimeout = null;

    startTitleRotation = function () {
        if (
            prefersReducedMotion ||
            document.hidden ||
            titleInterval !== null
        ) {
            return;
        }

        titleInterval = window.setInterval(() => {
            title.style.opacity = "0";

            titleTimeout = window.setTimeout(() => {
                if (document.hidden || prefersReducedMotion) {
                    title.style.opacity = "1";
                    titleTimeout = null;
                    return;
                }

                currentIndex =
                    (currentIndex + 1) % titles.length;

                title.textContent = titles[currentIndex];
                title.style.opacity = "1";

                titleTimeout = null;
            }, 350);

        }, 2500);
    };

    stopTitleRotation = function () {
        if (titleInterval !== null) {
            window.clearInterval(titleInterval);
            titleInterval = null;
        }

        if (titleTimeout !== null) {
            window.clearTimeout(titleTimeout);
            titleTimeout = null;
        }

        title.style.opacity = "1";
    };

    startTitleRotation();
}

initializeTitleRotation();


// ========================================
// 4. RESPONSIVE HAMBURGER MENU
// ========================================

function initializeNavigationMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (!menuToggle || !navMenu) return;

    const navLinks = navMenu.querySelectorAll("a");

    function closeMenu() {
        navMenu.classList.remove("is-open");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }

    function toggleMenu() {
        const isOpen = navMenu.classList.toggle("is-open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    }

    menuToggle.addEventListener("click", toggleMenu);

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            navMenu.classList.contains("is-open")
        ) {
            closeMenu();
            menuToggle.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            navMenu.classList.contains("is-open") &&
            !navMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    const desktopMedia = window.matchMedia(
        "(min-width: 801px)"
    );

    function handleDesktopChange(event) {
        if (event.matches) {
            closeMenu();
        }
    }

    if (desktopMedia.addEventListener) {
        desktopMedia.addEventListener(
            "change",
            handleDesktopChange
        );
    } else {
        desktopMedia.addListener(handleDesktopChange);
    }
}

initializeNavigationMenu();


// ========================================
// 5. REDUCED MOTION PREFERENCE
// ========================================

function handleMotionPreferenceChange(event) {
    prefersReducedMotion = event.matches;

    if (prefersReducedMotion) {
        stopParticleAnimation();
        stopTitleRotation();

        if (revealObserver) {
            revealObserver.disconnect();
        }

        showAllElements();
        renderStaticParticles();

    } else {
        startParticleAnimation();
        startTitleRotation();
    }
}

if (motionPreference.addEventListener) {
    motionPreference.addEventListener(
        "change",
        handleMotionPreferenceChange
    );
} else {
    motionPreference.addListener(
        handleMotionPreferenceChange
    );
}


// ========================================
// 6. PAGE VISIBILITY MANAGEMENT
// ========================================

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopParticleAnimation();
        stopTitleRotation();
    } else {
        startParticleAnimation();
        startTitleRotation();
    }
});
