class GrainEffect {
    constructor() {
        this.patternSize = 100; // Keep the proven pattern size
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', {
            alpha: true,
            willReadFrequently: true
        });

        // Pre-generate patterns
        this.noisePatterns = new Array(6).fill(null).map(() => this.generateNoise());
        this.currentPatternIndex = 0;
        this.frame = 0;
    }

    generateNoise() {
        const imgData = this.ctx.createImageData(this.patternSize, this.patternSize);
        const pixels32 = new Uint32Array(imgData.data.buffer);

        // Create single-pixel dots
        for (let i = 0; i < pixels32.length; i++) {
            // Reduce the probability of dots for a more subtle effect
            const isWhiteDot = Math.random() > 0.57; // 3% chance of white dot
            if (isWhiteDot) {
                // Create a white dot with low opacity
                const alpha = 125; // Opacity value
                const value = 255; // White color
                pixels32[i] = (alpha << 24) | (value << 16) | (value << 8) | value;
            } else {
                pixels32[i] = 0; // Fully transparent pixel
            }
        }

        return imgData;
    }

    init(imageElement) {
        let container = imageElement.parentElement;
        if (!container.classList.contains('grain-container')) {
            container = document.createElement('div');
            container.className = 'grain-container';
            imageElement.parentNode.insertBefore(container, imageElement);
            container.appendChild(imageElement);
        }

        this.canvas.className = 'grain-canvas';

        // Update canvas size based on image dimensions
        const updateCanvasSize = () => {
            const { width, height } = imageElement.getBoundingClientRect();
            if (this.canvas.width !== width || this.canvas.height !== height) {
                this.canvas.width = width;
                this.canvas.height = height;
            }
        };

        const style = document.createElement('style');
        style.textContent = `
            .grain-container {
                position: relative;
                width: 100%;
                border-radius: var(--border-radius);
                overflow: hidden;
            }

            .grain-canvas {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                pointer-events: none;
                z-index: 2;
                mix-blend-mode: overlay;
                opacity: 0.2;
                border-radius: inherit;
                will-change: transform;
                contain: strict;
                image-rendering: pixelated;
            }
        `;
        document.head.appendChild(style);

        const debouncedResize = debounce(updateCanvasSize, 100);
        window.addEventListener('resize', debouncedResize, { passive: true });
        imageElement.addEventListener('load', updateCanvasSize, { once: true });
        updateCanvasSize();

        container.appendChild(this.canvas);

        let lastTime = 0;
        const FRAME_INTERVAL = 1000 / 60;

        const animate = (currentTime) => {
            if (currentTime - lastTime < FRAME_INTERVAL) {
                requestAnimationFrame(animate);
                return;
            }

            this.frame++;
            if (this.frame % 4 === 0) { // Update pattern every 4 frames
                this.currentPatternIndex = (this.currentPatternIndex + 1) % this.noisePatterns.length;
                const noise = this.noisePatterns[this.currentPatternIndex];

                // Fill canvas with noise pattern
                for (let y = 0; y < this.canvas.height; y += this.patternSize) {
                    for (let x = 0; x < this.canvas.width; x += this.patternSize) {
                        this.ctx.putImageData(noise, x, y);
                    }
                }
            }

            lastTime = currentTime;
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize with IntersectionObserver for optimization
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.full-width-rounded-image');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const effect = new GrainEffect();
                effect.init(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    images.forEach(image => observer.observe(image));
}, { passive: true });