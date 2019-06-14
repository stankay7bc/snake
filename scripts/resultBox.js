(() => {
  // https://developers.google.com/web/fundamentals/web-components/customelements
  // height, width and count are attributes for a component
  const template = document.createElement('template');
  template.innerHTML = `
  <style>
    section {
      position:relative;
      display:flex;
      justify-content:center;
      align-items:center;
    }

    img {
      position:absolute;
      z-index:1;
    }
    section > div {
      position:absolute;
      z-index:2;
    }
  </style>
  <section>
    <div>-</div>
    <img src="img/clipart1873654.png"
         height="100%"
         width="100%"
         />
  </section>`;

  class ResultBox extends HTMLElement {
    
    static get observedAttributes() {
      return ['count'];
    }
    
    attributeChangedCallback(name,oldVal,newVal) {
      this.changeCountMeter(newVal);
    }
    
    changeCountMeter(count) {
      let countContainer = this.shadowRoot.querySelector('div');
      countContainer.textContent = count; 
    }
    
    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});

      let section = template.content.querySelector('section');
      section.style.setProperty('width',`${this.getAttribute('width')}px`);
      section.style.setProperty('height',`${this.getAttribute('height')}px`);

      shadow.appendChild(template.content.cloneNode(true));
    }
  }

  customElements.define('result-box',ResultBox);
  
})();
