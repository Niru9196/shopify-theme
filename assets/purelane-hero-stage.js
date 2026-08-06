/**
 * purelane-hero-stage.js
 * Custom element: <purelane-hero-stage>
 *
 * Auto-advances through 1→2→3 product slides with dot navigation.
 * Pauses on hover and when out of viewport.
 * Respects prefers-reduced-motion.
 */

if (!customElements.get('purelane-hero-stage')) {
  class PurelaneHeroStage extends HTMLElement {
    constructor() {
      super();
      this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.index = 0;
      this.timer = null;
      this.interval = parseInt(this.getAttribute('data-interval') || '3800', 10);
    }

    connectedCallback() {
      this.slides = Array.from(this.querySelectorAll('.pl-hslide'));
      this.dots = Array.from(this.querySelectorAll('.pl-hdots button'));

      if (this.slides.length < 2) return;

      this.dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          this.stop();
          this.go(i);
          this.play();
        });
      });

      this.addEventListener('mouseenter', () => this.stop());
      this.addEventListener('mouseleave', () => this.play());

      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) this.play();
            else this.stop();
          });
        }, { threshold: 0.2 }).observe(this);
      } else {
        this.play();
      }
    }

    go(n) {
      this.index = ((n % this.slides.length) + this.slides.length) % this.slides.length;
      this.slides.forEach((s, i) => s.classList.toggle('pl-on', i === this.index));
      this.dots.forEach((d, i) => d.classList.toggle('pl-on', i === this.index));
    }

    play() {
      if (this.timer || this.reduce) return;
      this.timer = setInterval(() => this.go(this.index + 1), this.interval);
    }

    stop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    disconnectedCallback() {
      this.stop();
    }
  }

  customElements.define('purelane-hero-stage', PurelaneHeroStage);
}
