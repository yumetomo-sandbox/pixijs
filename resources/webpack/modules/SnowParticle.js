import * as PIXI from 'pixi.js';
import Ease from 'pixi-ease';

export default class SnowParticle {
  constructor($WRAPPER, IMAGES, QUANTITY, SIZE, SPEED, SWING, SWING_DURATION) {
    // 雪を降らせる領域の高さ・幅を取得
    this.contentWidth = $WRAPPER.offsetWidth;
    this.contentHeight = $WRAPPER.offsetHeight;

    // 画像をロード
    PIXI.loader.add(IMAGES).load(() => {
      // 親要素と同じサイズでCanvasを生成
      let app = new PIXI.Application(this.contentWidth, this.contentHeight, {
        backgroundColor: 0x1099bb
      });
      $WRAPPER.appendChild(app.view);

      const PARTICLES = [];

      // 表示する雪の数分ループ
      for (let index = 0; index < QUANTITY; index++) {
        // 使用する画像の設定
        const IMAGE_PATH = this.getImagePath(IMAGES);
        const PARTICLE = new PIXI.Sprite.fromImage(IMAGE_PATH);

        // 原点を中心に設定
        PARTICLE.anchor.set(0.5);

        // サイズをランダムに設定
        const PARTICLE_SIZE = this.getRandomInt(SIZE.min, SIZE.max);
        PARTICLE.width = PARTICLE_SIZE;
        PARTICLE.height = PARTICLE_SIZE;

        // 雪のX座標、Y座標をランダムに配置
        PARTICLE.x = Math.random() * app.screen.width;
        PARTICLE.y = Math.random() * app.screen.height;

        // 落ちていくスピードをランダムに設定
        const PARTICLE_SPEED = this.getRandomInt(SPEED.min, SPEED.max);
        PARTICLE.speed = (PARTICLE_SPEED + Math.random() * 0.5) * 0.5;

        const EASE_LIST = new Ease.list();

        // 揺れ幅を設定
        const POSITION_X = PARTICLE.x - this.getRandomInt(SWING.min, SWING.max);

        // 揺れの速度を設定
        const DURATION = this.getRandomInt(
          SWING_DURATION.min,
          SWING_DURATION.max
        );

        EASE_LIST.to(PARTICLE, { x: POSITION_X }, DURATION, {
          ease: 'easeInOutSine',
          repeat: true,
          reverse: true
        });

        PARTICLES.push(PARTICLE);
        app.stage.addChild(PARTICLE);
      }

      app.ticker.add(() => {
        for (let index = 0; index < PARTICLES.length; index++) {
          //配列からデータ取得
          const PARTICLE = PARTICLES[index];

          //縦の位置を更新
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
   * @param {Object} IMAGES
   */
  getImagePath(IMAGES) {
    const MAX = IMAGES.length;
    const INDEX = Math.floor(Math.random() * MAX);
    return IMAGES[INDEX];
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
