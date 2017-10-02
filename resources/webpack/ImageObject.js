import $ from 'jquery';
import * as pixi from 'pixi.js';
import events from 'events';

export class ImageObject extends events {

  constructor() {
    super();

    this.imageAnimating;

    $('.image-btn').on('click', () => {
      this.createImageObject();
    });

  }

  createImageObject() {
    // テキストオブジェクト作成
    let texture = pixi.Texture.fromImage('/images/enjin.png');
    this.imageObject = new pixi.Sprite(texture);
    this.setImageObjectProperty();
  }

  setImageObjectProperty() {
    this.imageObject.position.x = 300;
    this.imageObject.position.y = 200;
    this.imageObject.anchor.x = 0.5;
    this.imageObject.anchor.y = 0.5;
    this.emit('setedImageObjectPosition');
  }

  setContainerAndRenderer(container, renderer) {
    this.container = container;
    this.renderer = renderer;
    this.removeObjectOnContainer();
  }

  removeObjectOnContainer() {
    // コンテナー上のオブジェクトを削除
    for(let i = this.container.children.length - 1; i >= 0; i--) {
      this.container.removeChild(this.container.children[i]);
    }
    this.addImageOnContainer();
  }

  addImageOnContainer() {
    // テキストオブジェクトをステージに乗せる
    this.container.addChild(this.imageObject);

    if(this.imageAnimating) {
      cancelAnimationFrame(this.imageAnimating);
    } else {
      this.imageAnimating = requestAnimationFrame(this.renderImage.bind(this));
    }
  }

  renderImage() {
    requestAnimationFrame(this.renderImage.bind(this));
    this.imageObject.rotation += 0.05;
    this.renderer.render(this.container);
  }

}

new ImageObject();
