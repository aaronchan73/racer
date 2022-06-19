const gameState = {
    score: 0,
    highscore: 0,
    lives: 3
}

class StartScene extends Phaser.Scene {

    constructor(){
        super({key: "StartScene"});
    }

    preload(){
        this.load.image("background", "assets/background2.jpg");
        this.load.image("title", "assets/racerTitle1.PNG");
        this.load.image("space", "assets/space1.PNG");
    }

    create(){
        gameState.cursors = this.input.keyboard.createCursorKeys();
        this.add.image(-50, -17, "background").setScale(1.25);
        this.add.image(200, 200, "title");
        this.add.image(200, 230, "space");
    }

    update(){
        if(gameState.cursors.space.isDown){
            this.scene.stop('StartScene');
            this.scene.start('GameScene');
        }
    }
}

class GameScene extends Phaser.Scene {

    constructor(){
        super({key: "GameScene"});

    }

    preload(){
        this.load.image("car", "assets/car1.png");
        this.load.image("road", "assets/road.png");
        this.load.image("wall", "assets/wall.png");
        this.load.image("background", "assets/background2.jpg");
        this.load.image("gameover", "assets/gameover.PNG");
        this.load.image("restartText", "assets/restart.PNG");
    }

    create(){

        gameState.road = this.add.image(200, 0, "road");
        gameState.road1 = this.add.image(200, 2000, "road");

        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.car = this.physics.add.sprite(200, 20, "car");
        gameState.car.setScale(2);

        this.cameras.main.setBounds(0, 0, 400, 2000);
        this.cameras.main.startFollow(gameState.car, true, 0.5, 0.5);

        gameState.scoreboard = this.add.text(0, 0, `score: ${gameState.score}`);
        gameState.liveboard = this.add.text(320, 0, `lives: ${gameState.lives}`);

        const walls = this.physics.add.staticGroup();
    
        for(let i = 0; i < 7; i++){
            var randX = Math.random() * 400;
            var randY = Math.random() * 2000;
            if(randY <= 200){
                randY += 200;
            }
            walls.create(randX, randY, 'wall');
        }
        
        this.physics.add.collider(walls, gameState.car, function(){
            gameState.lives--;
            gameState.liveboard.setText(`lives: ${gameState.lives}`);
            gameState.car.y = 0;
        });

        gameState.background = this.add.image(-50, -17, "background").setScale(1.25);
        gameState.restartText = this.add.image(200, 223, "restartText");
        gameState.gameover = this.add.image(200, 200, "gameover");
        gameState.background.visible = false;
        gameState.gameover.visible = false;
        gameState.restartText.visible = false;

    }

    update(){
        if(gameState.cursors.left.isDown){
            gameState.car.x-=5;
            gameState.car.y+=5;
        }
        else if(gameState.cursors.right.isDown){
            gameState.car.x+=5;
            gameState.car.y+=5;
        }
        else if(gameState.car.x >= 390){
            gameState.car.x = 390;
            gameState.car.x-=5;
        }
        else if(gameState.car.x <= 10){
            gameState.car.x = 10;
            gameState.car.x+=5;
        }
        else if(gameState.car.y >= 2000){
            gameState.car.y = 0;
            this.scene.restart();
            gameState.score++;
            gameState.scoreboard.setText(`score: ${gameState.score}`);
        }
        else if(gameState.lives == 0){
            gameState.background.visible = true;
            gameState.gameover.visible = true;
            gameState.restartText.visible = true;
            gameState.scoreboard.visible = false;
            if(gameState.score > gameState.highscore){
                gameState.highscore = gameState.score;
            }
            gameState.highscoreBoard = this.add.text(145, 230, `highscore: ${gameState.highscore}`);
            if(gameState.cursors.space.isDown){
                gameState.lives = 3;
                gameState.score = 0;
                this.scene.restart();
            }
        }
        else{
            gameState.car.y+=5;
        }

    }

}

const config = {
    type: Phaser.AUTO,
    backgroundColor: 0x000000,
    width: 400,
    height: 400,
    scene: [StartScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
        }
        
    }
}

const game = new Phaser.Game(config);