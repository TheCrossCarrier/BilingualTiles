import util from '../../utils/util.js';

export default class Lives {
  node: HTMLUListElement;
  display = 'flex';

  constructor(public value: number) {
    this.node = document.querySelector('.lives') as HTMLUListElement;
  }

  appear() {
    this.node.style.display = this.display;
  }

  lose(value = 1) {
    util.repeat(value, () => {
      this.node.children[--this.value].classList.add('losing');
    });
  }
}
