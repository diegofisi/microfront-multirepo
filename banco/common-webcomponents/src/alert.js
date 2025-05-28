import { LitElement, html } from "Lit";

export class SharedAlert extends LitElement {
  render() {
    return html`<div><slot></slot></div>`;
  }
}

customElements.define("shared-alert", SharedAlert);


