import $ from 'jquery';
import * as pixi from 'pixi.js';
import {Text} from './Text';

class Index {

  constructor() {

    this.Text = new Text();
    this.bind();

    // ステージ作成
    this.stage = new pixi.Container();

    // レンダラーのサイズ
    let width = 600;
    let height = 400;

    // レンダラー作成
    this.renderer = new pixi.autoDetectRenderer(width, height, {backgroundColor: 0xcccccc});

    // レンダラーのviewをDOMへ追加
    $('#pixi').append(this.renderer.view);

  }

  bind() {
    this.Text
      .on('makedTextObject', () => {
        this.Text.textOnStage(this.stage, this.renderer);
      });
  }

}

new Index();
