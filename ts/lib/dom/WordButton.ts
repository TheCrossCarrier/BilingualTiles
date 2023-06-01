export default class WordButton {
  node: HTMLButtonElement;
  #pressed: boolean = false;

  constructor(public id: number, text: string) {
    this.node = document.createElement('button');
    this.node.classList.add('words__button');
    this.node.setAttribute('type', 'button');
    this.node.textContent = text;

    this.pressed = false;
  }

  get pressed() {
    return this.#pressed;
  }

  set pressed(value: boolean) {
    this.#pressed = value;
    this.node.setAttribute('aria-pressed', value ? 'true' : 'false');
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

    return new Promise<boolean>((resolve) => {
      this.node.addEventListener('transitionend', () => {
        this.node.remove();
        resolve(true);
      });
    });
  }
}
