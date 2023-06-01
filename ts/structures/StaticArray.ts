const lengthErrorText = 'Cannot modify the length of a static array';

export default class StaticArray<T> extends Array<T> {
  constructor(length: number) {
    super(length);
  }

  get length(): number {
    return this.length;
  }

  push(): never {
    throw Error(lengthErrorText);
  }

  pop(): never {
    throw Error(lengthErrorText);
  }

  shift(): never {
    throw Error(lengthErrorText);
  }

  unshift(): never {
    throw Error(lengthErrorText);
  }

  splice(): never {
    throw Error(lengthErrorText);
  }
}
