export default class Score {
    constructor(value) {
        this.value = value;
        this.display = 'block';
        this.node = document.querySelector('.score');
    }
    appear() {
        this.node.style.display = this.display;
    }
    add(value = 1) {
        this.value += value;
        this.node.textContent = this.value.toLocaleString();
    }
}
