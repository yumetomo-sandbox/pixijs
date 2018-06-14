import $ from 'jquery';
import * as pixi from 'pixi.js';
import {TextObject} from './TextObject';
import {ImageObject} from './ImageObject';
import {MultipleObject} from './MultipleObject';

class Index {

  constructor() {
    this.TextObject = new TextObject();
    this.ImageObject = new ImageObject();
    this.MultipleObject = new MultipleObject();
    this.bind();

    this.createPixiContainer();
  }

  bind() {
    this.TextObject
      .on('setedTextObjectPosition', () => {
        this.TextObject.setContainerAndRenderer(this.container, this.renderer);
      });

    this.ImageObject
      .on('setedImageObjectPosition', () => {
        this.ImageObject.setContainerAndRenderer(this.container, this.renderer);
      });

    this.MultipleObject
      .on('setedMultipleObjectPosition', () => {
        this.MultipleObject.setContainerAndRenderer(this.container, this.renderer);
      });
  }

  createPixiContainer() {
    this.container = new pixi.Container();
    this.setPixiRendererSize();
  }

  setPixiRendererSize() {
    let width = 600;
    let height = 400;
    this.createPixiRenderer(width, height)
  }

  createPixiRenderer(width, height) {
    this.renderer = new pixi.autoDetectRenderer(width, height, {backgroundColor: 0xcccccc});
    this.addPixiRendererToDOM();
  }

  addPixiRendererToDOM() {
    $('#pixi').append(this.renderer.view);
  }

}

new Index();
