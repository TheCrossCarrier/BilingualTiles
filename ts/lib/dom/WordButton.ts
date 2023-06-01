export default class WordButton {
  node: HTMLButtonElement;
  #pressed: boolean = false;

  constructor(public id: number, ...content: (string | Node)[]) {
    this.node = document.createElement('button');
    this.node.classList.add('words__button');
    this.node.setAttribute('type', 'button');

    this.pressed = false;

    content.forEach((element) => this.appendContent(element));
  }

  get pressed() {
    return this.#pressed;
  }

  set pressed(value: boolean) {
    this.#pressed = value;
    this.node.setAttribute('aria-pressed', value ? 'true' : 'false');
  }

  appendContent(element: string | Node) {
    if (typeof element === 'string') {
      const span = document.createElement('span');
      span.textContent = element;
      this.node.appendChild(span);
    } else {
      this.node.appendChild(element);
    }
  }

  // appear() {
  //   this.node.classList.add('appearing');
  //   this.node.classList.add('appeared');

  //   this.node.addEventListener('transitionend', () => {
  //     this.node.classList.remove('appearing');
  //   });
  // }

  remove(type: 'success' | 'mistake') {
    this.node.classList.add('removing');
    this.node.classList.add('removing_' + type);

    return new Promise((resolve) => {
      this.node.addEventListener('transitionend', () => {
        this.node.remove();
        resolve(null);
      });
    });
  }
}
