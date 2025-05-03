// const MyComponent = Object.create(HTMLElement);

// MyComponent.connectedCallback = function () {
//   this.innerHTML = `<h1>my component<h1/>`;
//   console.log(this);
// };
// console.log(MyComponent.connectedCallback());

class TSelect extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>my component<h1/>`;
  }
}
customElements.define("t-select", TSelect);
