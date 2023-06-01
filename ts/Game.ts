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

/**
 * @example
 * (async () => {
 *   const game = new Game();
 *   await game.init()
 *   game.start()
 * })()
 */
export default class Game {
  maxWordsPairs?: number;
  score?: Score;
  lives?: Lives;
  /** ms */
  tickSpeed?: number;

  enWordButtons?: SparseStaticArray<WordButton>;
  ruWordButtons?: SparseStaticArray<WordButton>;

  words?: { id: number; value: string[] }[];

  constructor() {} //?

  async init(opts?: {
    maxWordsPairs?: number;
    score?: number;
    lives?: number;
  }): Promise<this>;

  async init(opts = initOptsDefault) {
    //* Start fetching Google Sheets
    const gsData = GS.getData();

    //* Applying defaults
    opts = Object.assign({ ...initOptsDefault }, opts);
    this.maxWordsPairs = opts.maxWordsPairs;
    this.tickSpeed = opts.tickSpeed;

    //* Create UI elements
    this.score = new Score(opts.score);
    this.lives = new Lives(opts.lives);

    //* Init buttons arrays
    this.enWordButtons = new SparseStaticArray<WordButton>(this.maxWordsPairs);
    this.ruWordButtons = new SparseStaticArray<WordButton>(this.maxWordsPairs);

    //* Init LIs
    util.repeat(this.maxWordsPairs, () => {
      enWordsUL.appendChild(document.createElement('li')).classList.add('words__item');
      ruWordsUL.appendChild(document.createElement('li')).classList.add('words__item');
    });

    //* Apply fetched data
    this.words = (await gsData).map((wordsArray, index) => ({
      id: index,
      value: wordsArray,
    }));

    return this;
  }

  start() {
    //* Is initialized check
    if (
      this.maxWordsPairs === undefined ||
      this.lives === undefined ||
      this.score === undefined ||
      this.enWordButtons === undefined ||
      this.ruWordButtons === undefined
    )
      return;

    //* Appear UI elements
    this.lives.appear();
    this.score.appear();

    //* Fill up the button slots (LIs)
    util.repeat(this.maxWordsPairs, () => this.fillWordsPair());

    //* Game ticks
    const intervalID = setInterval(() => {
      if (!this.lives!.value) return this.end(intervalID);

      if (this.enWordButtons!.filledLength() < this.enWordButtons!.length - 1) {
        this.fillWordsPair();
        this.fillWordsPair();
      }
    }, this.tickSpeed);

    return intervalID;
  }

  end(intervalID: number) {
    clearInterval(intervalID);

    this.enWordButtons!.forEach((_, index) => {
      return this.removeWordButton(this.enWordButtons!, index, 'mistake');
    });

    this.ruWordButtons!.forEach((_, index) => {
      return this.removeWordButton(this.ruWordButtons!, index, 'mistake');
    });
  }

  fillWordsPair() {
    const wordIndex = math.randomInt(this.words!.length - 1);
    const id = this.words![wordIndex].id;
    const [en, ...ru] = this.words!.splice(wordIndex, 1)[0].value;

    this.setupWordButton(id, [en], this.enWordButtons!, this.ruWordButtons!, enWordsUL);
    this.setupWordButton(id, ru, this.ruWordButtons!, this.enWordButtons!, ruWordsUL);
  }

  setupWordButton(
    index: number,
    content: string[],
    currentLangButtons: SparseStaticArray<WordButton>,
    otherLangButtons: SparseStaticArray<WordButton>,
    currentLangUL: HTMLUListElement,
  ) {
    const button = new WordButton(index, ...content);
    const filledIndex = currentLangButtons.fillRandomVacant(button);

    currentLangUL.children[filledIndex].appendChild(button.node);

    button.node.addEventListener('click', () => {
      button.pressed = !button.pressed;
      if (!button.pressed) return;

      const otherLangPressedButtonIndex = otherLangButtons.findIndex((wordButton) => {
        return wordButton?.pressed;
      });

      //* Unpress all buttons in list...
      currentLangButtons.forEach((wordButton) => (wordButton.pressed = false));
      //* ...and press the current one
      button.pressed = true;

      if (otherLangPressedButtonIndex !== -1) {
        const otherLangPressedButton = otherLangButtons[otherLangPressedButtonIndex];

        //* Match pressed buttons from both langs
        if (otherLangPressedButton.id === button.id) {
          this.score!.add();

          //* Removing buttons with success animation
          this.removeWordButton(currentLangButtons, filledIndex, 'success');
          this.removeWordButton(otherLangButtons, otherLangPressedButtonIndex, 'success');
        } else {
          this.lives!.lose();

          //* Find pairs for both of buttons
          const currentLangButtonPairIndex = currentLangButtons.findIndex(
            (currentLangButton) => currentLangButton?.id === otherLangPressedButton.id,
          );
          const otherLangButtonPairIndex = otherLangButtons.findIndex(
            (otherLangButton) => otherLangButton?.id === button.id,
          );

          //* Removing buttons with mistake animation...
          this.removeWordButton(currentLangButtons, filledIndex, 'mistake');
          this.removeWordButton(otherLangButtons, otherLangPressedButtonIndex, 'mistake');
          //* ...and their pair buttons
          this.removeWordButton(
            currentLangButtons,
            currentLangButtonPairIndex,
            'mistake',
          );
          this.removeWordButton(otherLangButtons, otherLangButtonPairIndex, 'mistake');
        }
      }
    });
  }

  async removeWordButton(
    buttonsArray: SparseStaticArray<WordButton>,
    index: number,
    type: 'success' | 'mistake',
  ) {
    await buttonsArray[index].remove(type);
    return delete buttonsArray[index];
  }
}
