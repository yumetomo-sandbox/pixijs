import SnowParticle from "./modules/SnowParticle";

class Snow {
  constructor() {
    const $WRAPPER = document.getElementById("pixi-snow-particle");

    const PATHS = [
      "./../../webroot/images/snow.png",
      "./../../webroot/images/snow2.png",
      "./../../webroot/images/snow3.png"
    ];

    const MIN_SIZE = parseInt($WRAPPER.dataset.minSize, 10);
    const MAX_SIZE = parseInt($WRAPPER.dataset.maxSize, 10);
    const SIZE = { min: MIN_SIZE, max: MAX_SIZE };

    const MIN_SPEED = parseInt($WRAPPER.dataset.minSpeed, 10);
    const MAX_SPEED = parseInt($WRAPPER.dataset.maxSpeed, 10);
    const SPEED = { min: MIN_SPEED, max: MAX_SPEED };

    new SnowParticle($WRAPPER, PATHS, SIZE, SPEED);
  }
}

new Snow();
