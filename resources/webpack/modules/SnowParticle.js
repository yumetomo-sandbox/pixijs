import * as PIXI from 'pixi.js';
import Ease from 'pixi-ease';

export default class SnowParticle {
  constructor($WRAPPER, IMAGES, QUANTITY, SIZE, SPEED, SWING, SWING_DURATION) {
    // 雪を降らせる領域の高さ・幅を取得
    const CONTENT_WIDTH = $WRAPPER.offsetWidth;
    const CONTENT_HEIGHT = $WRAPPER.offsetHeight;

    // 画像をロード
    PIXI.loader.add(IMAGES).load(() => {
      // 親要素と同じサイズでCanvasを生成
      const APP = new PIXI.Application(CONTENT_WIDTH, CONTENT_HEIGHT, {
        backgroundColor: 0x1099bb
      });
      $WRAPPER.appendChild(APP.view);

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
        PARTICLE.x = Math.random() * APP.screen.width;
        PARTICLE.y = Math.random() * APP.screen.height;

        // 揺れ幅を設定
        const SWING_WIDTH =
          PARTICLE.x - this.getRandomInt(SWING.min, SWING.max);

        // 揺れの速度を設定
        const DURATION = this.getRandomInt(
          SWING_DURATION.min,
          SWING_DURATION.max
        );

        const EASE_LIST = new Ease.list();
        EASE_LIST.to(PARTICLE, { x: SWING_WIDTH }, DURATION, {
          ease: 'easeInOutSine',
          repeat: true,
          reverse: true
        });

        // 落ちていくスピードをランダムに設定
        const PARTICLE_SPEED = this.getRandomInt(SPEED.min, SPEED.max);
        PARTICLE.speed = (PARTICLE_SPEED + Math.random() * 0.5) * 0.5;

        PARTICLES.push(PARTICLE);
        APP.stage.addChild(PARTICLE);
      }

      APP.ticker.add(() => {
        for (let index = 0; index < PARTICLES.length; index++) {
          // 配列からデータ取得
          const PARTICLE = PARTICLES[index];

          // 縦の位置を更新
          PARTICLE.y += (PARTICLE.height / 5000) * PARTICLE.speed;

          // 雪を回転
          PARTICLE.rotation += 0.01;

          // 画面の一番下に行った時縦の位置をリセット、横の位置をランダムに配置
          if (PARTICLE.y > CONTENT_HEIGHT + PARTICLE.height) {
            PARTICLE.y = -PARTICLE.height;
            PARTICLE.x = Math.random() * APP.screen.width;
          }
        }
      });
    });
  }

  /**
   * 画像のパスを返す
   * @param {Object} IMAGES
   * @returns {string} 画像のパス
   */
  getImagePath(IMAGES) {
    const MAX = IMAGES.length;
    const INDEX = Math.floor(Math.random() * MAX);
    return IMAGES[INDEX];
  }

  /**
   * ランダムな整数を返す
   * @param {number} MIN
   * @param {number} MAX
   * @returns {number} ランダムな整数
   */
  getRandomInt(MIN, MAX) {
    return Math.floor(Math.random() * (MAX + 1 - MIN)) + MIN;
  }
}
