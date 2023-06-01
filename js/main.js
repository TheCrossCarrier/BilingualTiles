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
import { enWordsUL, ruWordsUL, livesUL, scoreNode } from './lib/dom/dom.js';
import WordButton from './lib/dom/WordButton.js';
import SparseStaticArray from './structures/SparseStaticArray.js';
import math from './utils/math.js';
import util from './utils/util.js';
let score = 0;
let lives = 5;
(() => __awaiter(void 0, void 0, void 0, function* () {
    const gsData = yield GS.getData();
    livesUL.style.display = 'flex';
    scoreNode.style.display = 'block';
    const words = gsData.map((wordsArray, index) => ({
        id: index,
        value: wordsArray,
    }));
    const maxWordsPairs = 5;
    const enWordButtons = new SparseStaticArray(maxWordsPairs);
    const ruWordButtons = new SparseStaticArray(maxWordsPairs);
    util.repeat(maxWordsPairs, () => {
        enWordsUL.appendChild(document.createElement('li')).classList.add('words__item');
        ruWordsUL.appendChild(document.createElement('li')).classList.add('words__item');
    });
    util.repeat(maxWordsPairs, fillWordsPair);
    const tick = setInterval(() => {
        if (!lives) {
            const denyEn = enWordButtons.map((_, index) => __awaiter(void 0, void 0, void 0, function* () {
                return yield removeWordButton(enWordButtons, index, 'mistake');
            }));
            const denyRu = ruWordButtons.map((_, index) => __awaiter(void 0, void 0, void 0, function* () {
                return yield removeWordButton(ruWordButtons, index, 'mistake');
            }));
            return Promise.all(denyEn.concat(denyRu)).then(() => clearInterval(tick));
        }
        if (enWordButtons.filledLength() < enWordButtons.length - 1) {
            fillWordsPair();
            fillWordsPair();
        }
    }, 2000);
    function fillWordsPair() {
        const wordIndex = math.randomInt(words.length - 1);
        const id = words[wordIndex].id;
        const [en, ...ru] = words.splice(wordIndex, 1)[0].value;
        setupWordButton(id, [en], enWordButtons, ruWordButtons, enWordsUL);
        setupWordButton(id, ru, ruWordButtons, enWordButtons, ruWordsUL);
    }
    function setupWordButton(index, content, currentLangButtons, otherLangButtons, currentLangUL) {
        const button = new WordButton(index, ...content);
        const filledIndex = currentLangButtons.fillRandomVacant(button);
        currentLangUL.children[filledIndex]
            .appendChild(button.node)
            .addEventListener('click', handleClick);
        function handleClick() {
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
                    scoreNode.textContent = (++score).toLocaleString();
                    removeWordButton(currentLangButtons, filledIndex, 'success');
                    removeWordButton(otherLangButtons, otherLangPressedButtonIndex, 'success');
                }
                else {
                    livesUL.children[--lives].classList.add('losing');
                    const currentLangButtonPairIndex = currentLangButtons.findIndex((currentLangButton) => (currentLangButton === null || currentLangButton === void 0 ? void 0 : currentLangButton.id) === otherLangPressedButton.id);
                    const otherLangButtonPairIndex = otherLangButtons.findIndex((otherLangButton) => (otherLangButton === null || otherLangButton === void 0 ? void 0 : otherLangButton.id) === button.id);
                    removeWordButton(currentLangButtons, filledIndex, 'mistake');
                    removeWordButton(otherLangButtons, otherLangPressedButtonIndex, 'mistake');
                    removeWordButton(currentLangButtons, currentLangButtonPairIndex, 'mistake');
                    removeWordButton(otherLangButtons, otherLangButtonPairIndex, 'mistake');
                }
            }
        }
    }
    function removeWordButton(buttonsArray, index, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield buttonsArray[index].remove(type).then(() => delete buttonsArray[index]);
        });
    }
}))();
//# sourceMappingURL=main.js.map