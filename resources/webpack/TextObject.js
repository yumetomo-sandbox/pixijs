import $ from 'jquery';
import * as pixi from 'pixi.js';
import events from 'events';

export class TextObject extends events {

  constructor() {
    super();

    this.textAnimating;

    $('.text-btn').on('click', () => {
      this.createTextObject();
    });

  }

  createTextObject() {
    // テキストオブジェクト作成
    let text = 'Hello World !';
    let style = {fontFamily: 'Meiryo', fontWeight: 'bold', fontSize: '30px', fill: 'white', dropShadow: true, dropShadowAlpha: 1, dropShadowColor: 'black'};
    this.textObject = new pixi.Text(text, style);
    this.setTextObjectPosition();
  }

  setTextObjectPosition() {
    this.textObject.position.x = 200;
    this.textObject.position.y = 150;
    this.emit('setedTextObjectPosition');
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
    this.addTextOnContainer();
  }

  addTextOnContainer() {
    // テキストオブジェクトをステージに乗せる
    this.container.addChild(this.textObject);

    if(this.textAnimating) {
      cancelAnimationFrame(this.textAnimating);
    } else {
      this.textAnimating = requestAnimationFrame(this.renderText.bind(this));
    }
  }

  renderText() {
    requestAnimationFrame(this.renderText.bind(this));
    this.textObject.position.x += 1;
    if(this.textObject.position.x >= 600) {
      this.textObject.position.x = -100;
    }
    this.renderer.render(this.container);
  }

}
