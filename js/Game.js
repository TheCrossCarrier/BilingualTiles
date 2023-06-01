var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import GS from './lib/google-sheets.js';
import { enWordsUL, ruWordsUL } from './lib/dom/dom.js';
import Lives from './lib/dom/Lives.js';
import Score from './lib/dom/Score.js';
import WordButton from './lib/dom/WordButton.js';
import SparseStaticArray from './structures/SparseStaticArray.js';
import math from './utils/math.js';
import util from './utils/util.js';
const initOptsDefault = {
    maxWordsPairs: 5,
    score: 0,
    lives: 5,
    tickSpeed: 2000,
};
export default class Game {
    constructor() { }
    init(opts = initOptsDefault) {
        return __awaiter(this, void 0, void 0, function* () {
            const gsData = GS.getData();
            opts = Object.assign(Object.assign({}, initOptsDefault), opts);
            this.maxWordsPairs = opts.maxWordsPairs;
            this.tickSpeed = opts.tickSpeed;
            this.score = new Score(opts.score);
            this.lives = new Lives(opts.lives);
            this.enWordButtons = new SparseStaticArray(this.maxWordsPairs);
            this.ruWordButtons = new SparseStaticArray(this.maxWordsPairs);
            util.repeat(this.maxWordsPairs, () => {
                enWordsUL.appendChild(document.createElement('li')).classList.add('words__item');
                ruWordsUL.appendChild(document.createElement('li')).classList.add('words__item');
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
        util.repeat(this.maxWordsPairs, () => this.fillWordsPair());
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
        const wordIndex = math.randomInt(this.words.length - 1);
        const id = this.words[wordIndex].id;
        const wordsPair = this.words.splice(wordIndex, 1)[0].value;
        const [en, ru] = [wordsPair[0], wordsPair[wordsPair.length - 1]];
        this.setupWordButton(id, en, this.enWordButtons, this.ruWordButtons, enWordsUL);
        this.setupWordButton(id, ru, this.ruWordButtons, this.enWordButtons, ruWordsUL);
    }
    setupWordButton(index, text, currentLangButtons, otherLangButtons, currentLangUL) {
        const button = new WordButton(index, text);
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
