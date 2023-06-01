import math from './math.js';

export function repeat(count: number, callbackfn: (iteration: number) => void) {
  for (let iteration = 0; iteration < count; iteration++) {
    callbackfn(iteration);
  }
}

export function shuffleArray<T>(array: T[]) {
  array.forEach((element, index) => {
    const randomIndex = math.randomInt(array.length - 1);

    [array[index], array[randomIndex]] = [array[randomIndex], element];
  });

  return array;
}

export default { repeat, shuffleArray };
