/**
 * purelane-rotator.js
 * Custom element: <purelane-rotator>
 *
 * Auto-cycles product images inside .pl-rot__frame with dot indicators.
 * Respects prefers-reduced-motion and IntersectionObserver visibility.
 */

if (!customElements.get('purelane-rotator')) {
  class PurelaneRotator extends HTMLElement {
    constructor() {
      super();
      this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.index = 0;
      this.timer = null;
      this.interval = parseInt(this.getAttribute('data-interval') || '2900', 10);
    }

    connectedCallback() {
      this.items = Array.from(this.querySelectorAll('.pl-rot__item'));
      this.dots = Array.from(this.querySelectorAll('.pl-rot__dot'));
      this.capName = this.querySelector('.pl-rot__cap-name');
      this.capNote = this.querySelector('.pl-rot__cap-note');

      if (this.items.length < 2 || this.reduce) return;

      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) this.play();
            else this.stop();
          });
        }, { threshold: 0.25 }).observe(this);
      } else {
        this.play();
      }
    }

    step() {
      this.items[this.index].classList.remove('pl-on');
      if (this.dots[this.index]) this.dots[this.index].classList.remove('pl-on');

      this.index = (this.index + 1) % this.items.length;

      this.items[this.index].classList.add('pl-on');
      if (this.dots[this.index]) this.dots[this.index].classList.add('pl-on');

      if (this.capName) this.capName.textContent = this.items[this.index].getAttribute('data-name') || '';
      if (this.capNote) this.capNote.textContent = this.items[this.index].getAttribute('data-note') || '';
    }

    play() {
      if (this.timer) return;
      this.timer = setInterval(() => this.step(), this.interval);
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

  customElements.define('purelane-rotator', PurelaneRotator);
}
