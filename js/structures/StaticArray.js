const lengthErrorText = 'Cannot modify the length of a static array';
export default class StaticArray extends Array {
    constructor(length) {
        super(length);
    }
    get length() {
        return this.length;
    }
    push() {
        throw Error(lengthErrorText);
    }
    pop() {
        throw Error(lengthErrorText);
    }
    shift() {
        throw Error(lengthErrorText);
    }
    unshift() {
        throw Error(lengthErrorText);
    }
    splice() {
        throw Error(lengthErrorText);
    }
}
