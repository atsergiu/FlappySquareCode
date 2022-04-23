import BaseScene from './BaseScene';
const pipesToRender = 4;
class ScoreScene extends BaseScene {
    constructor(config) {
        super('ScoreScene',{...config,canGoBack:true});
    }

    create()
    {
        super.create();
        this.showScore();
    }

    showScore()
    {
        const bestScore=localStorage.getItem('bestScore');
        this.add.text(this.config.width/2,this.config.height/2,`Best Score: ${bestScore||0}`,this.fontOptions).setOrigin(0.5);
    }
}

export default ScoreScene;