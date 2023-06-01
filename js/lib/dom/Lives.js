import util from '../../utils/util.js';
export default class Lives {
    constructor(value) {
        this.value = value;
        this.display = 'flex';
        this.node = document.querySelector('.lives');
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
