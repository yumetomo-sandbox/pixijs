import SnowParticle from './modules/SnowParticle';

class Snow {
  constructor() {
    // 雪を降らせる要素
    const $WRAPPER = document.getElementById('pixi-snow-particle');

    // 雪の画像
    const $IMAGE_ELEMENTS = $WRAPPER.querySelectorAll('img');
    const IMAGES = [];
    for (let index = 0; index < $IMAGE_ELEMENTS.length; index++) {
      const IMAGE_PATH = $IMAGE_ELEMENTS[index].getAttribute('src');
      IMAGES.push(IMAGE_PATH);
    }

    // 降らせる雪の数
    const QUANTITY = parseInt($WRAPPER.dataset.quantity, 10);

    // 雪のサイズ
    const MIN_SIZE = parseInt($WRAPPER.dataset.minSize, 10);
    const MAX_SIZE = parseInt($WRAPPER.dataset.maxSize, 10);
    const SIZE = { min: MIN_SIZE, max: MAX_SIZE };

    // 雪が落ちる速度
    const MIN_SPEED = parseInt($WRAPPER.dataset.minSpeed, 10);
    const MAX_SPEED = parseInt($WRAPPER.dataset.maxSpeed, 10);
    const SPEED = { min: MIN_SPEED, max: MAX_SPEED };

    // 雪の揺れ幅
    const MIN_SWING = parseInt($WRAPPER.dataset.minSwing, 10);
    const MAX_SWING = parseInt($WRAPPER.dataset.maxSwing, 10);
    const SWING = { min: MIN_SWING, max: MAX_SWING };

    // 雪の揺れる速度
    const MIN_SWING_DURATION = parseInt($WRAPPER.dataset.minSwingDuration, 10);
    const MAX_SWING_DURATION = parseInt($WRAPPER.dataset.maxSwingDuration, 10);
    const SWING_DURATION = { min: MIN_SWING_DURATION, max: MAX_SWING_DURATION };

    new SnowParticle(
      $WRAPPER,
      IMAGES,
      QUANTITY,
      SIZE,
      SPEED,
      SWING,
      SWING_DURATION
    );
  }
}

new Snow();
