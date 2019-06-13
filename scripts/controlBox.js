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
  src="https://cdn2.iconfinder.com/data/icons/misc-vol-8/512/arrow_keys_arrows_keyboard_move-128.png"/>
  <img id="hand-touch" class=""
  src="https://static.thenounproject.com/png/72831-200.png"/>
</section>`;

class ControlInfoBox extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('control-info-box',ControlInfoBox);
