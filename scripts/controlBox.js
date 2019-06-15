// https://alligator.io/web-components/your-first-custom-element/
const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    position:inherit;
  }
  section {
    display:flex;
  }
  section > img {
    margin:.25em;
  }
  .outlined {
    outline:1px solid blue;
  }
  #arrow-keys {
    width:3em;
    height:3em;
  }
  #hand-touch {
    width:3em;
    height:3em;
  }
</style>
<section>
  <img id="arrow-keys" class=""
    src="img/arrow_keys.png"/>
  <img id="hand-touch" class=""
    src="img/hand_touch.png"/>
</section>`;

class ControlInfoBox extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('control-info-box',ControlInfoBox);
