/**
 * purelane-scenes.js
 * Custom element: <purelane-scenes>
 *
 * Responsibilities:
 * 1. Scene crossfade — reads [data-scene] on visible sections, fades background gradient.
 * 2. Parallax — moves water layers with mouse (desktop) and scroll.
 * 3. Reveal — IntersectionObserver adds .pl-in to .pl-rv elements.
 * 4. Respects prefers-reduced-motion.
 */

if (!customElements.get('purelane-scenes')) {
  class PurelaneScenes extends HTMLElement {
    constructor() {
      super();
      this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.current = 0;
      this.mx = 0;
      this.my = 0;
      this.raf = null;
    }

    connectedCallback() {
      this.scenes = Array.from(this.querySelectorAll('.pl-scene'));
      this.waterLayers = Array.from(this.querySelectorAll('.pl-wl'));
      this.zones = [];

      this.initReveals();
      this.collectZones();
      this.bindScroll();

      if (!this.reduce && window.matchMedia('(min-width: 1024px)').matches) {
        this.bindMouse();
      }

      this.frame();
    }

    collectZones() {
      this.zones = Array.from(document.querySelectorAll('[data-scene]'));
    }

    initReveals() {
      const revs = document.querySelectorAll('.pl-rv');
      if ('IntersectionObserver' in window && !this.reduce) {
        const ro = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('pl-in');
              ro.unobserve(e.target);
            }
          });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
        revs.forEach((el) => ro.observe(el));
      } else {
        revs.forEach((el) => el.classList.add('pl-in'));
      }
    }

    bindScroll() {
      const handler = () => { if (!this.raf) this.raf = requestAnimationFrame(() => this.frame()); };
      window.addEventListener('scroll', handler, { passive: true });
      window.addEventListener('resize', handler, { passive: true });
    }

    bindMouse() {
      window.addEventListener('mousemove', (e) => {
        this.mx = (e.clientX / window.innerWidth - 0.5) * 2;
        this.my = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!this.raf) this.raf = requestAnimationFrame(() => this.frame());
      }, { passive: true });
    }

    frame() {
      this.raf = null;
      const y = window.scrollY || window.pageYOffset;

      // Scene crossfade
      this.pickScene(y);

      // Parallax water layers
      if (!this.reduce && this.waterLayers.length) {
        const depths = [0.05, 0.09, 0.03, 0.02];
        this.waterLayers.forEach((wl, i) => {
          const d = depths[i] || 0.05;
          wl.style.setProperty('--px', (this.mx * d * 130).toFixed(1) + 'px');
          wl.style.setProperty('--py', (-y * d + this.my * d * 90).toFixed(1) + 'px');
        });
      }
    }

    pickScene(scrollY) {
      const focus = scrollY + window.innerHeight * 0.5;
      let n = 1;
      for (let i = 0; i < this.zones.length; i++) {
        const z = this.zones[i];
        let top = 0;
        let el = z;
        while (el) { top += el.offsetTop; el = el.offsetParent; }
        if (top <= focus) n = parseInt(z.getAttribute('data-scene'), 10) || n;
      }
      this.setScene(n);
    }

    setScene(n) {
      if (n === this.current) return;
      this.current = n;
      this.scenes.forEach((s, i) => s.classList.toggle('pl-on', i + 1 === n));
      this.setAttribute('data-d', String(n));
    }
  }

  customElements.define('purelane-scenes', PurelaneScenes);
}
