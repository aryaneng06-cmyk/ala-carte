
class GlassSurface {
  constructor(element, options = {}) {
    this.el = element;
    
    this.options = {
      borderRadius: options.borderRadius !== undefined ? options.borderRadius : 20,
      borderWidth: options.borderWidth !== undefined ? options.borderWidth : 0.07,
      brightness: options.brightness !== undefined ? options.brightness : 50,
      opacity: options.opacity !== undefined ? options.opacity : 0.93,
      blur: options.blur !== undefined ? options.blur : 11,
      displace: options.displace !== undefined ? options.displace : 0,
      backgroundOpacity: options.backgroundOpacity !== undefined ? options.backgroundOpacity : 0,
      saturation: options.saturation !== undefined ? options.saturation : 1,
      distortionScale: options.distortionScale !== undefined ? options.distortionScale : -180,
      redOffset: options.redOffset !== undefined ? options.redOffset : 0,
      greenOffset: options.greenOffset !== undefined ? options.greenOffset : 10,
      blueOffset: options.blueOffset !== undefined ? options.blueOffset : 20,
      xChannel: options.xChannel || 'R',
      yChannel: options.yChannel || 'G',
      mixBlendMode: options.mixBlendMode || 'difference'
    };

    this.uniqueId = Math.random().toString(36).substr(2, 9);
    this.filterId = `glass-filter-${this.uniqueId}`;
    this.redGradId = `red-grad-${this.uniqueId}`;
    this.blueGradId = `blue-grad-${this.uniqueId}`;

    this.svgSupported = this.checkSvgSupport();
    this.init();
  }

  checkSvgSupport() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    if (isWebkit || isFirefox) return false;
    
    // Test if custom SVG backdrop filter works
    const div = document.createElement('div');
    div.style.backdropFilter = `url(#test)`;
    return div.style.backdropFilter !== '';
  }

  init() {
    this.el.classList.add('glass-surface');
    this.el.classList.add(this.svgSupported ? 'glass-surface--svg' : 'glass-surface--fallback');
    
    if (this.svgSupported) {
        this.el.style.setProperty('--glass-frost', this.options.backgroundOpacity);
        this.el.style.setProperty('--glass-saturation', this.options.saturation);
        this.el.style.setProperty('--filter-id', `url(#${this.filterId})`);

        this.svgWrapper = document.createElement('div');
        this.svgWrapper.style.display = 'none';
        
        this.svgWrapper.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
            <filter id="${this.filterId}" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
                <feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

                <feDisplacementMap in="SourceGraphic" in2="map" id="redchannel-${this.uniqueId}" result="dispRed" 
                    scale="${this.options.distortionScale + this.options.redOffset}" 
                    xChannelSelector="${this.options.xChannel}" 
                    yChannelSelector="${this.options.yChannel}" />
                <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />

                <feDisplacementMap in="SourceGraphic" in2="map" id="greenchannel-${this.uniqueId}" result="dispGreen" 
                    scale="${this.options.distortionScale + this.options.greenOffset}"
                    xChannelSelector="${this.options.xChannel}" 
                    yChannelSelector="${this.options.yChannel}" />
                <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />

                <feDisplacementMap in="SourceGraphic" in2="map" id="bluechannel-${this.uniqueId}" result="dispBlue" 
                    scale="${this.options.distortionScale + this.options.blueOffset}"
                    xChannelSelector="${this.options.xChannel}" 
                    yChannelSelector="${this.options.yChannel}" />
                <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />

                <feBlend in="red" in2="green" mode="screen" result="rg" />
                <feBlend in="rg" in2="blue" mode="screen" result="output" />
                <feGaussianBlur in="output" stdDeviation="${this.options.displace}" />
            </filter>
            </defs>
        </svg>
        `;
        document.body.appendChild(this.svgWrapper);
        this.feImage = this.svgWrapper.querySelector('feImage');

        this.resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => this.updateDisplacementMap());
        });
        this.resizeObserver.observe(this.el);
        setTimeout(() => this.updateDisplacementMap(), 0);
    }
  }

  generateDisplacementMap() {
    const rect = this.el.getBoundingClientRect();
    const actualWidth = rect.width || 400;
    const actualHeight = rect.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (this.options.borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${this.redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${this.blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${this.options.borderRadius}" fill="url(#${this.redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${this.options.borderRadius}" fill="url(#${this.blueGradId})" style="mix-blend-mode: ${this.options.mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${this.options.borderRadius}" fill="hsl(0 0% ${this.options.brightness}% / ${this.options.opacity})" style="filter:blur(${this.options.blur}px)" />
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  }

  updateDisplacementMap() {
    if (this.feImage) {
        this.feImage.setAttribute('href', this.generateDisplacementMap());
    }
  }
}

// Auto mount requested
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('#header');
    if(header) new GlassSurface(header, { borderRadius: 0, borderWidth: 0.1, distortionScale: -80 });
    
    const dishCards = document.querySelectorAll('.dish-card');
    dishCards.forEach(card => new GlassSurface(card, { borderRadius: 20, borderWidth: 0.05, distortionScale: -120 }));
    
    const form = document.querySelector('.rsvp-form');
    if(form) new GlassSurface(form, { borderRadius: 30, borderWidth: 0.1, blur: 15, distortionScale: -150 });
    
    // Cookie banner is dynamic, but if it exists
    const banner = document.querySelector('.cookie-banner');
    if(banner) new GlassSurface(banner, { borderRadius: 24, distortionScale: -100 });
});

// Since modal panels might mount dynamically or be static, we expose global helper
window.GlassSurface = GlassSurface;
