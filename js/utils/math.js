export function randomInt(max, min = 0) {
    if (max < min)
        throw Error('First argument is `max`, which must be greater than second - `min`');
    const result = min + Math.random() * (max + 1 - min);
    return Math.floor(result);
}
export default { randomInt };
