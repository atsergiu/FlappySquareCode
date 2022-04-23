
import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import PlayScene from './scenes/PlayScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';
const WIDTH=500;
const HEIGHT=600;
const BIRD_POSITION={x:WIDTH/10,y:HEIGHT/2};
const SHARED_CONFIG={
  width:WIDTH,
  height:HEIGHT,
  startPos:BIRD_POSITION
}

const Scenes=[PreloadScene,MenuScene,PlayScene,ScoreScene,PauseScene];


const initScenes=()=>Scenes.map((Scene)=>new Scene(SHARED_CONFIG))

const config={
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  parent:'my-game',
  physics:{


    default:'arcade',
    arcade: {
      debug: false,
  },
  },
  scene:initScenes()
}

new Phaser.Game(config);
