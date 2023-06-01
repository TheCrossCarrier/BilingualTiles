var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _WordButton_pressed;
export default class WordButton {
    constructor(id, ...content) {
        this.id = id;
        _WordButton_pressed.set(this, false);
        this.node = document.createElement('button');
        this.node.classList.add('words__button');
        this.node.setAttribute('type', 'button');
        this.pressed = false;
        content.forEach((element) => this.appendContent(element));
    }
    get pressed() {
        return __classPrivateFieldGet(this, _WordButton_pressed, "f");
    }
    set pressed(value) {
        __classPrivateFieldSet(this, _WordButton_pressed, value, "f");
        this.node.setAttribute('aria-pressed', value ? 'true' : 'false');
    }
    appendContent(element) {
        if (typeof element === 'string') {
            const span = document.createElement('span');
            span.textContent = element;
            this.node.appendChild(span);
        }
        else {
            this.node.appendChild(element);
        }
    }
    remove(type) {
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
_WordButton_pressed = new WeakMap();
//# sourceMappingURL=WordButton.js.map