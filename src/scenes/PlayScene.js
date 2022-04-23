import BaseScene from './BaseScene';
const pipesToRender = 4;
class PlayScene extends BaseScene {

    constructor(config) {
        super('PlayScene',config);
        this.initialBirdPosition = {
            x: 80, y: 300
        }
        this.bird = null;
        this.Pipes = null;
        this.au = null;
        this.score=0;
        this.scoreText=' ';
        this.isPaused=false;
        this.isRestart=false;
        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [500, 550];
        this.flapVelocity = 300;
        this.currentDifficulty='easy';
        this.auu=false;
        this.difficulties={
            'easy':{
                pipeHorizontalDistanceRange: [300, 350],
                pipeVerticalDistanceRange: [150, 200],
            },
            'normal':{
                pipeHorizontalDistanceRange: [280, 330],
                pipeVerticalDistanceRange: [140, 190],
            },
            'hard':{
                pipeHorizontalDistanceRange: [250, 310],
                pipeVerticalDistanceRange: [120, 170],
            },
        }
    }


    create() {
        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.listenToEvents();

    }

    listenToEvents(){
        if(this.pauseEvent)
        {
            return;
        }
        this.pauseEvent=this.events.on('resume',()=>{
            this.initialTime=3;
            if (this.auu==true)
                this.restartBirdPos();
            else{
            this.countDownText=this.add.text(...this.screenCenter,'Starts in: '+this.initialTime,this.fontOptions).setOrigin(0.5)
            this.timedEvent=this.time.addEvent({
                delay:1000,
                callback:this.countDown,


                callbackScope:this,
                loop:true
            })}
        });
    }

    countDown(){
        this.initialTime--;
        this.countDownText.setText('Starts in: '+this.initialTime);
        if(this.initialTime<=0)
        {   
            this.countDownText.setText('');
            this.physics.resume();
            this.input.on('pointerdown', this.flap, this);
            this.isPaused=false;
            this.timedEvent.remove();
        }
    }
    createPause(){
        const pauseBtn=this.add.image(this.config.width-10,this.config.height-10,'pause').setScale(3).setOrigin(1);
        this.isPaused=false;
        this.isRestart=false;
        this.auu=false;
        this.currentDifficulty='easy';
        pauseBtn.setInteractive();
        pauseBtn.on('pointerdown',()=>{
            this.sound.stopAll();
            this.input.off('pointerdown', this.flap, this);
            this.input.off('pointerdown', this.restartGame, this);
            this.isPaused=true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene'); 

        });
    
    }

    createBg() {
        this.add.image(0, 0, 'sky').setOrigin(0);
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPos.x, this.config.startPos.y, 'bird').setOrigin(0);
        //bird.body.velocity.x=200;
        this.bird.dead=false;
        this.bird.body.gravity.y = 400;
        this.bird.displayWidth = 30;
        this.bird.displayHeight = 30;
        this.bird.width = 30;
        this.bird.height = 30;
        this.input.on('pointerdown', this.flap, this);
        this.saritura = this.sound.add('saritura', { loop: false });
        this.au = this.sound.add('au', { loop: false,volume:0.2 });
        this.saritura.allowMultiple = true;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {
        this.Pipes = this.physics.add.group();
        for (let i = 0; i < pipesToRender; i++) {
            const pipeUp = this.Pipes.create(0, 0, 'pipe')
            .setImmovable(true)
            .setOrigin(0, 1);
            pipeUp.name='0';
            const pipeDown = this.Pipes.create(0, 0, 'pipe')
            .setImmovable(true)
            .setOrigin(0, 0);
            pipeDown.name='0';
            this.addPipe(pipeUp, pipeDown);
        }
        this.Pipes.setVelocityX(-200);
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.Pipes, this.restartBirdPos, null, this);
    }

    createScore()
    {
        this.score=0;
        const bestScore=localStorage.getItem('bestScore');
        this.scoreText=this.add.text(16,16,`Score: ${0}`,{fontSize:'32px',fill:'#000'});
        this.add.text(16,50,`Best Score: ${bestScore||0}`,{fontSize:'20px',fill:'#000'});
    }

    update() {
        this.checkGameStatus();
        this.recyclePipes();
    }
    checkGameStatus() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0)
            this.restartBirdPos();
        const tempPipes = [];
        this.Pipes.getChildren().forEach(pipe =>  {
                if(pipe.getCenter().x<=this.bird.x&&pipe.name=='0')
                {
                    pipe.name='1';
                    tempPipes.push(pipe);
                    if (tempPipes.length === 2) {
                    this.increaseScore();
                    this.increaseDifficulty();
                }
                }
        })
    }

    increaseDifficulty(){
        if(this.score===10)
            this.currentDifficulty='normal';
        if(this.score===20)
            this.currentDifficulty='hard';

    }
    addPipe(pipeU, pipeD) {
        const difficulty=this.difficulties[this.currentDifficulty];
        const rightMostX = this.getRightMostPipe();
        let pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
        let pipehorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);
        let pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance);
        pipeU.x = rightMostX + pipehorizontalDistance;
        pipeU.y = pipeVerticalPosition;
        
        pipeD.x = pipeU.x;
        pipeD.y = pipeU.y + pipeVerticalDistance;
        pipeU.name='0';
        pipeD.name='0';
    }

    getRightMostPipe() {
        let rightMostX = 0;
        this.Pipes.getChildren().forEach(function (pipe) {
            rightMostX = Math.max(pipe.x, rightMostX);
        })

        return rightMostX;
    }


    //reface pipele
    recyclePipes() {
        const tempPipes = [];
        this.Pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= 0) {
                tempPipes.push(pipe);
                if (tempPipes.length === 2) {
                    this.addPipe(...tempPipes);
                }
            }
        })
    }

    restartBirdPos() {
        //this.au.play();
       /*  this.bird.x = this.config.width / 10;
        this.bird.y = this.config.height / 2;
        this.bird.body.velocity.y = 0; */

        this.physics.pause();
        this.bird.setTint(0xff0000);
        this.input.on('pointerdown', this.restartGame, this);
        if(this.auu==false)
            {this.au.play();
            this.auu=true;
    
        const bestScoreText=localStorage.getItem('bestScore');
        const bestScore=bestScoreText&&parseInt(bestScoreText,10);
        if(!bestScore||this.score>bestScore)
        {
            localStorage.setItem('bestScore',this.score);
        }
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const TextEnding = this.add.text(screenCenterX, screenCenterY, 'Press to play again!',{fontSize:'14px',fill:'#000',fontweight: 'bold',stroke: '#000000',
        strokeThickness: 1}).setOrigin(0.5).setResolution(5);
        this.isRestart=true;}
    }
  


    
    flap() {
        if(this.isPaused||this.isRestart)
        {return;}
        this.sound.play('saritura');
        this.bird.body.velocity.y = -250;
    }

    flap2()
    {
        this.au.play();
    }
    increaseScore(){

        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    restartGame(){
        this.sound.stopAll();
        this.auu=false;
        this.isRestart=false;
        this.scene.restart();
    }


    //final clasa
}

export default PlayScene