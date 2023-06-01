export default class Score {
  node: HTMLElement;
  display = 'block';

  constructor(public value: number) {
    this.node = document.querySelector('.score')!;
  }

  appear() {
    this.node.style.display = this.display;
  }

  add(value = 1) {
    this.value += value;
    this.node.textContent = this.value.toLocaleString();
  }
}
