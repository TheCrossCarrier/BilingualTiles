export const enWordsUL = document.querySelector('.words_en') as HTMLUListElement,
  ruWordsUL = document.querySelector('.words_ru') as HTMLUListElement;

export const livesUL = document.querySelector('.lives') as HTMLUListElement;
export const scoreNode = document.querySelector('.score') as HTMLElement;

// export function createButtonContainer() {
//   const buttonContainer = document.createElement('li');
//   buttonContainer.classList.add('words__item');

//   return buttonContainer;
// }

// export function toggleStringBooleanAttribute(element: Element, qualifiedName: string) {
//   const booleanAttribute =
//     element.getAttribute(qualifiedName) === 'false'
//       ? false
//       : element.getAttribute(qualifiedName) === 'true'
//       ? true
//       : null;

//   if (!element.hasAttribute(qualifiedName) || !booleanAttribute) {
//     element.setAttribute(qualifiedName, 'true');
//   } else if (booleanAttribute) {
//     element.setAttribute(qualifiedName, 'false');
//   }
// }

// export default { createButtonContainer };
