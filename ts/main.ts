import Game from './Game.js';

(async () => {
  const game = new Game();
  await game.init();
  game.start();
})();
