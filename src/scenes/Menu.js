export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('background', 'assets/background-day.png');
        this.load.image('base', 'assets/base.png');
        this.load.image('bird-midflap', 'assets/bird-midflap.png');
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

        // Title
        const title = this.add.text(640, 200, 'FLAPPY BIRD', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 8
        });
        title.setOrigin(0.5);

        // Bird
        const bird = this.add.image(640, 300, 'bird-midflap');
        bird.setScale(3);

        // Start button
        const startButton = this.add.text(640, 400, 'BAŞLA', {
            fontSize: '48px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6,
            padding: { x: 20, y: 10 }
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive({ useHandCursor: true });

        // Hover effect
        startButton.on('pointerover', () => {
            startButton.setStyle({ fill: '#ff0' });
        });

        startButton.on('pointerout', () => {
            startButton.setStyle({ fill: '#fff' });
        });

        // Click effect
        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Instructions
        const instructions = this.add.text(640, 500, 'Kuşu zıplatmak için tıkla veya SPACE tuşuna bas', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        });
        instructions.setOrigin(0.5);

        // Animation for bird
        this.tweens.add({
            targets: bird,
            y: 330,
            duration: 1000,
            ease: 'Sine.InOut',
            yoyo: true,
            repeat: -1
        });

        // Animation for title
        this.tweens.add({
            targets: title,
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