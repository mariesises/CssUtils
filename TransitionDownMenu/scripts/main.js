// main.js
let isAnimating = false; // Flag to prevent overlapping animations

function animatePageOut(callback) {
    if (isAnimating) return;
    isAnimating = true;

    gsap.to("body", {
        opacity: 0,
        duration: 0.5, // Adjust duration as needed
        ease: "power2.out", // Adjust easing
        onComplete: () => {
            callback(); // Call the provided callback after animation completes
        },
    });
}

function animatePageIn() {
    gsap.fromTo(
        "body",
        { opacity: 0 }, // Initial state
        {
            opacity: 1,
            duration: 0.5, // Adjust duration
            ease: "power2.in", // Adjust easing
            onComplete: () => {
                isAnimating = false; // Animation finished
            },
        }
    );

    // Re-initialize scripts (Lenis, SplitType, etc.) after the new content loads
    initializeScripts();
}

function initializeScripts() {
    // Re-initialize Lenis, SplitType, or any other libraries here.
    // Example (Lenis):
    const lenis = new Lenis();
    lenis.on("scroll", (e) => {
        console.log(e);
    });
    // ... other initialization code ...
}


if (navigation.addEventListener) {
    navigation.addEventListener("navigate", (event) => {
        if (!event.destination.url.includes(document.location.origin)) {
            return;
        }

        event.intercept({
            async handler() {
                animatePageOut(() => { // Animate out before fetching
                    fetch(event.destination.url)
                        .then((response) => response.text())
                        .then((html) => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, "text/html");

                            document.title = doc.title;
                            document.body.innerHTML = doc.body.innerHTML; // Update content

                            animatePageIn(); // Animate in the new content
                        });
                });
            },
            scroll: "manual",
        });
    });
}