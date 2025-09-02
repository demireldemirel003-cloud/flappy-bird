export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.score = data.score || 0;
    }

    preload() {
        this.load.image('background', 'assets/background-day.png');
        this.load.image('base', 'assets/base.png');
    }

    create() {
        // Background
        this.background = this.add.tileSprite(0, 0, 1280, 720, 'background');
        this.background.setOrigin(0, 0);
        this.background.setScale(2.5);

        // Ground
        this.ground = this.add.tileSprite(0, 720 - 112, 1280, 112, 'base');
        this.ground.setOrigin(0, 0);
        this.ground.setScale(2);

        // Game Over text
        const gameOverText = this.add.text(640, 200, 'OYUN BİTTİ', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 8
        });
        gameOverText.setOrigin(0.5);

        // Score
        const scoreText = this.add.text(640, 300, `Skor: ${this.score}`, {
            fontSize: '48px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        });
        scoreText.setOrigin(0.5);

        // Restart button
        const restartButton = this.add.text(640, 400, 'TEKRAR OYNA', {
            fontSize: '36px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6,
            padding: { x: 20, y: 10 }
        });
        restartButton.setOrigin(0.5);
        restartButton.setInteractive({ useHandCursor: true });

        // Hover effect
        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#ff0' });
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#fff' });
        });

        // Click effect
        restartButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Menu button
        const menuButton = this.add.text(640, 500, 'ANA MENÜ', {
            fontSize: '36px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6,
            padding: { x: 20, y: 10 }
        });
        menuButton.setOrigin(0.5);
        menuButton.setInteractive({ useHandCursor: true });

        // Hover effect
        menuButton.on('pointerover', () => {
            menuButton.setStyle({ fill: '#ff0' });
        });

        menuButton.on('pointerout', () => {
            menuButton.setStyle({ fill: '#fff' });
        });

        // Click effect
        menuButton.on('pointerdown', () => {
            this.scene.start('Menu');
        });

        // Animation for game over text
        this.tweens.add({
            targets: gameOverText,
            scale: 1.1,
            duration: 1500,
            ease: 'Sine.InOut',
            yoyo: true,
            repeat: -1
        });
    }

    update() {
        // Move ground for animation effect
        this.ground.tilePositionX += 2;
        this.background.tilePositionX += 0.5;
    }
}