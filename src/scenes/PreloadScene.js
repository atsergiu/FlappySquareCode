import Phaser from 'phaser'
const pipesToRender = 4;
class PreloadScene extends Phaser.Scene {
    constructor(config) {
        super('PreloadScene');
        this.config = config;
    }

    preload() {
        this.load.image('sky', '../assets/games/flap/assets/sky.png');
        this.load.image('bird', '../assets/games/flap/assets/bird.png');
        this.load.image('pipe', '../assets/games/flap/assets/pipe.png');
        this.load.image('pause', '../assets/games/flap/assets/pause.png');
        this.load.audio('saritura', '../assets/games/flap/assets/saritura2.mp3');
        this.load.audio('au', '../assets/games/flap/assets/au.wav');
        this.load.image('back', '../assets/games/flap/assets/back.png');
    }
    create()
    {
        this.scene.start('MenuScene');
    }
}

export default PreloadScene;