import GS from './lib/google-sheets.js';
import { enWordsUL, ruWordsUL, livesUL, scoreNode } from './lib/dom/dom.js';
import WordButton from './lib/dom/WordButton.js';
import SparseStaticArray from './structures/SparseStaticArray.js';
import math from './utils/math.js';
import util from './utils/util.js';

let score = 0;
let lives = 5;

(async () => {
  const gsData = await GS.getData();

  livesUL.style.display = 'flex';
  scoreNode.style.display = 'block';

  interface WordsPairsWithIDs {
    id: number;
    value: string[];
  }

  const words: WordsPairsWithIDs[] = gsData.map((wordsArray, index) => ({
    id: index,
    value: wordsArray,
  }));

  const maxWordsPairs = 5;

  //* Init button arrays
  const enWordButtons = new SparseStaticArray<WordButton>(maxWordsPairs);
  const ruWordButtons = new SparseStaticArray<WordButton>(maxWordsPairs);

  //* Init LIs
  util.repeat(maxWordsPairs, () => {
    enWordsUL.appendChild(document.createElement('li')).classList.add('words__item');
    ruWordsUL.appendChild(document.createElement('li')).classList.add('words__item');
  });

  //* Init buttons for start
  util.repeat(maxWordsPairs, fillWordsPair);

  const tick = setInterval(() => {
    if (!lives) {
      const denyEn = enWordButtons.map(async (_, index) => {
        return await removeWordButton(enWordButtons, index, 'mistake');
      });

      const denyRu = ruWordButtons.map(async (_, index) => {
        return await removeWordButton(ruWordButtons, index, 'mistake');
      });

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

  function setupWordButton(
    index: number,
    content: string[],
    currentLangButtons: SparseStaticArray<WordButton>,
    otherLangButtons: SparseStaticArray<WordButton>,
    currentLangUL: HTMLUListElement,
  ) {
    const button = new WordButton(index, ...content);
    const filledIndex = currentLangButtons.fillRandomVacant(button);

    currentLangUL.children[filledIndex]
      .appendChild(button.node)
      .addEventListener('click', handleClick);

    // button.appear();

    function handleClick() {
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
          scoreNode.textContent = (++score).toLocaleString();

          //* Removing buttons with success animation
          removeWordButton(currentLangButtons, filledIndex, 'success');
          removeWordButton(otherLangButtons, otherLangPressedButtonIndex, 'success');
        } else {
          livesUL.children[--lives].classList.add('losing');

          //* Find pairs for both of buttons
          const currentLangButtonPairIndex = currentLangButtons.findIndex(
            (currentLangButton) => currentLangButton?.id === otherLangPressedButton.id,
          );
          const otherLangButtonPairIndex = otherLangButtons.findIndex(
            (otherLangButton) => otherLangButton?.id === button.id,
          );

          //* Removing buttons with mistake animation...
          removeWordButton(currentLangButtons, filledIndex, 'mistake');
          removeWordButton(otherLangButtons, otherLangPressedButtonIndex, 'mistake');
          //* ...and their pair buttons
          removeWordButton(currentLangButtons, currentLangButtonPairIndex, 'mistake');
          removeWordButton(otherLangButtons, otherLangButtonPairIndex, 'mistake');
        }
      }
    }
  }

  async function removeWordButton(
    buttonsArray: SparseStaticArray<WordButton>,
    index: number,
    type: 'success' | 'mistake',
  ) {
    return await buttonsArray[index].remove(type).then(() => delete buttonsArray[index]);
  }
})();
