import $ from 'jquery';
import * as pixi from 'pixi.js';
import events from 'events';

export class Text extends events {

  constructor() {
    super();

    $('.text-btn').on('click', () => {
      // テキストオブジェクト作成
      let text = 'Hello World !';
      let style = {fontFamily: 'Meiryo', fontWeight: 'bold', fontSize: '30px', fill: 'white', dropShadow: true, dropShadowAlpha: 1, dropShadowColor: 'black'};
      this.textObject = new pixi.Text(text, style);

      this.textObject.position.x = 200;
      this.textObject.position.y = 150;

      this.emit('makedTextObject');
    });

  }

  textOnStage(stage, renderer) {
    this.stage = stage;
    this.renderer = renderer;

    for(let i = this.stage.children.length - 1; i >= 0; i--) {
      this.stage.removeChild(this.stage.children[i]);
    }

    // テキストオブジェクトをステージに乗せる
    this.stage.addChild(this.textObject);
    requestAnimationFrame(this.renderText.bind(this));
  }

  renderText() {
    requestAnimationFrame(this.renderText.bind(this));
    this.textObject.position.x += 1;
    if(this.textObject.position.x >= 600) {
      this.textObject.position.x = -100;
    }
    this.renderer.render(this.stage);
  }

}

new Text();
