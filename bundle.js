var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("lib/google-sheets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = void 0;
    const API_KEY = 'AIzaSyDe3IdIU1SyDXLBCtocMHJVo2ytdRd04Rc';
    const SPREADSHEET_ID = '1YnfrcmOgEfbcRZe5OZUENYq5kMWxjT13xSosvq-Zbe8';
    const range = 'Words!A3:C1000';
    const url = new URL('https://sheets.googleapis.com');
    url.pathname = `/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`;
    url.searchParams.set('key', API_KEY);
    function getData() {
        return fetch(url.href)
            .then((response) => response.json())
            .then((data) => data.values);
    }
    exports.getData = getData;
    exports.default = { getData };
});
define("lib/dom/dom", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ruWordsUL = exports.enWordsUL = void 0;
    exports.enWordsUL = document.querySelector('.words_en'), exports.ruWordsUL = document.querySelector('.words_ru');
});
define("utils/math", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.randomInt = void 0;
    function randomInt(max, min = 0) {
        if (max < min)
            throw Error('First argument is `max`, which must be greater than second - `min`');
        const result = min + Math.random() * (max + 1 - min);
        return Math.floor(result);
    }
    exports.randomInt = randomInt;
    exports.default = { randomInt };
});
define("utils/util", ["require", "exports", "utils/math"], function (require, exports, math_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shuffleArray = exports.repeat = void 0;
    math_js_1 = __importDefault(math_js_1);
    function repeat(count, callbackfn) {
        for (let iteration = 0; iteration < count; iteration++) {
            callbackfn(iteration);
        }
    }
    exports.repeat = repeat;
    function shuffleArray(array) {
        array.forEach((element, index) => {
            const randomIndex = math_js_1.default.randomInt(array.length - 1);
            [array[index], array[randomIndex]] = [array[randomIndex], element];
        });
        return array;
    }
    exports.shuffleArray = shuffleArray;
    exports.default = { repeat, shuffleArray };
});
define("lib/dom/Lives", ["require", "exports", "utils/util"], function (require, exports, util_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    util_js_1 = __importDefault(util_js_1);
    class Lives {
        constructor(value) {
            this.value = value;
            this.display = 'flex';
            this.node = document.querySelector('.lives');
        }
        appear() {
            this.node.style.display = this.display;
        }
        lose(value = 1) {
            util_js_1.default.repeat(value, () => {
                this.node.children[--this.value].classList.add('losing');
            });
        }
    }
    exports.default = Lives;
});
define("lib/dom/Score", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Score {
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
    exports.default = Score;
});
define("lib/dom/WordButton", ["require", "exports"], function (require, exports) {
    "use strict";
    var _WordButton_pressed;
    Object.defineProperty(exports, "__esModule", { value: true });
    class WordButton {
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
                    resolve(true);
                });
            });
        }
    }
    exports.default = WordButton;
    _WordButton_pressed = new WeakMap();
});
define("structures/StaticArray", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const lengthErrorText = 'Cannot modify the length of a static array';
    class StaticArray extends Array {
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
    exports.default = StaticArray;
});
define("structures/SparseStaticArray", ["require", "exports", "utils/math", "utils/util", "structures/StaticArray"], function (require, exports, math_js_2, util_js_2, StaticArray_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    math_js_2 = __importDefault(math_js_2);
    util_js_2 = __importDefault(util_js_2);
    StaticArray_js_1 = __importDefault(StaticArray_js_1);
    class SparseStaticArray extends StaticArray_js_1.default {
        constructor(length) {
            super(length);
        }
        filledLength() {
            return this.length - this.vacantIndexes().length;
        }
        vacantIndexes() {
            const result = [];
            util_js_2.default.repeat(this.length, (index) => {
                if (this[index] === undefined)
                    result.push(index);
            });
            return result;
        }
        fillVacant(value) {
            const index = this.vacantIndexes()[0];
            this[index] = value;
            return index;
        }
        fillRandomVacant(value) {
            const vacantIndexes = this.vacantIndexes();
            const index = math_js_2.default.randomInt(vacantIndexes.length - 1);
            this[vacantIndexes[index]] = value;
            return vacantIndexes[index];
        }
    }
    exports.default = SparseStaticArray;
});
define("Game", ["require", "exports", "lib/google-sheets", "lib/dom/dom", "lib/dom/Lives", "lib/dom/Score", "lib/dom/WordButton", "structures/SparseStaticArray", "utils/math", "utils/util"], function (require, exports, google_sheets_js_1, dom_js_1, Lives_js_1, Score_js_1, WordButton_js_1, SparseStaticArray_js_1, math_js_3, util_js_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    google_sheets_js_1 = __importDefault(google_sheets_js_1);
    Lives_js_1 = __importDefault(Lives_js_1);
    Score_js_1 = __importDefault(Score_js_1);
    WordButton_js_1 = __importDefault(WordButton_js_1);
    SparseStaticArray_js_1 = __importDefault(SparseStaticArray_js_1);
    math_js_3 = __importDefault(math_js_3);
    util_js_3 = __importDefault(util_js_3);
    const initOptsDefault = {
        maxWordsPairs: 5,
        score: 0,
        lives: 5,
        tickSpeed: 2000,
    };
    class Game {
        constructor() { }
        init(opts = initOptsDefault) {
            return __awaiter(this, void 0, void 0, function* () {
                const gsData = google_sheets_js_1.default.getData();
                opts = Object.assign(Object.assign({}, initOptsDefault), opts);
                this.maxWordsPairs = opts.maxWordsPairs;
                this.tickSpeed = opts.tickSpeed;
                this.score = new Score_js_1.default(opts.score);
                this.lives = new Lives_js_1.default(opts.lives);
                this.enWordButtons = new SparseStaticArray_js_1.default(this.maxWordsPairs);
                this.ruWordButtons = new SparseStaticArray_js_1.default(this.maxWordsPairs);
                util_js_3.default.repeat(this.maxWordsPairs, () => {
                    dom_js_1.enWordsUL.appendChild(document.createElement('li')).classList.add('words__item');
                    dom_js_1.ruWordsUL.appendChild(document.createElement('li')).classList.add('words__item');
                });
                this.words = (yield gsData).map((wordsArray, index) => ({
                    id: index,
                    value: wordsArray,
                }));
                return this;
            });
        }
        start() {
            if (this.maxWordsPairs === undefined ||
                this.lives === undefined ||
                this.score === undefined ||
                this.enWordButtons === undefined ||
                this.ruWordButtons === undefined)
                return;
            this.lives.appear();
            this.score.appear();
            util_js_3.default.repeat(this.maxWordsPairs, () => this.fillWordsPair());
            const intervalID = setInterval(() => {
                if (!this.lives.value)
                    return this.end(intervalID);
                if (this.enWordButtons.filledLength() < this.enWordButtons.length - 1) {
                    this.fillWordsPair();
                    this.fillWordsPair();
                }
            }, this.tickSpeed);
            return intervalID;
        }
        end(intervalID) {
            clearInterval(intervalID);
            this.enWordButtons.forEach((_, index) => {
                return this.removeWordButton(this.enWordButtons, index, 'mistake');
            });
            this.ruWordButtons.forEach((_, index) => {
                return this.removeWordButton(this.ruWordButtons, index, 'mistake');
            });
        }
        fillWordsPair() {
            const wordIndex = math_js_3.default.randomInt(this.words.length - 1);
            const id = this.words[wordIndex].id;
            const [en, ...ru] = this.words.splice(wordIndex, 1)[0].value;
            this.setupWordButton(id, [en], this.enWordButtons, this.ruWordButtons, dom_js_1.enWordsUL);
            this.setupWordButton(id, ru, this.ruWordButtons, this.enWordButtons, dom_js_1.ruWordsUL);
        }
        setupWordButton(index, content, currentLangButtons, otherLangButtons, currentLangUL) {
            const button = new WordButton_js_1.default(index, ...content);
            const filledIndex = currentLangButtons.fillRandomVacant(button);
            currentLangUL.children[filledIndex].appendChild(button.node);
            button.node.addEventListener('click', () => {
                button.pressed = !button.pressed;
                if (!button.pressed)
                    return;
                const otherLangPressedButtonIndex = otherLangButtons.findIndex((wordButton) => {
                    return wordButton === null || wordButton === void 0 ? void 0 : wordButton.pressed;
                });
                currentLangButtons.forEach((wordButton) => (wordButton.pressed = false));
                button.pressed = true;
                if (otherLangPressedButtonIndex !== -1) {
                    const otherLangPressedButton = otherLangButtons[otherLangPressedButtonIndex];
                    if (otherLangPressedButton.id === button.id) {
                        this.score.add();
                        this.removeWordButton(currentLangButtons, filledIndex, 'success');
                        this.removeWordButton(otherLangButtons, otherLangPressedButtonIndex, 'success');
                    }
                    else {
                        this.lives.lose();
                        const currentLangButtonPairIndex = currentLangButtons.findIndex((currentLangButton) => (currentLangButton === null || currentLangButton === void 0 ? void 0 : currentLangButton.id) === otherLangPressedButton.id);
                        const otherLangButtonPairIndex = otherLangButtons.findIndex((otherLangButton) => (otherLangButton === null || otherLangButton === void 0 ? void 0 : otherLangButton.id) === button.id);
                        this.removeWordButton(currentLangButtons, filledIndex, 'mistake');
                        this.removeWordButton(otherLangButtons, otherLangPressedButtonIndex, 'mistake');
                        this.removeWordButton(currentLangButtons, currentLangButtonPairIndex, 'mistake');
                        this.removeWordButton(otherLangButtons, otherLangButtonPairIndex, 'mistake');
                    }
                }
            });
        }
        removeWordButton(buttonsArray, index, type) {
            return __awaiter(this, void 0, void 0, function* () {
                yield buttonsArray[index].remove(type);
                return delete buttonsArray[index];
            });
        }
    }
    exports.default = Game;
});
define("main", ["require", "exports", "Game"], function (require, exports, Game_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Game_js_1 = __importDefault(Game_js_1);
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const game = new Game_js_1.default();
        yield game.init();
        game.start();
    }))();
});
