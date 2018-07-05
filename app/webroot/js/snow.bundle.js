webpackJsonp([1],{

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pixi = __webpack_require__(11);

var PIXI = _interopRequireWildcard(_pixi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SnowParticle = function () {
  function SnowParticle($WRAPPER, PATHS, SIZE, SPEED) {
    var _this = this;

    _classCallCheck(this, SnowParticle);

    this.contentWidth = $WRAPPER.offsetWidth;
    this.contentHeight = $WRAPPER.offsetHeight;

    PIXI.loader.add(PATHS).load(function () {
      var app = new PIXI.Application(_this.contentWidth, _this.contentHeight, {
        backgroundColor: 0x1099bb
      });
      $WRAPPER.appendChild(app.view);

      // 表示する画像の数
      var PARTICLES_AMOUNT = 100;
      var PARTICLES = [];
      var positions = [];
      var turned = [];

      // 表示する画像分ループ
      for (var index = 0; index < PARTICLES_AMOUNT; index++) {
        // 画像の設定
        var IMAGE_PATH = _this.getImagePath(PATHS);
        var PARTICLE = new PIXI.Sprite.fromImage(IMAGE_PATH);

        // 画像の位置をきめる
        PARTICLE.anchor.set(0.5);

        // 画像のサイズをランダムに設定
        var PARTICLE_SIZE = _this.getRandomInt(SIZE.min, SIZE.max);
        PARTICLE.width = PARTICLE_SIZE;
        PARTICLE.height = PARTICLE_SIZE;

        // 画像のX座標、Y座標をランダムに配置
        PARTICLE.x = Math.random() * app.screen.width;
        PARTICLE.y = Math.random() * app.screen.height;

        // 落ちていくスピードをランダムに設定
        var PARTICLE_SPEED = _this.getRandomInt(SPEED.min, SPEED.max);
        PARTICLE.speed = (PARTICLE_SPEED + Math.random() * 0.5) * 0.5;

        PARTICLES.push(PARTICLE);
        positions.push(PARTICLE.x);
        turned.push("left");
        app.stage.addChild(PARTICLE);
      }

      app.ticker.add(function () {
        for (var _index = 0; _index < PARTICLES.length; _index++) {
          //配列からデータ取得
          var _PARTICLE = PARTICLES[_index];
          var POSITION = positions[_index];
          var TURNED = turned[_index];

          //横の位置
          var SWING = TURNED === "left" ? Math.random() * 50 : Math.random() * -50;
          _PARTICLE.x += SWING * (_PARTICLE.width / 5000);

          if (_PARTICLE.x >= POSITION + 50) turned[_index] = "right";
          if (_PARTICLE.x <= POSITION - 50) turned[_index] = "left";

          //縦の位置
          _PARTICLE.y += _PARTICLE.height / 5000 * _PARTICLE.speed;

          //画面の一番下に行った時縦の位置をリセット、横の位置をランダムに配置
          if (_PARTICLE.y > _this.contentHeight + _PARTICLE.height) {
            _PARTICLE.y = -_PARTICLE.height;
            _PARTICLE.x = Math.random() * app.screen.width;
            positions[_index] = _PARTICLE.x;
          }
        }
      });
    });
  }

  /**
   * 画像のパスを返す
   * @param {Object} PATHS
   */


  _createClass(SnowParticle, [{
    key: "getImagePath",
    value: function getImagePath(PATHS) {
      var MAX = PATHS.length;
      var INDEX = Math.floor(Math.random() * MAX);
      return PATHS[INDEX];
    }

    /**
     * ランダムな整数を返す
     * @param {number} min
     * @param {number} max
     */

  }, {
    key: "getRandomInt",
    value: function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    }
  }]);

  return SnowParticle;
}();

exports.default = SnowParticle;

/***/ }),

/***/ 98:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _SnowParticle = __webpack_require__(94);

var _SnowParticle2 = _interopRequireDefault(_SnowParticle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Snow = function Snow() {
  _classCallCheck(this, Snow);

  var $WRAPPER = document.getElementById("pixi-snow-particle");

  var PATHS = ["./../../webroot/images/snow.png", "./../../webroot/images/snow2.png", "./../../webroot/images/snow3.png"];

  var MIN_SIZE = parseInt($WRAPPER.dataset.minSize, 10);
  var MAX_SIZE = parseInt($WRAPPER.dataset.maxSize, 10);
  var SIZE = { min: MIN_SIZE, max: MAX_SIZE };

  var MIN_SPEED = parseInt($WRAPPER.dataset.minSpeed, 10);
  var MAX_SPEED = parseInt($WRAPPER.dataset.maxSpeed, 10);
  var SPEED = { min: MIN_SPEED, max: MAX_SPEED };

  new _SnowParticle2.default($WRAPPER, PATHS, SIZE, SPEED);
};

new Snow();

/***/ })

},[98]);