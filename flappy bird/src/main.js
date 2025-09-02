import { Start } from './scenes/Start.js';
import { Game } from './scenes/Game.js';
import { Menu } from './scenes/Menu.js';
import { GameOver } from './scenes/GameOver.js';

const config = {
    type: Phaser.AUTO,
    title: 'Flappy Bird',
    description: 'A Flappy Bird clone made with Phaser 3',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#4ec0ca',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        Menu,
        Game,
        GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

new Phaser.Game(config);
            