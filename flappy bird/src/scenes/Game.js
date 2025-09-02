export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        // Global değişkenleri tanımla
        this.score = 0;
        this.scoreText = null;
    }

    preload() {
        this.load.image('background', 'assets/background-day.png');
        this.load.image('base', 'assets/base.png');
        this.load.image('pipe', 'assets/pipe-green.png');
        this.load.spritesheet('bird', 'assets/bird-downflap.png', { frameWidth: 34, frameHeight: 24 });
        this.load.image('bird-midflap', 'assets/bird-midflap.png');
        this.load.image('bird-upflap', 'assets/bird-upflap.png');
    }

    create() {
        // Game variables
        this.gameOver = false;
        // this.score constructor'da tanımlandı, burada sadece sıfırlıyoruz
        this.score = 0;
        this.speed = 2;
        this.jumpForce = 300;
        this.gravity = 800;
        this.pipeGap = 200;
        this.pipeSpawnTime = 2000; // milliseconds
        


        // Background
        this.background = this.add.tileSprite(0, 0, 1280, 720, 'background');
        this.background.setOrigin(0, 0);
        this.background.setScale(2.5);

        // Ground
        this.ground = this.add.tileSprite(0, 720 - 112, 1280, 112, 'base');
        this.ground.setOrigin(0, 0);
        this.ground.setScale(2);

        // Add physics to ground
        this.physics.add.existing(this.ground, true);

        // Bird
        this.bird = this.physics.add.sprite(100, 300, 'bird');
        this.bird.setScale(2);
        this.bird.setGravityY(this.gravity);
        this.bird.setCollideWorldBounds(true);

        // Bird animation
        this.anims.create({
            key: 'fly',
            frames: [
                { key: 'bird' },
                { key: 'bird-midflap' },
                { key: 'bird-upflap' },
            ],
            frameRate: 10,
            repeat: -1
        });
        this.bird.play('fly');

        // Pipes group
        this.pipes = this.physics.add.group();
        
        // Score triggers group - ayrı bir grup oluşturuyoruz
        this.scoreTriggers = this.physics.add.group();

        // Spawn pipes
        this.pipeTimer = this.time.addEvent({
            delay: this.pipeSpawnTime,
            callback: this.spawnPipes,
            callbackScope: this,
            loop: true
        });

        // Score text - global değişkeni kullanarak oluştur
        console.log('Creating score text with initial score:', this.score);
        
        this.scoreText = this.add.text(640, 50, 'Score: ' + this.score, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        });
        this.scoreText.setOrigin(0.5, 0);
        this.scoreText.setDepth(1000); // Skor yazısını en üst katmana yerleştir
        console.log('Score text created:', this.scoreText.text);

        // Input
        this.input.on('pointerdown', this.jump, this);
        this.input.keyboard.on('keydown-SPACE', this.jump, this);

        // Collisions
        this.physics.add.collider(this.bird, this.ground, this.gameOverHandler, null, this);
        this.physics.add.collider(this.bird, this.pipes, this.gameOverHandler, null, this);
        
        // Check for score - kuş score trigger'lardan geçtiğinde skor artacak
        this.physics.add.overlap(
            this.bird, 
            this.scoreTriggers, 
            this.addScore, 
            null, 
            this
        );
        
        console.log('Overlap detection set up between bird and score triggers');
    }

    update() {
        if (this.gameOver) {
            return;
        }

        // Move ground
        this.ground.tilePositionX += this.speed;
        this.background.tilePositionX += this.speed / 4;

        // Rotate bird based on velocity
        if (this.bird.body.velocity.y > 0) {
            this.bird.angle += 1;
            if (this.bird.angle > 90) {
                this.bird.angle = 90;
            }
        } else {
            this.bird.angle = -30;
        }

        // Check if bird is out of bounds
        if (this.bird.y < 0) {
            this.bird.y = 0;
            this.bird.body.velocity.y = 0;
        }
        
        // Her karede skor yazısını güncelle - bu, başka bir yerde değiştirilmiş olabilecek skoru düzeltir
        this.scoreText.setText('Score: ' + this.score);
        

    }

    jump() {
        if (this.gameOver) {
            this.restartGame();
            return;
        }

        this.bird.body.velocity.y = -this.jumpForce;
    }

    spawnPipes() {
        if (this.gameOver) return;

        // Random position for the gap
        const gapPosition = Phaser.Math.Between(150, 720 - 150 - this.pipeGap);

        // Top pipe
        const topPipe = this.pipes.create(1280, gapPosition - this.pipeGap / 2, 'pipe');
        topPipe.setOrigin(0.5, 1); // Set origin to bottom center
        topPipe.setScale(2);
        topPipe.body.setImmovable(true);
        topPipe.body.setVelocityX(-200);
        topPipe.setFlipY(true);

        // Bottom pipe
        const bottomPipe = this.pipes.create(1280, gapPosition + this.pipeGap / 2, 'pipe');
        bottomPipe.setOrigin(0.5, 0); // Set origin to top center
        bottomPipe.setScale(2);
        bottomPipe.body.setImmovable(true);
        bottomPipe.body.setVelocityX(-200);

        // Score trigger - kuşun geçtiği noktada skor artırmak için görünmez tetikleyici
        const scoreTrigger = this.add.rectangle(1280 + 50, 360, 100, 720, 0xff0000, 0); // Şeffaf (görünmez)
        this.physics.add.existing(scoreTrigger);
        scoreTrigger.body.setAllowGravity(false);
        scoreTrigger.body.setImmovable(true);
        scoreTrigger.body.setVelocityX(-200);
        scoreTrigger.scored = false;
        // Score trigger'ı ayrı gruba ekle
        this.scoreTriggers.add(scoreTrigger);

        // Auto-destroy pipes when they're off screen
        topPipe.checkWorldBounds = true;
        topPipe.outOfBoundsKill = true;
        bottomPipe.checkWorldBounds = true;
        bottomPipe.outOfBoundsKill = true;
        scoreTrigger.checkWorldBounds = true;
        scoreTrigger.outOfBoundsKill = true;
    }

    addScore(bird, trigger) {
        // Eğer bu trigger zaten skor verdiyse, tekrar verme
        if (trigger.scored) return;
        
        // Trigger'ı işaretleyelim ki tekrar skor vermesin
        trigger.scored = true;

        // Skoru artır
        this.score += 1;
        
        // Skor metnini güncelle
        if (this.scoreText) {
            this.scoreText.setText('Score: ' + this.score);
            
            // Skor artışını göstermek için bir efekt ekleyelim
            this.tweens.add({
                targets: this.scoreText,
                scale: { from: 1.5, to: 1 },
                duration: 200,
                ease: 'Sine.easeOut'
            });
        }
    }

    gameOverHandler() {
        if (this.gameOver) return;

        this.gameOver = true;
        this.bird.play('fly', false);
        this.pipeTimer.paused = true;

        // Stop all pipes
        this.pipes.getChildren().forEach(pipe => {
            pipe.body.setVelocityX(0);
        });

        // Wait a moment before transitioning to GameOver scene
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOver', { score: this.score });
        });
    }

    restartGame() {
        this.scene.restart();
    }
}