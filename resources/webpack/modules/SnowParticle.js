import * as PIXI from 'pixi.js';
import Ease from 'pixi-ease';

export default class SnowParticle {
  constructor($WRAPPER, PATHS, SIZE, SPEED) {
    this.contentWidth = $WRAPPER.offsetWidth;
    this.contentHeight = $WRAPPER.offsetHeight;

    PIXI.loader.add(PATHS).load(() => {
      let app = new PIXI.Application(this.contentWidth, this.contentHeight, {
        backgroundColor: 0x1099bb
      });
      $WRAPPER.appendChild(app.view);

      // 表示する画像の数
      const PARTICLES_AMOUNT = 100;
      const PARTICLES = [];

      // 表示する画像分ループ
      for (let index = 0; index < PARTICLES_AMOUNT; index++) {
        // 画像の設定
        const IMAGE_PATH = this.getImagePath(PATHS);
        const PARTICLE = new PIXI.Sprite.fromImage(IMAGE_PATH);

        // 画像の位置をきめる
        PARTICLE.anchor.set(0.5);

        // 画像のサイズをランダムに設定
        const PARTICLE_SIZE = this.getRandomInt(SIZE.min, SIZE.max);
        PARTICLE.width = PARTICLE_SIZE;
        PARTICLE.height = PARTICLE_SIZE;

        // 画像のX座標、Y座標をランダムに配置
        PARTICLE.x = Math.random() * app.screen.width;
        PARTICLE.y = Math.random() * app.screen.height;

        // 落ちていくスピードをランダムに設定
        const PARTICLE_SPEED = this.getRandomInt(SPEED.min, SPEED.max);
        PARTICLE.speed = (PARTICLE_SPEED + Math.random() * 0.5) * 0.5;

        PARTICLES.push(PARTICLE);
        app.stage.addChild(PARTICLE);

        const list = new Ease.list();
        const POSITION_X = PARTICLE.x - 50 - this.getRandomInt(-30, 30);
        const DURATION = this.getRandomInt(3000, 5000);
        list.to(PARTICLE, { x: POSITION_X }, DURATION, {
          ease: 'easeInOutSine',
          repeat: true,
          reverse: true
        });
      }

      app.ticker.add(() => {
        for (let index = 0; index < PARTICLES.length; index++) {
          //配列からデータ取得
          const PARTICLE = PARTICLES[index];

          //縦の位置
          PARTICLE.y += (PARTICLE.height / 5000) * PARTICLE.speed;

          //画面の一番下に行った時縦の位置をリセット、横の位置をランダムに配置
          if (PARTICLE.y > this.contentHeight + PARTICLE.height) {
            PARTICLE.y = -PARTICLE.height;
            PARTICLE.x = Math.random() * app.screen.width;
          }
        }
      });
    });
  }

  /**
   * 画像のパスを返す
   * @param {Object} PATHS
   */
  getImagePath(PATHS) {
    const MAX = PATHS.length;
    const INDEX = Math.floor(Math.random() * MAX);
    return PATHS[INDEX];
  }

  /**
   * ランダムな整数を返す
   * @param {number} min
   * @param {number} max
   */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }
}
