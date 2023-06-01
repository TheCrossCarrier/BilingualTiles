import math from '../utils/math.js';
import util from '../utils/util.js';
import StaticArray from './StaticArray.js';

export default class SparseStaticArray<T> extends StaticArray<T> {
  constructor(length: number) {
    super(length);
  }

  filledLength() {
    return this.length - this.vacantIndexes().length;
  }

  vacantIndexes() {
    const result: number[] = [];

    util.repeat(this.length, (index) => {
      if (this[index] === undefined) result.push(index);
    });

    return result;
  }

  fillVacant(value: T) {
    const index = this.vacantIndexes()[0];

    this[index] = value;

    return index;
  }

  fillRandomVacant(value: T) {
    const vacantIndexes = this.vacantIndexes();
    const index = math.randomInt(vacantIndexes.length - 1);

    this[vacantIndexes[index]] = value;

    return vacantIndexes[index];
  }
}
