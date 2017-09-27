import $ from 'jquery';
import * as pixi from 'pixi.js';

class Index {

  constructor() {
    // ステージ作成
    this.stage = new pixi.Container();

    // レンダラーのサイズ
    let width = 600;
    let height = 400;

    // レンダラー作成
    this.renderer = new pixi.autoDetectRenderer(width, height, {backgroundColor: 0xcccccc});

    // レンダラーのviewをDOMへ追加
    $('#pixi').append(this.renderer.view);

    // テキストオブジェクト作成
    let text = 'Hello World !';
    let style = {fontFamily: 'Meiryo', fontWeight: 'bold', fontSize: '30px', fill: 'white', dropShadow: true, dropShadowAlpha: 1, dropShadowColor: 'black'};
    this.textObject = new pixi.Text(text, style);

    this.textObject.position.x = width / 2;
    this.textObject.position.y = height / 2;

    // テキストオブジェクトをステージに乗せる
    this.stage.addChild(this.textObject);

    requestAnimationFrame(this.animateText.bind(this));
  }

  animateText() {
    requestAnimationFrame(this.animateText.bind(this));
    this.textObject.rotation += 0.01;
    this.renderer.render(this.stage);
  }

}

new Index();
