import './styles.css';

import { GameApp } from './runtime/GameApp';

const host = document.querySelector<HTMLDivElement>('#app');

if (!host) {
  throw new Error('Missing #app host element.');
}

const game = new GameApp(host);

void game.start();
