!function(e){function t(t){for(var i,a,c=t[0],s=t[1],u=t[2],f=0,h=[];f<c.length;f++)a=c[f],r[a]&&h.push(r[a][0]),r[a]=0;for(i in s)Object.prototype.hasOwnProperty.call(s,i)&&(e[i]=s[i]);for(l&&l(t);h.length;)h.shift()();return o.push.apply(o,u||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],i=!0,c=1;c<n.length;c++){var s=n[c];0!==r[s]&&(i=!1)}i&&(o.splice(t--,1),e=a(a.s=n[0]))}return e}var i={},r={1:0},o=[];function a(t){if(i[t])return i[t].exports;var n=i[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=i,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(n,i,function(t){return e[t]}.bind(null,i));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var c=window.webpackJsonp=window.webpackJsonp||[],s=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var l=s;o.push([220,0]),n()}({220:function(e,t,n){"use strict";n.r(t);var i=n(11),r=n.n(i),o=n(5),a=n(16),c=n.n(a),s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();var u=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.textAnimating,r()(".text-btn").on("click",function(){e.createTextObject()}),e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,c.a),s(t,[{key:"createTextObject",value:function(){this.textObject=new o.Text("Hello World !",{fontFamily:"Meiryo",fontWeight:"bold",fontSize:"30px",fill:"white",dropShadow:!0,dropShadowAlpha:1,dropShadowColor:"black"}),this.setTextObjectPosition()}},{key:"setTextObjectPosition",value:function(){this.textObject.position.x=200,this.textObject.position.y=150,this.emit("setedTextObjectPosition")}},{key:"setContainerAndRenderer",value:function(e,t){this.container=e,this.renderer=t,this.removeObjectOnContainer()}},{key:"removeObjectOnContainer",value:function(){for(var e=this.container.children.length-1;e>=0;e--)this.container.removeChild(this.container.children[e]);this.addTextOnContainer()}},{key:"addTextOnContainer",value:function(){this.container.addChild(this.textObject),this.textAnimating?cancelAnimationFrame(this.textAnimating):this.textAnimating=requestAnimationFrame(this.renderText.bind(this))}},{key:"renderText",value:function(){requestAnimationFrame(this.renderText.bind(this)),this.textObject.position.x+=1,this.textObject.position.x>=600&&(this.textObject.position.x=-100),this.renderer.render(this.container)}}]),t}(),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();var f=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.imageAnimating,r()(".image-btn").on("click",function(){e.createImageObject()}),e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,c.a),l(t,[{key:"createImageObject",value:function(){var e=o.Texture.fromImage("./../../webroot/images/enjin.png");this.imageObject=new o.Sprite(e),this.setImageObjectProperty()}},{key:"setImageObjectProperty",value:function(){this.imageObject.position.x=300,this.imageObject.position.y=200,this.imageObject.anchor.x=.5,this.imageObject.anchor.y=.5,this.emit("setedImageObjectPosition")}},{key:"setContainerAndRenderer",value:function(e,t){this.container=e,this.renderer=t,this.removeObjectOnContainer()}},{key:"removeObjectOnContainer",value:function(){for(var e=this.container.children.length-1;e>=0;e--)this.container.removeChild(this.container.children[e]);this.addImageOnContainer()}},{key:"addImageOnContainer",value:function(){this.container.addChild(this.imageObject),this.imageAnimating?cancelAnimationFrame(this.imageAnimating):this.imageAnimating=requestAnimationFrame(this.renderImage.bind(this))}},{key:"renderImage",value:function(){requestAnimationFrame(this.renderImage.bind(this)),this.imageObject.rotation+=.05,this.renderer.render(this.container)}}]),t}(),h=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();var b=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.imageAnimating,r()(".multiple-image-btn").on("click",function(){e.createImageObject()}),e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,c.a),h(t,[{key:"createImageObject",value:function(){var e=o.Texture.fromImage("./../../webroot/images/enjin.png");this.imageObject=new o.Sprite(e),this.setImageObjectProperty()}},{key:"setImageObjectProperty",value:function(){this.imageObject.position.x=300,this.imageObject.position.y=200,this.imageObject.anchor.x=.5,this.imageObject.anchor.y=.5,this.emit("setedMultipleObjectPosition")}},{key:"setContainerAndRenderer",value:function(e,t){this.container=e,this.renderer=t,this.removeObjectOnContainer()}},{key:"removeObjectOnContainer",value:function(){for(var e=this.container.children.length-1;e>=0;e--)this.container.removeChild(this.container.children[e]);this.addImageOnContainer()}},{key:"addImageOnContainer",value:function(){this.container.addChild(this.imageObject),this.imageAnimating?cancelAnimationFrame(this.imageAnimating):this.imageAnimating=requestAnimationFrame(this.renderImage.bind(this))}},{key:"renderImage",value:function(){requestAnimationFrame(this.renderImage.bind(this)),this.imageObject.rotation+=.05,this.renderer.render(this.container)}}]),t}(),d=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.TextObject=new u,this.ImageObject=new f,this.MultipleObject=new b,this.bind(),this.createPixiContainer()}return d(e,[{key:"bind",value:function(){var e=this;this.TextObject.on("setedTextObjectPosition",function(){e.TextObject.setContainerAndRenderer(e.container,e.renderer)}),this.ImageObject.on("setedImageObjectPosition",function(){e.ImageObject.setContainerAndRenderer(e.container,e.renderer)}),this.MultipleObject.on("setedMultipleObjectPosition",function(){e.MultipleObject.setContainerAndRenderer(e.container,e.renderer)})}},{key:"createPixiContainer",value:function(){this.container=new o.Container,this.setPixiRendererSize()}},{key:"setPixiRendererSize",value:function(){this.createPixiRenderer(600,400)}},{key:"createPixiRenderer",value:function(e,t){this.renderer=new o.autoDetectRenderer(e,t,{backgroundColor:13421772}),this.addPixiRendererToDOM()}},{key:"addPixiRendererToDOM",value:function(){r()("#pixi").append(this.renderer.view)}}]),e}())}});