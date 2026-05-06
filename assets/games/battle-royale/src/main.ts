import * as THREE from 'three';
import { Game } from './core/Game.js';

const app = document.getElementById('app')!;

const game = new Game(app);
game.start();
