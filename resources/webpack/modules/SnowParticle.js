import * as PIXI from "pixi.js";

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
      let positions = [];
      let turned = [];

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
        positions.push(PARTICLE.x);
        turned.push("left");
        app.stage.addChild(PARTICLE);
      }

      app.ticker.add(() => {
        for (let index = 0; index < PARTICLES.length; index++) {
          //配列からデータ取得
          const PARTICLE = PARTICLES[index];
          const POSITION = positions[index];
          const TURNED = turned[index];

          //横の位置
          const SWING =
            TURNED === "left" ? Math.random() * 50 : Math.random() * -50;
          PARTICLE.x += SWING * (PARTICLE.width / 5000);

          if (PARTICLE.x >= POSITION + 50) turned[index] = "right";
          if (PARTICLE.x <= POSITION - 50) turned[index] = "left";

          //縦の位置
          PARTICLE.y += (PARTICLE.height / 5000) * PARTICLE.speed;

          //画面の一番下に行った時縦の位置をリセット、横の位置をランダムに配置
          if (PARTICLE.y > this.contentHeight + PARTICLE.height) {
            PARTICLE.y = -PARTICLE.height;
            PARTICLE.x = Math.random() * app.screen.width;
            positions[index] = PARTICLE.x;
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
