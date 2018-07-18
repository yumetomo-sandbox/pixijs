webpackJsonp([1],{

/***/ 202:
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),

/***/ 203:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Easing = __webpack_require__(214);
var EventEmitter = __webpack_require__(213);

var wait = function (_EventEmitter) {
    _inherits(wait, _EventEmitter);

    /**
     * @param {object|object[]} object or list of objects to animate
     * @param {object} [options]
     * @param {number} [options.wait=0] n milliseconds before starting animation (can also be used to pause animation for a length of time)
     * @param {boolean} [options.pause] start the animation paused
     * @param {(boolean|number)} [options.repeat] true: repeat animation forever n: repeat animation n times
     * @param {(boolean|number)} [options.reverse] true: reverse animation (if combined with repeat, then pulse) n: reverse animation n times
     *
     * @param {number} [options.id] user-generated id (e.g., I use it to properly load animations when an object has multiple animations running)
     * @param {Function} [options.load] loads an animation using an .save() object note the * parameters below cannot be loaded and must be re-set
     * @param {Function|string} [options.ease] function (or penner function name) from easing.js (see http://easings.net for examples)*
     *
     * @emits {done} animation expires
     * @emits {wait} each update during a wait
     * @emits {first} first update when animation starts
     * @emits {each} each update while animation is running
     * @emits {loop} when animation is repeated
     * @emits {reverse} when animation is reversed
     */
    function wait(object, options) {
        _classCallCheck(this, wait);

        var _this = _possibleConstructorReturn(this, (wait.__proto__ || Object.getPrototypeOf(wait)).call(this));

        _this.object = object;
        _this.options = options || {};
        _this.type = 'Wait';
        if (_this.options.load) {
            _this.load(_this.options.load);
        } else {
            _this.time = 0;
        }
        if (_this.options.ease && typeof _this.options.ease !== 'function') {
            _this.options.easeName = _this.options.ease;
            _this.options.ease = Easing[_this.options.ease];
        }
        if (!_this.options.ease) {
            _this.options.ease = Easing['linear'];
        }
        return _this;
    }

    _createClass(wait, [{
        key: 'save',
        value: function save() {
            var save = { type: this.type, time: this.time, duration: this.duration, ease: this.options.easeName };
            var options = this.options;
            if (options.wait) {
                save.wait = options.wait;
            }
            if (typeof options.id !== 'undefined') {
                save.id = options.id;
            }
            if (options.pause) {
                save.pause = options.pause;
            }
            if (options.repeat) {
                save.repeat = options.repeat;
            }
            if (options.reverse) {
                save.reverse = options.reverse;
            }
            return save;
        }
    }, {
        key: 'load',
        value: function load(_load) {
            this.options.wait = _load.wait;
            this.options.pause = _load.pause;
            this.options.repeat = _load.repeat;
            this.options.reverse = _load.reverse;
            this.options.id = _load.id;
            this.options.ease = _load.ease;
            if (this.options.ease && typeof this.options.ease !== 'function') {
                this.options.easeName = this.options.ease;
                this.options.ease = Easing[this.options.ease];
            }
            if (!this.options.ease) {
                this.options.ease = Easing['linear'];
            }
            this.time = _load.time;
            this.duration = _load.duration;
        }

        /**
         * pause this entry
         * @type {boolean}
         */

    }, {
        key: 'end',
        value: function end(leftOver) {
            if (this.options.reverse) {
                this.reverse();
                this.time = leftOver;
                if (!this.options.repeat) {
                    if (this.options.reverse === true) {
                        this.options.reverse = false;
                    } else {
                        this.options.reverse--;
                    }
                } else {
                    if (this.options.repeat !== true) {
                        this.options.repeat--;
                    }
                }
                this.emit('loop', this.list || this.object);
            } else if (this.options.repeat) {
                this.time = leftOver;
                if (this.options.repeat !== true) {
                    this.options.repeat--;
                }
                this.emit('loop', this.list || this.object);
            } else {
                this.done();
                this.emit('done', this.list || this.object, leftOver);
                // this.list = this.object = null
                return true;
            }
        }
    }, {
        key: 'update',
        value: function update(elapsed) {
            var options = this.options;
            if (options.pause) {
                return;
            }
            if (options.wait) {
                options.wait -= elapsed;
                if (options.wait <= 0) {
                    elapsed = -options.wait;
                    options.wait = false;
                } else {
                    this.emit('wait', elapsed, this.list || this.object);
                    return;
                }
            }
            if (!this.first) {
                this.first = true;
                this.emit('first', this.list || this.object);
            }
            this.time += elapsed;
            var leftOver = 0;
            var duration = this.duration;
            var time = this.time;
            if (duration !== 0 && time > duration) {
                leftOver = time - duration;
                this.time = time = duration;
            }
            var force = this.calculate(elapsed);
            this.emit('each', elapsed, this.list || this.object, this);
            if (this.type === 'Wait' || duration !== 0 && time === duration) {
                return this.end(leftOver);
            }
            return force || time === duration;
        }

        // correct certain DOM values

    }, {
        key: '_correctDOM',
        value: function _correctDOM(key, value) {
            switch (key) {
                case 'opacity':
                    return isNaN(value) ? 1 : value;
            }
            return value;
        }
    }, {
        key: 'reverse',
        value: function reverse() {}
    }, {
        key: 'calculate',
        value: function calculate() {}
    }, {
        key: 'done',
        value: function done() {}
    }, {
        key: 'pause',
        set: function set(value) {
            this.options.pause = value;
        },
        get: function get() {
            return this.options.pause;
        }
    }]);

    return wait;
}(EventEmitter);

module.exports = wait;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93YWl0LmpzIl0sIm5hbWVzIjpbIkVhc2luZyIsInJlcXVpcmUiLCJFdmVudEVtaXR0ZXIiLCJ3YWl0Iiwib2JqZWN0Iiwib3B0aW9ucyIsInR5cGUiLCJsb2FkIiwidGltZSIsImVhc2UiLCJlYXNlTmFtZSIsInNhdmUiLCJkdXJhdGlvbiIsImlkIiwicGF1c2UiLCJyZXBlYXQiLCJyZXZlcnNlIiwibGVmdE92ZXIiLCJlbWl0IiwibGlzdCIsImRvbmUiLCJlbGFwc2VkIiwiZmlyc3QiLCJmb3JjZSIsImNhbGN1bGF0ZSIsImVuZCIsImtleSIsInZhbHVlIiwiaXNOYU4iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBTUEsU0FBU0MsUUFBUSxRQUFSLENBQWY7QUFDQSxJQUFNQyxlQUFlRCxRQUFRLGVBQVIsQ0FBckI7O0lBRU1FLEk7OztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLGtCQUFZQyxNQUFaLEVBQW9CQyxPQUFwQixFQUNBO0FBQUE7O0FBQUE7O0FBRUksY0FBS0QsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsY0FBS0MsT0FBTCxHQUFlQSxXQUFXLEVBQTFCO0FBQ0EsY0FBS0MsSUFBTCxHQUFZLE1BQVo7QUFDQSxZQUFJLE1BQUtELE9BQUwsQ0FBYUUsSUFBakIsRUFDQTtBQUNJLGtCQUFLQSxJQUFMLENBQVUsTUFBS0YsT0FBTCxDQUFhRSxJQUF2QjtBQUNILFNBSEQsTUFLQTtBQUNJLGtCQUFLQyxJQUFMLEdBQVksQ0FBWjtBQUNIO0FBQ0QsWUFBSSxNQUFLSCxPQUFMLENBQWFJLElBQWIsSUFBcUIsT0FBTyxNQUFLSixPQUFMLENBQWFJLElBQXBCLEtBQTZCLFVBQXRELEVBQ0E7QUFDSSxrQkFBS0osT0FBTCxDQUFhSyxRQUFiLEdBQXdCLE1BQUtMLE9BQUwsQ0FBYUksSUFBckM7QUFDQSxrQkFBS0osT0FBTCxDQUFhSSxJQUFiLEdBQW9CVCxPQUFPLE1BQUtLLE9BQUwsQ0FBYUks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V0FBVyxDQUFmO0FBQ0EsZ0JBQU1MLFdBQVcsS0FBS0EsUUFBdEI7QUFDQSxnQkFBSUosT0FBTyxLQUFLQSxJQUFoQjtBQUNBLGdCQUFJSSxhQUFhLENBQWIsSUFBa0JKLE9BQU9JLFFBQTdCLEVBQ0E7QUFDSUssMkJBQVdULE9BQU9JLFFBQWxCO0FBQ0EscUJBQUtKLElBQUwsR0FBWUEsT0FBT0ksUUFBbkI7QUFDSDtBQUNELGdCQUFNVyxRQUFRLEtBQUtDLFNBQUwsQ0FBZUgsT0FBZixDQUFkO0FBQ0EsaUJBQUtILElBQUwsQ0FBVSxNQUFWLEVBQWtCRyxPQUFsQixFQUEyQixLQUFLRixJQUFMLElBQWEsS0FBS2YsTUFBN0MsRUFBcUQsSUFBckQ7QUFDQSxnQkFBSSxLQUFLRSxJQUFMLEtBQWMsTUFBZCxJQUF5Qk0sYUFBYSxDQUFiLElBQWtCSixTQUFTSSxRQUF4RCxFQUNBO0FBQ0ksdUJBQU8sS0FBS2EsR0FBTCxDQUFTUixRQUFULENBQVA7QUFDSDtBQUNELG1CQUFPTSxTQUFTZixTQUFTSSxRQUF6QjtBQUNIOztBQUVEOzs7O29DQUNZYyxHLEVBQUtDLEssRUFDakI7QUFDSSxvQkFBUUQsR0FBUjtBQUVJLHFCQUFLLFNBQUw7QUFDSSwyQkFBUUUsTUFBTUQsS0FBTixDQUFELEdBQWlCLENBQWpCLEdBQXFCQSxLQUE1QjtBQUhSO0FBS0EsbUJBQU9BLEtBQVA7QUFDSDs7O2tDQUVTLENBQUU7OztvQ0FDQSxDQUFHOzs7K0JBQ1IsQ0FBRzs7OzBCQTlHQUEsSyxFQUNWO0FBQ0ksaUJBQUt0QixPQUFMLENBQWFTLEtBQWIsR0FBcUJhLEtBQXJCO0FBQ0gsUzs0QkFFRDtBQUNJLG1CQUFPLEtBQUt0QixPQUFMLENBQWFTLEtBQXBCO0FBQ0g7Ozs7RUF6R2NaLFk7O0FBbU5uQjJCLE9BQU9DLE9BQVAsR0FBaUIzQixJQUFqQiIsImZpbGUiOiJ3YWl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRWFzaW5nID0gcmVxdWlyZSgncGVubmVyJylcclxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRlbWl0dGVyMycpXHJcblxyXG5jbGFzcyB3YWl0IGV4dGVuZHMgRXZlbnRFbWl0dGVyXHJcbntcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R8b2JqZWN0W119IG9iamVjdCBvciBsaXN0IG9mIG9iamVjdHMgdG8gYW5pbWF0ZVxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLndhaXQ9MF0gbiBtaWxsaXNlY29uZHMgYmVmb3JlIHN0YXJ0aW5nIGFuaW1hdGlvbiAoY2FuIGFsc28gYmUgdXNlZCB0byBwYXVzZSBhbmltYXRpb24gZm9yIGEgbGVuZ3RoIG9mIHRpbWUpXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnBhdXNlXSBzdGFydCB0aGUgYW5pbWF0aW9uIHBhdXNlZFxyXG4gICAgICogQHBhcmFtIHsoYm9vbGVhbnxudW1iZXIpfSBbb3B0aW9ucy5yZXBlYXRdIHRydWU6IHJlcGVhdCBhbmltYXRpb24gZm9yZXZlciBuOiByZXBlYXQgYW5pbWF0aW9uIG4gdGltZXNcclxuICAgICAqIEBwYXJhbSB7KGJvb2xlYW58bnVtYmVyKX0gW29wdGlvbnMucmV2ZXJzZV0gdHJ1ZTogcmV2ZXJzZSBhbmltYXRpb24gKGlmIGNvbWJpbmVkIHdpdGggcmVwZWF0LCB0aGVuIHB1bHNlKSBuOiByZXZlcnNlIGFuaW1hdGlvbiBuIHRpbWVzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmlkXSB1c2VyLWdlbmVyYXRlZCBpZCAoZS5nLiwgSSB1c2UgaXQgdG8gcHJvcGVybHkgbG9hZCBhbmltYXRpb25zIHdoZW4gYW4gb2JqZWN0IGhhcyBtdWx0aXBsZSBhbmltYXRpb25zIHJ1bm5pbmcpXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5sb2FkXSBsb2FkcyBhbiBhbmltYXRpb24gdXNpbmcgYW4gLnNhdmUoKSBvYmplY3Qgbm90ZSB0aGUgKiBwYXJhbWV0ZXJzIGJlbG93IGNhbm5vdCBiZSBsb2FkZWQgYW5kIG11c3QgYmUgcmUtc2V0XHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gW29wdGlvbnMuZWFzZV0gZnVuY3Rpb24gKG9yIHBlbm5lciBmdW5jdGlvbiBuYW1lKSBmcm9tIGVhc2luZy5qcyAoc2VlIGh0dHA6Ly9lYXNpbmdzLm5ldCBmb3IgZXhhbXBsZXMpKlxyXG4gICAgICpcclxuICAgICAqIEBlbWl0cyB7ZG9uZX0gYW5pbWF0aW9uIGV4cGlyZXNcclxuICAgICAqIEBlbWl0cyB7d2FpdH0gZWFjaCB1cGRhdGUgZHVyaW5nIGEgd2FpdFxyXG4gICAgICogQGVtaXRzIHtmaXJzdH0gZmlyc3QgdXBkYXRlIHdoZW4gYW5pbWF0aW9uIHN0YXJ0c1xyXG4gICAgICogQGVtaXRzIHtlYWNofSBlYWNoIHVwZGF0ZSB3aGlsZSBhbmltYXRpb24gaXMgcnVubmluZ1xyXG4gICAgICogQGVtaXRzIHtsb29wfSB3aGVuIGFuaW1hdGlvbiBpcyByZXBlYXRlZFxyXG4gICAgICogQGVtaXRzIHtyZXZlcnNlfSB3aGVuIGFuaW1hdGlvbiBpcyByZXZlcnNlZFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvYmplY3QsIG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fVxyXG4gICAgICAgIHRoaXMudHlwZSA9ICdXYWl0J1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubG9hZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZCh0aGlzLm9wdGlvbnMubG9hZClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVhc2UgJiYgdHlwZW9mIHRoaXMub3B0aW9ucy5lYXNlICE9PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVhc2VOYW1lID0gdGhpcy5vcHRpb25zLmVhc2VcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVhc2UgPSBFYXNpbmdbdGhpcy5vcHRpb25zLmVhc2VdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmVhc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWFzZSA9IEVhc2luZ1snbGluZWFyJ11cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZSgpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3Qgc2F2ZSA9IHsgdHlwZTogdGhpcy50eXBlLCB0aW1lOiB0aGlzLnRpbWUsIGR1cmF0aW9uOiB0aGlzLmR1cmF0aW9uLCBlYXNlOiB0aGlzLm9wdGlvbnMuZWFzZU5hbWUgfVxyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNcclxuICAgICAgICBpZiAob3B0aW9ucy53YWl0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2F2ZS53YWl0ID0gb3B0aW9ucy53YWl0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5pZCAhPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzYXZlLmlkID0gb3B0aW9ucy5pZFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5wYXVzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNhdmUucGF1c2UgPSBvcHRpb25zLnBhdXNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLnJlcGVhdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNhdmUucmVwZWF0ID0gb3B0aW9ucy5yZXBlYXRcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMucmV2ZXJzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNhdmUucmV2ZXJzZSA9IG9wdGlvbnMucmV2ZXJzZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2F2ZVxyXG4gICAgfVxyXG5cclxuICAgIGxvYWQobG9hZClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMud2FpdCA9IGxvYWQud2FpdFxyXG4gICAgICAgIHRoaXMub3B0aW9ucy5wYXVzZSA9IGxvYWQucGF1c2VcclxuICAgICAgICB0aGlzLm9wdGlvbnMucmVwZWF0ID0gbG9hZC5yZXBlYXRcclxuICAgICAgICB0aGlzLm9wdGlvbnMucmV2ZXJzZSA9IGxvYWQucmV2ZXJzZVxyXG4gICAgICAgIHRoaXMub3B0aW9ucy5pZCA9IGxvYWQuaWRcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZWFzZSA9IGxvYWQuZWFzZVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZWFzZSAmJiB0eXBlb2YgdGhpcy5vcHRpb25zLmVhc2UgIT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWFzZU5hbWUgPSB0aGlzLm9wdGlvbnMuZWFzZVxyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZWFzZSA9IEVhc2luZ1t0aGlzLm9wdGlvbnMuZWFzZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZWFzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lYXNlID0gRWFzaW5nWydsaW5lYXInXVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRpbWUgPSBsb2FkLnRpbWVcclxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gbG9hZC5kdXJhdGlvblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcGF1c2UgdGhpcyBlbnRyeVxyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHNldCBwYXVzZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMucGF1c2UgPSB2YWx1ZVxyXG4gICAgfVxyXG4gICAgZ2V0IHBhdXNlKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnBhdXNlXHJcbiAgICB9XHJcblxyXG4gICAgZW5kKGxlZnRPdmVyKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmV2ZXJzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmV2ZXJzZSgpXHJcbiAgICAgICAgICAgIHRoaXMudGltZSA9IGxlZnRPdmVyXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlcGVhdClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZXZlcnNlID09PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5yZXZlcnNlID0gZmFsc2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucmV2ZXJzZS0tXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJlcGVhdCAhPT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucmVwZWF0LS1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2xvb3AnLCB0aGlzLmxpc3QgfHwgdGhpcy5vYmplY3QpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMub3B0aW9ucy5yZXBlYXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSBsZWZ0T3ZlclxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJlcGVhdCAhPT0gdHJ1ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnJlcGVhdC0tXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdsb29wJywgdGhpcy5saXN0IHx8IHRoaXMub2JqZWN0KVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmRvbmUoKVxyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2RvbmUnLCB0aGlzLmxpc3QgfHwgdGhpcy5vYmplY3QsIGxlZnRPdmVyKVxyXG4gICAgICAgICAgICAvLyB0aGlzLmxpc3QgPSB0aGlzLm9iamVjdCA9IG51bGxcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGVsYXBzZWQpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc1xyXG4gICAgICAgIGlmIChvcHRpb25zLnBhdXNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLndhaXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBvcHRpb25zLndhaXQgLT0gZWxhcHNlZFxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy53YWl0IDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGVsYXBzZWQgPSAtb3B0aW9ucy53YWl0XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLndhaXQgPSBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd3YWl0JywgZWxhcHNlZCwgdGhpcy5saXN0IHx8IHRoaXMub2JqZWN0KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmZpcnN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5maXJzdCA9IHRydWVcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdmaXJzdCcsIHRoaXMubGlzdCB8fCB0aGlzLm9iamVjdClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aW1lICs9IGVsYXBzZWRcclxuICAgICAgICBsZXQgbGVmdE92ZXIgPSAwXHJcbiAgICAgICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uXHJcbiAgICAgICAgbGV0IHRpbWUgPSB0aGlzLnRpbWVcclxuICAgICAgICBpZiAoZHVyYXRpb24gIT09IDAgJiYgdGltZSA+IGR1cmF0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGVmdE92ZXIgPSB0aW1lIC0gZHVyYXRpb25cclxuICAgICAgICAgICAgdGhpcy50aW1lID0gdGltZSA9IGR1cmF0aW9uXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGZvcmNlID0gdGhpcy5jYWxjdWxhdGUoZWxhcHNlZClcclxuICAgICAgICB0aGlzLmVtaXQoJ2VhY2gnLCBlbGFwc2VkLCB0aGlzLmxpc3QgfHwgdGhpcy5vYmplY3QsIHRoaXMpXHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ1dhaXQnIHx8IChkdXJhdGlvbiAhPT0gMCAmJiB0aW1lID09PSBkdXJhdGlvbikpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbmQobGVmdE92ZXIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmb3JjZSB8fCB0aW1lID09PSBkdXJhdGlvblxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvcnJlY3QgY2VydGFpbiBET00gdmFsdWVzXHJcbiAgICBfY29ycmVjdERPTShrZXksIHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAoa2V5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAnb3BhY2l0eSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGlzTmFOKHZhbHVlKSkgPyAxIDogdmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgcmV2ZXJzZSgpIHt9XHJcbiAgICBjYWxjdWxhdGUoKSB7IH1cclxuICAgIGRvbmUoKSB7IH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB3YWl0Il19

/***/ }),

/***/ 204:
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),

/***/ 205:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var wait = __webpack_require__(203);

var angle = function (_wait) {
    _inherits(angle, _wait);

    /**
     * animate object's {x, y} using an angle
     * @param {object} object to animate
     * @param {number} angle in radians
     * @param {number} speed in pixels/millisecond
     * @param {number} [duration=0] in milliseconds; if 0, then continues forever
     * @param {object} [options] @see {@link Wait}
     * @private
     */
    function angle(object, _angle, speed, duration, options) {
        _classCallCheck(this, angle);

        options = options || {};

        var _this = _possibleConstructorReturn(this, (angle.__proto__ || Object.getPrototypeOf(angle)).call(this, object, options));

        _this.type = 'Angle';
        if (options.load) {
            _this.load(options.load);
        } else {
            _this.angle = _angle;
            _this.speed = speed;
            _this.duration = duration || 0;
        }
        return _this;
    }

    _createClass(angle, [{
        key: 'save',
        value: function save() {
            var save = _get(angle.prototype.__proto__ || Object.getPrototypeOf(angle.prototype), 'save', this).call(this);
            save.angle = this.angle;
            save.speed = this.speed;
            return save;
        }
    }, {
        key: 'load',
        value: function load(_load) {
            _get(angle.prototype.__proto__ || Object.getPrototypeOf(angle.prototype), 'load', this).call(this, _load);
            this.angle = _load.angle;
            this.speed = _load.speed;
        }
    }, {
        key: 'calculate',
        value: function calculate(elapsed) {
            this.object.x += this.cos * elapsed * this.speed;
            this.object.y += this.sin * elapsed * this.speed;
        }
    }, {
        key: 'reverse',
        value: function reverse() {
            this.angle += Math.PI;
        }
    }, {
        key: 'angle',
        get: function get() {
            return this._angle;
        },
        set: function set(value) {
            this._angle = value;
            this.sin = Math.sin(this._angle);
            this.cos = Math.cos(this._angle);
        }
    }]);

    return angle;
}(wait);

module.exports = angle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hbmdsZS5qcyJdLCJuYW1lcyI6WyJ3YWl0IiwicmVxdWlyZSIsImFuZ2xlIiwib2JqZWN0Iiwic3BlZWQiLCJkdXJhdGlvbiIsIm9wdGlvbnMiLCJ0eXBlIiwibG9hZCIsInNhdmUiLCJlbGFwc2VkIiwieCIsImNvcyIsInkiLCJzaW4iLCJNYXRoIiwiUEkiLCJfYW5nbGUiLCJ2YWx1ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLE9BQU9DLFFBQVEsUUFBUixDQUFiOztJQUVNQyxLOzs7QUFFRjs7Ozs7Ozs7O0FBU0EsbUJBQVlDLE1BQVosRUFBb0JELE1BQXBCLEVBQTJCRSxLQUEzQixFQUFrQ0MsUUFBbEMsRUFBNENDLE9BQTVDLEVBQ0E7QUFBQTs7QUFDSUEsa0JBQVVBLFdBQVcsRUFBckI7O0FBREosa0hBRVVILE1BRlYsRUFFa0JHLE9BRmxCOztBQUdJLGNBQUtDLElBQUwsR0FBWSxPQUFaO0FBQ0EsWUFBSUQsUUFBUUUsSUFBWixFQUNBO0FBQ0ksa0JBQUtBLElBQUwsQ0FBVUYsUUFBUUUsSUFBbEI7QUFDSCxTQUhELE1BS0E7QUFDSSxrQkFBS04sS0FBTCxHQUFhQSxNQUFiO0FBQ0Esa0JBQUtFLEtBQUwsR0FBYUEsS0FBYjtBQUNBLGtCQUFLQyxRQUFMLEdBQWdCQSxZQUFZLENBQTVCO0FBQ0g7QUFiTDtBQWNDOzs7OytCQUdEO0FBQ0ksZ0JBQU1JLHlHQUFOO0FBQ0FBLGlCQUFLUCxLQUFMLEdBQWEsS0FBS0EsS0FBbEI7QUFDQU8saUJBQUtMLEtBQUwsR0FBYSxLQUFLQSxLQUFsQjtBQUNBLG1CQUFPSyxJQUFQO0FBQ0g7Ozs2QkFFSUQsSyxFQUNMO0FBQ0ksK0dBQVdBLEtBQVg7QUFDQSxpQkFBS04sS0FBTCxHQUFhTSxNQUFLTixLQUFsQjtBQUNBLGlCQUFLRSxLQUFMLEdBQWFJLE1BQUtKLEtBQWxCO0FBQ0g7OztrQ0FhU00sTyxFQUNWO0FBQ0ksaUJBQUtQLE1BQUwsQ0FBWVEsQ0FBWixJQUFpQixLQUFLQyxHQUFMLEdBQVdGLE9BQVgsR0FBcUIsS0FBS04sS0FBM0M7QUFDQSxpQkFBS0QsTUFBTCxDQUFZVSxDQUFaLElBQWlCLEtBQUtDLEdBQUwsR0FBV0osT0FBWCxHQUFxQixLQUFLTixLQUEzQztBQUNIOzs7a0NBR0Q7QUFDSSxpQkFBS0YsS0FBTCxJQUFjYSxLQUFLQyxFQUFuQjtBQUNIOzs7NEJBbkJEO0FBQ0ksbUJBQU8sS0FBS0MsTUFBWjtBQUNILFM7MEJBQ1NDLEssRUFDVjtBQUNJLGlCQUFLRCxNQUFMLEdBQWNDLEtBQWQ7QUFDQSxpQkFBS0osR0FBTCxHQUFXQyxLQUFLRCxHQUFMLENBQVMsS0FBS0csTUFBZCxDQUFYO0FBQ0EsaUJBQUtMLEdBQUwsR0FBV0csS0FBS0gsR0FBTCxDQUFTLEtBQUtLLE1BQWQsQ0FBWDtBQUNIOzs7O0VBcERlakIsSTs7QUFrRXBCbUIsT0FBT0MsT0FBUCxHQUFpQmxCLEtBQWpCIiwiZmlsZSI6ImFuZ2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgd2FpdCA9IHJlcXVpcmUoJy4vd2FpdCcpXG5cbmNsYXNzIGFuZ2xlIGV4dGVuZHMgd2FpdFxue1xuICAgIC8qKlxuICAgICAqIGFuaW1hdGUgb2JqZWN0J3Mge3gsIHl9IHVzaW5nIGFuIGFuZ2xlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCB0byBhbmltYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIGluIHJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgaW4gcGl4ZWxzL21pbGxpc2Vjb25kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbj0wXSBpbiBtaWxsaXNlY29uZHM7IGlmIDAsIHRoZW4gY29udGludWVzIGZvcmV2ZXJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIEBzZWUge0BsaW5rIFdhaXR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvYmplY3QsIGFuZ2xlLCBzcGVlZCwgZHVyYXRpb24sIG9wdGlvbnMpXG4gICAge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgICAgICBzdXBlcihvYmplY3QsIG9wdGlvbnMpXG4gICAgICAgIHRoaXMudHlwZSA9ICdBbmdsZSdcbiAgICAgICAgaWYgKG9wdGlvbnMubG9hZClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5sb2FkKG9wdGlvbnMubG9hZClcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuYW5nbGUgPSBhbmdsZVxuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkXG4gICAgICAgICAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb24gfHwgMFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZSgpXG4gICAge1xuICAgICAgICBjb25zdCBzYXZlID0gc3VwZXIuc2F2ZSgpXG4gICAgICAgIHNhdmUuYW5nbGUgPSB0aGlzLmFuZ2xlXG4gICAgICAgIHNhdmUuc3BlZWQgPSB0aGlzLnNwZWVkXG4gICAgICAgIHJldHVybiBzYXZlXG4gICAgfVxuXG4gICAgbG9hZChsb2FkKVxuICAgIHtcbiAgICAgICAgc3VwZXIubG9hZChsb2FkKVxuICAgICAgICB0aGlzLmFuZ2xlID0gbG9hZC5hbmdsZVxuICAgICAgICB0aGlzLnNwZWVkID0gbG9hZC5zcGVlZFxuICAgIH1cblxuICAgIGdldCBhbmdsZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5fYW5nbGVcbiAgICB9XG4gICAgc2V0IGFuZ2xlKHZhbHVlKVxuICAgIHtcbiAgICAgICAgdGhpcy5fYW5nbGUgPSB2YWx1ZVxuICAgICAgICB0aGlzLnNpbiA9IE1hdGguc2luKHRoaXMuX2FuZ2xlKVxuICAgICAgICB0aGlzLmNvcyA9IE1hdGguY29zKHRoaXMuX2FuZ2xlKVxuICAgIH1cblxuICAgIGNhbGN1bGF0ZShlbGFwc2VkKVxuICAgIHtcbiAgICAgICAgdGhpcy5vYmplY3QueCArPSB0aGlzLmNvcyAqIGVsYXBzZWQgKiB0aGlzLnNwZWVkXG4gICAgICAgIHRoaXMub2JqZWN0LnkgKz0gdGhpcy5zaW4gKiBlbGFwc2VkICogdGhpcy5zcGVlZFxuICAgIH1cblxuICAgIHJldmVyc2UoKVxuICAgIHtcbiAgICAgICAgdGhpcy5hbmdsZSArPSBNYXRoLlBJXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ2xlIl19

/***/ }),

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Angle = __webpack_require__(225);
var wait = __webpack_require__(203);

/** Rotates an object to face the target */

var face = function (_wait) {
    _inherits(face, _wait);

    /**
     * @param {object} object
     * @param {Point} target
     * @param {number} speed in radians/millisecond
     * @param {object} [options] @see {@link Wait}
     * @param {boolean} [options.keepAlive] don't stop animation when complete
     */
    function face(object, target, speed, options) {
        _classCallCheck(this, face);

        options = options || {};

        var _this = _possibleConstructorReturn(this, (face.__proto__ || Object.getPrototypeOf(face)).call(this, object, options));

        _this.type = 'Face';
        _this.target = target;
        if (options.load) {
            _this.load(options.load);
        } else {
            _this.speed = speed;
        }
        return _this;
    }

    _createClass(face, [{
        key: 'save',
        value: function save() {
            if (this.options.cancel) {
                return null;
            }
            var save = _get(face.prototype.__proto__ || Object.getPrototypeOf(face.prototype), 'save', this).call(this);
            save.speed = this.speed;
            save.keepAlive = this.options.keepAlive;
            return save;
        }
    }, {
        key: 'load',
        value: function load(_load) {
            _get(face.prototype.__proto__ || Object.getPrototypeOf(face.prototype), 'load', this).call(this, _load);
            this.speed = _load.speed;
            this.options.keepAlive = _load.keepAlive;
        }
    }, {
        key: 'calculate',
        value: function calculate(elapsed) {
            var angle = Angle.angleTwoPoints(this.object.position, this.target);
            var difference = Angle.differenceAngles(angle, this.object.rotation);
            if (difference === 0) {
                this.emit('done', this.object);
                if (!this.options.keepAlive) {
                    return true;
                }
            } else {
                var sign = Angle.differenceAnglesSign(angle, this.object.rotation);
                var change = this.speed * elapsed;
                var delta = change > difference ? difference : change;
                this.object.rotation += delta * sign;
            }
        }
    }]);

    return face;
}(wait);

module.exports = face;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mYWNlLmpzIl0sIm5hbWVzIjpbIkFuZ2xlIiwicmVxdWlyZSIsIndhaXQiLCJmYWNlIiwib2JqZWN0IiwidGFyZ2V0Iiwic3BlZWQiLCJvcHRpb25zIiwidHlwZSIsImxvYWQiLCJjYW5jZWwiLCJzYXZlIiwia2VlcEFsaXZlIiwiZWxhcHNlZCIsImFuZ2xlIiwiYW5nbGVUd29Qb2ludHMiLCJwb3NpdGlvbiIsImRpZmZlcmVuY2UiLCJkaWZmZXJlbmNlQW5nbGVzIiwicm90YXRpb24iLCJlbWl0Iiwic2lnbiIsImRpZmZlcmVuY2VBbmdsZXNTaWduIiwiY2hhbmdlIiwiZGVsdGEiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLFVBQVIsQ0FBZDtBQUNBLElBQU1DLE9BQU9ELFFBQVEsUUFBUixDQUFiOztBQUVBOztJQUNNRSxJOzs7QUFFRjs7Ozs7OztBQU9BLGtCQUFZQyxNQUFaLEVBQW9CQyxNQUFwQixFQUE0QkMsS0FBNUIsRUFBbUNDLE9BQW5DLEVBQ0E7QUFBQTs7QUFDSUEsa0JBQVVBLFdBQVcsRUFBckI7O0FBREosZ0hBRVVILE1BRlYsRUFFa0JHLE9BRmxCOztBQUdJLGNBQUtDLElBQUwsR0FBWSxNQUFaO0FBQ0EsY0FBS0gsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsWUFBSUUsUUFBUUUsSUFBWixFQUNBO0FBQ0ksa0JBQUtBLElBQUwsQ0FBVUYsUUFBUUUsSUFBbEI7QUFDSCxTQUhELE1BS0E7QUFDSSxrQkFBS0gsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7QUFaTDtBQWFDOzs7OytCQUdEO0FBQ0ksZ0JBQUksS0FBS0MsT0FBTCxDQUFhRyxNQUFqQixFQUNBO0FBQ0ksdUJBQU8sSUFBUDtBQUNIO0FBQ0QsZ0JBQU1DLHVHQUFOO0FBQ0FBLGlCQUFLTCxLQUFMLEdBQWEsS0FBS0EsS0FBbEI7QUFDQUssaUJBQUtDLFNBQUwsR0FBaUIsS0FBS0wsT0FBTCxDQUFhSyxTQUE5QjtBQUNBLG1CQUFPRCxJQUFQO0FBQ0g7Ozs2QkFFSUYsSyxFQUNMO0FBQ0ksNkdBQVdBLEtBQVg7QUFDQSxpQkFBS0gsS0FBTCxHQUFhRyxNQUFLSCxLQUFsQjtBQUNBLGlCQUFLQyxPQUFMLENBQWFLLFNBQWIsR0FBeUJILE1BQUtHLFNBQTlCO0FBQ0g7OztrQ0FFU0MsTyxFQUNWO0FBQ0ksZ0JBQUlDLFFBQVFkLE1BQU1lLGNBQU4sQ0FBcUIsS0FBS1gsTUFBTCxDQUFZWSxRQUFqQyxFQUEyQyxLQUFLWCxNQUFoRCxDQUFaO0FBQ0EsZ0JBQUlZLGFBQWFqQixNQUFNa0IsZ0JBQU4sQ0FBdUJKLEtBQXZCLEVBQThCLEtBQUtWLE1BQUwsQ0FBWWUsUUFBMUMsQ0FBakI7QUFDQSxnQkFBSUYsZUFBZSxDQUFuQixFQUNBO0FBQ0kscUJBQUtHLElBQUwsQ0FBVSxNQUFWLEVBQWtCLEtBQUtoQixNQUF2QjtBQUNBLG9CQUFJLENBQUMsS0FBS0csT0FBTCxDQUFhSyxTQUFsQixFQUNBO0FBQ0ksMkJBQU8sSUFBUDtBQUNIO0FBQ0osYUFQRCxNQVNBO0FBQ0ksb0JBQUlTLE9BQU9yQixNQUFNc0Isb0JBQU4sQ0FBMkJSLEtBQTNCLEVBQWtDLEtBQUtWLE1BQUwsQ0FBWWUsUUFBOUMsQ0FBWDtBQUNBLG9CQUFJSSxTQUFTLEtBQUtqQixLQUFMLEdBQWFPLE9BQTFCO0FBQ0Esb0JBQUlXLFFBQVNELFNBQVNOLFVBQVYsR0FBd0JBLFVBQXhCLEdBQXFDTSxNQUFqRDtBQUNBLHFCQUFLbkIsTUFBTCxDQUFZZSxRQUFaLElBQXdCSyxRQUFRSCxJQUFoQztBQUNIO0FBQ0o7Ozs7RUEvRGNuQixJOztBQWtFbkJ1QixPQUFPQyxPQUFQLEdBQWlCdkIsSUFBakIiLCJmaWxlIjoiZmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFuZ2xlID0gcmVxdWlyZSgneXktYW5nbGUnKVxuY29uc3Qgd2FpdCA9IHJlcXVpcmUoJy4vd2FpdCcpXG5cbi8qKiBSb3RhdGVzIGFuIG9iamVjdCB0byBmYWNlIHRoZSB0YXJnZXQgKi9cbmNsYXNzIGZhY2UgZXh0ZW5kcyB3YWl0XG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFxuICAgICAqIEBwYXJhbSB7UG9pbnR9IHRhcmdldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBpbiByYWRpYW5zL21pbGxpc2Vjb25kXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBAc2VlIHtAbGluayBXYWl0fVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMua2VlcEFsaXZlXSBkb24ndCBzdG9wIGFuaW1hdGlvbiB3aGVuIGNvbXBsZXRlXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob2JqZWN0LCB0YXJnZXQsIHNwZWVkLCBvcHRpb25zKVxuICAgIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgICAgc3VwZXIob2JqZWN0LCBvcHRpb25zKVxuICAgICAgICB0aGlzLnR5cGUgPSAnRmFjZSdcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXRcbiAgICAgICAgaWYgKG9wdGlvbnMubG9hZClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5sb2FkKG9wdGlvbnMubG9hZClcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZSgpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNhbmNlbClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzYXZlID0gc3VwZXIuc2F2ZSgpXG4gICAgICAgIHNhdmUuc3BlZWQgPSB0aGlzLnNwZWVkXG4gICAgICAgIHNhdmUua2VlcEFsaXZlID0gdGhpcy5vcHRpb25zLmtlZXBBbGl2ZVxuICAgICAgICByZXR1cm4gc2F2ZVxuICAgIH1cblxuICAgIGxvYWQobG9hZClcbiAgICB7XG4gICAgICAgIHN1cGVyLmxvYWQobG9hZClcbiAgICAgICAgdGhpcy5zcGVlZCA9IGxvYWQuc3BlZWRcbiAgICAgICAgdGhpcy5vcHRpb25zLmtlZXBBbGl2ZSA9IGxvYWQua2VlcEFsaXZlXG4gICAgfVxuXG4gICAgY2FsY3VsYXRlKGVsYXBzZWQpXG4gICAge1xuICAgICAgICB2YXIgYW5nbGUgPSBBbmdsZS5hbmdsZVR3b1BvaW50cyh0aGlzLm9iamVjdC5wb3NpdGlvbiwgdGhpcy50YXJnZXQpXG4gICAgICAgIHZhciBkaWZmZXJlbmNlID0gQW5nbGUuZGlmZmVyZW5jZUFuZ2xlcyhhbmdsZSwgdGhpcy5vYmplY3Qucm90YXRpb24pXG4gICAgICAgIGlmIChkaWZmZXJlbmNlID09PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2RvbmUnLCB0aGlzLm9iamVjdClcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmtlZXBBbGl2ZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNpZ24gPSBBbmdsZS5kaWZmZXJlbmNlQW5nbGVzU2lnbihhbmdsZSwgdGhpcy5vYmplY3Qucm90YXRpb24pXG4gICAgICAgICAgICB2YXIgY2hhbmdlID0gdGhpcy5zcGVlZCAqIGVsYXBzZWRcbiAgICAgICAgICAgIHZhciBkZWx0YSA9IChjaGFuZ2UgPiBkaWZmZXJlbmNlKSA/IGRpZmZlcmVuY2UgOiBjaGFuZ2VcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LnJvdGF0aW9uICs9IGRlbHRhICogc2lnblxuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY2UiXX0=

/***/ }),

/***/ 207:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var wait = __webpack_require__(203);

/**
 * animate a movie of textures
 */

var movie = function (_wait) {
    _inherits(movie, _wait);

    /**
     * @param {object} object to animate
     * @param {PIXI.Texture[]} textures
     * @param {number} [duration=0] time to run (use 0 for infinite duration--should only be used with customized easing functions)
     * @param {object} [options]
     * @param {number} [options.wait=0] n milliseconds before starting animation (can also be used to pause animation for a length of time)
     * @param {boolean} [options.pause] start the animation paused
     * @param {(boolean|number)} [options.repeat] true: repeat animation forever n: repeat animation n times
     * @param {(boolean|number)} [options.reverse] true: reverse animation (if combined with repeat, then pulse) n: reverse animation n times
     * @param {(boolean|number)} [options.continue] true: continue animation with new starting values n: continue animation n times
     * @param {Function} [options.load] loads an animation using a .save() object note the * parameters below cannot be loaded and must be re-set
     * @param {Function} [options.ease] function from easing.js (see http://easings.net for examples)
     * @emits {done} animation expires
     * @emits {wait} each update during a wait
     * @emits {first} first update when animation starts
     * @emits {each} each update while animation is running
     * @emits {loop} when animation is repeated
     * @emits {reverse} when animation is reversed
     */
    function movie(object, textures, duration, options) {
        _classCallCheck(this, movie);

        options = options || {};

        var _this = _possibleConstructorReturn(this, (movie.__proto__ || Object.getPrototypeOf(movie)).call(this, object, options));

        _this.type = 'Movie';
        if (Array.isArray(object)) {
            _this.list = object;
            _this.object = _this.list[0];
        }
        if (options.load) {
            _this.load(options.load);
        } else {
            _this.textures = textures;
            _this.duration = duration;
            _this.current = 0;
            _this.length = textures.length;
            _this.interval = duration / _this.length;
            _this.isReverse = false;
            _this.restart();
        }
        return _this;
    }

    _createClass(movie, [{
        key: 'save',
        value: function save() {
            var save = _get(movie.prototype.__proto__ || Object.getPrototypeOf(movie.prototype), 'save', this).call(this);
            save.goto = this.goto;
            save.current = this.current;
            save.length = this.length;
            save.interval = this.interval;
            return save;
        }
    }, {
        key: 'load',
        value: function load(_load) {
            _get(movie.prototype.__proto__ || Object.getPrototypeOf(movie.prototype), 'load', this).call(this, _load);
            this.goto = _load.goto;
            this.current = _load.current;
            this.interval = _load.current;
        }
    }, {
        key: 'restart',
        value: function restart() {
            this.current = 0;
            this.time = 0;
            this.isReverse = false;
        }
    }, {
        key: 'reverse',
        value: function reverse() {
            this.isReverse = !this.isReverse;
        }
    }, {
        key: 'calculate',
        value: function calculate() {
            var index = Math.round(this.options.ease(this.time, 0, this.length - 1, this.duration));
            if (this.isReverse) {
                index = this.length - 1 - index;
            }
            if (this.list) {
                for (var i = 0; i < this.list.length; i++) {
                    this.list[i].texture = this.textures[index];
                }
            } else {
                this.object.texture = this.textures[index];
            }
        }
    }]);

    return movie;
}(wait);

module.exports = movie;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb3ZpZS5qcyJdLCJuYW1lcyI6WyJ3YWl0IiwicmVxdWlyZSIsIm1vdmllIiwib2JqZWN0IiwidGV4dHVyZXMiLCJkdXJhdGlvbiIsIm9wdGlvbnMiLCJ0eXBlIiwiQXJyYXkiLCJpc0FycmF5IiwibGlzdCIsImxvYWQiLCJjdXJyZW50IiwibGVuZ3RoIiwiaW50ZXJ2YWwiLCJpc1JldmVyc2UiLCJyZXN0YXJ0Iiwic2F2ZSIsImdvdG8iLCJ0aW1lIiwiaW5kZXgiLCJNYXRoIiwicm91bmQiLCJlYXNlIiwiaSIsInRleHR1cmUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxPQUFPQyxRQUFRLFFBQVIsQ0FBYjs7QUFFQTs7OztJQUdNQyxLOzs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxtQkFBWUMsTUFBWixFQUFvQkMsUUFBcEIsRUFBOEJDLFFBQTlCLEVBQXdDQyxPQUF4QyxFQUNBO0FBQUE7O0FBQ0lBLGtCQUFVQSxXQUFXLEVBQXJCOztBQURKLGtIQUVVSCxNQUZWLEVBRWtCRyxPQUZsQjs7QUFHSSxjQUFLQyxJQUFMLEdBQVksT0FBWjtBQUNBLFlBQUlDLE1BQU1DLE9BQU4sQ0FBY04sTUFBZCxDQUFKLEVBQ0E7QUFDSSxrQkFBS08sSUFBTCxHQUFZUCxNQUFaO0FBQ0Esa0JBQUtBLE1BQUwsR0FBYyxNQUFLTyxJQUFMLENBQVUsQ0FBVixDQUFkO0FBQ0g7QUFDRCxZQUFJSixRQUFRSyxJQUFaLEVBQ0E7QUFDSSxrQkFBS0EsSUFBTCxDQUFVTCxRQUFRSyxJQUFsQjtBQUNILFNBSEQsTUFLQTtBQUNJLGtCQUFLUCxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLGtCQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLGtCQUFLTyxPQUFMLEdBQWUsQ0FBZjtBQUNBLGtCQUFLQyxNQUFMLEdBQWNULFNBQVNTLE1BQXZCO0FBQ0Esa0JBQUtDLFFBQUwsR0FBZ0JULFdBQVcsTUFBS1EsTUFBaEM7QUFDQSxrQkFBS0UsU0FBTCxHQUFpQixLQUFqQjtBQUNBLGtCQUFLQyxPQUFMO0FBQ0g7QUF0Qkw7QUF1QkM7Ozs7K0JBR0Q7QUFDSSxnQkFBTUMseUdBQU47QUFDQUEsaUJBQUtDLElBQUwsR0FBWSxLQUFLQSxJQUFqQjtBQUNBRCxpQkFBS0wsT0FBTCxHQUFlLEtBQUtBLE9BQXBCO0FBQ0FLLGlCQUFLSixNQUFMLEdBQWMsS0FBS0EsTUFBbkI7QUFDQUksaUJBQUtILFFBQUwsR0FBZ0IsS0FBS0EsUUFBckI7QUFDQSxtQkFBT0csSUFBUDtBQUNIOzs7NkJBRUlOLEssRUFDTDtBQUNJLCtHQUFXQSxLQUFYO0FBQ0EsaUJBQUtPLElBQUwsR0FBWVAsTUFBS08sSUFBakI7QUFDQSxpQkFBS04sT0FBTCxHQUFlRCxNQUFLQyxPQUFwQjtBQUNBLGlCQUFLRSxRQUFMLEdBQWdCSCxNQUFLQyxPQUFyQjtBQUNIOzs7a0NBR0Q7QUFDSSxpQkFBS0EsT0FBTCxHQUFlLENBQWY7QUFDQSxpQkFBS08sSUFBTCxHQUFZLENBQVo7QUFDQSxpQkFBS0osU0FBTCxHQUFpQixLQUFqQjtBQUNIOzs7a0NBR0Q7QUFDSSxpQkFBS0EsU0FBTCxHQUFpQixDQUFDLEtBQUtBLFNBQXZCO0FBQ0g7OztvQ0FHRDtBQUNJLGdCQUFJSyxRQUFRQyxLQUFLQyxLQUFMLENBQVcsS0FBS2hCLE9BQUwsQ0FBYWlCLElBQWIsQ0FBa0IsS0FBS0osSUFBdkIsRUFBNkIsQ0FBN0IsRUFBZ0MsS0FBS04sTUFBTCxHQUFjLENBQTlDLEVBQWlELEtBQUtSLFFBQXRELENBQVgsQ0FBWjtBQUNBLGdCQUFJLEtBQUtVLFNBQVQsRUFDQTtBQUNJSyx3QkFBUSxLQUFLUCxNQUFMLEdBQWMsQ0FBZCxHQUFrQk8sS0FBMUI7QUFDSDtBQUNELGdCQUFJLEtBQUtWLElBQVQsRUFDQTtBQUNJLHFCQUFLLElBQUljLElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLZCxJQUFMLENBQVVHLE1BQTlCLEVBQXNDVyxHQUF0QyxFQUNBO0FBQ0kseUJBQUtkLElBQUwsQ0FBVWMsQ0FBVixFQUFhQyxPQUFiLEdBQXVCLEtBQUtyQixRQUFMLENBQWNnQixLQUFkLENBQXZCO0FBQ0g7QUFDSixhQU5ELE1BUUE7QUFDSSxxQkFBS2pCLE1BQUwsQ0FBWXNCLE9BQVosR0FBc0IsS0FBS3JCLFFBQUwsQ0FBY2dCLEtBQWQsQ0FBdEI7QUFDSDtBQUNKOzs7O0VBL0ZlcEIsSTs7QUFrR3BCMEIsT0FBT0MsT0FBUCxHQUFpQnpCLEtBQWpCIiwiZmlsZSI6Im1vdmllLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgd2FpdCA9IHJlcXVpcmUoJy4vd2FpdCcpXG5cbi8qKlxuICogYW5pbWF0ZSBhIG1vdmllIG9mIHRleHR1cmVzXG4gKi9cbmNsYXNzIG1vdmllIGV4dGVuZHMgd2FpdFxue1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3QgdG8gYW5pbWF0ZVxuICAgICAqIEBwYXJhbSB7UElYSS5UZXh0dXJlW119IHRleHR1cmVzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbj0wXSB0aW1lIHRvIHJ1biAodXNlIDAgZm9yIGluZmluaXRlIGR1cmF0aW9uLS1zaG91bGQgb25seSBiZSB1c2VkIHdpdGggY3VzdG9taXplZCBlYXNpbmcgZnVuY3Rpb25zKVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMud2FpdD0wXSBuIG1pbGxpc2Vjb25kcyBiZWZvcmUgc3RhcnRpbmcgYW5pbWF0aW9uIChjYW4gYWxzbyBiZSB1c2VkIHRvIHBhdXNlIGFuaW1hdGlvbiBmb3IgYSBsZW5ndGggb2YgdGltZSlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnBhdXNlXSBzdGFydCB0aGUgYW5pbWF0aW9uIHBhdXNlZFxuICAgICAqIEBwYXJhbSB7KGJvb2xlYW58bnVtYmVyKX0gW29wdGlvbnMucmVwZWF0XSB0cnVlOiByZXBlYXQgYW5pbWF0aW9uIGZvcmV2ZXIgbjogcmVwZWF0IGFuaW1hdGlvbiBuIHRpbWVzXG4gICAgICogQHBhcmFtIHsoYm9vbGVhbnxudW1iZXIpfSBbb3B0aW9ucy5yZXZlcnNlXSB0cnVlOiByZXZlcnNlIGFuaW1hdGlvbiAoaWYgY29tYmluZWQgd2l0aCByZXBlYXQsIHRoZW4gcHVsc2UpIG46IHJldmVyc2UgYW5pbWF0aW9uIG4gdGltZXNcbiAgICAgKiBAcGFyYW0geyhib29sZWFufG51bWJlcil9IFtvcHRpb25zLmNvbnRpbnVlXSB0cnVlOiBjb250aW51ZSBhbmltYXRpb24gd2l0aCBuZXcgc3RhcnRpbmcgdmFsdWVzIG46IGNvbnRpbnVlIGFuaW1hdGlvbiBuIHRpbWVzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMubG9hZF0gbG9hZHMgYW4gYW5pbWF0aW9uIHVzaW5nIGEgLnNhdmUoKSBvYmplY3Qgbm90ZSB0aGUgKiBwYXJhbWV0ZXJzIGJlbG93IGNhbm5vdCBiZSBsb2FkZWQgYW5kIG11c3QgYmUgcmUtc2V0XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZWFzZV0gZnVuY3Rpb24gZnJvbSBlYXNpbmcuanMgKHNlZSBodHRwOi8vZWFzaW5ncy5uZXQgZm9yIGV4YW1wbGVzKVxuICAgICAqIEBlbWl0cyB7ZG9uZX0gYW5pbWF0aW9uIGV4cGlyZXNcbiAgICAgKiBAZW1pdHMge3dhaXR9IGVhY2ggdXBkYXRlIGR1cmluZyBhIHdhaXRcbiAgICAgKiBAZW1pdHMge2ZpcnN0fSBmaXJzdCB1cGRhdGUgd2hlbiBhbmltYXRpb24gc3RhcnRzXG4gICAgICogQGVtaXRzIHtlYWNofSBlYWNoIHVwZGF0ZSB3aGlsZSBhbmltYXRpb24gaXMgcnVubmluZ1xuICAgICAqIEBlbWl0cyB7bG9vcH0gd2hlbiBhbmltYXRpb24gaXMgcmVwZWF0ZWRcbiAgICAgKiBAZW1pdHMge3JldmVyc2V9IHdoZW4gYW5pbWF0aW9uIGlzIHJldmVyc2VkXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob2JqZWN0LCB0ZXh0dXJlcywgZHVyYXRpb24sIG9wdGlvbnMpXG4gICAge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgICAgICBzdXBlcihvYmplY3QsIG9wdGlvbnMpXG4gICAgICAgIHRoaXMudHlwZSA9ICdNb3ZpZSdcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5saXN0ID0gb2JqZWN0XG4gICAgICAgICAgICB0aGlzLm9iamVjdCA9IHRoaXMubGlzdFswXVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmxvYWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubG9hZChvcHRpb25zLmxvYWQpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzID0gdGV4dHVyZXNcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gMFxuICAgICAgICAgICAgdGhpcy5sZW5ndGggPSB0ZXh0dXJlcy5sZW5ndGhcbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBkdXJhdGlvbiAvIHRoaXMubGVuZ3RoXG4gICAgICAgICAgICB0aGlzLmlzUmV2ZXJzZSA9IGZhbHNlXG4gICAgICAgICAgICB0aGlzLnJlc3RhcnQoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZSgpXG4gICAge1xuICAgICAgICBjb25zdCBzYXZlID0gc3VwZXIuc2F2ZSgpXG4gICAgICAgIHNhdmUuZ290byA9IHRoaXMuZ290b1xuICAgICAgICBzYXZlLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnRcbiAgICAgICAgc2F2ZS5sZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgICAgICBzYXZlLmludGVydmFsID0gdGhpcy5pbnRlcnZhbFxuICAgICAgICByZXR1cm4gc2F2ZVxuICAgIH1cblxuICAgIGxvYWQobG9hZClcbiAgICB7XG4gICAgICAgIHN1cGVyLmxvYWQobG9hZClcbiAgICAgICAgdGhpcy5nb3RvID0gbG9hZC5nb3RvXG4gICAgICAgIHRoaXMuY3VycmVudCA9IGxvYWQuY3VycmVudFxuICAgICAgICB0aGlzLmludGVydmFsID0gbG9hZC5jdXJyZW50XG4gICAgfVxuXG4gICAgcmVzdGFydCgpXG4gICAge1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSAwXG4gICAgICAgIHRoaXMudGltZSA9IDBcbiAgICAgICAgdGhpcy5pc1JldmVyc2UgPSBmYWxzZVxuICAgIH1cblxuICAgIHJldmVyc2UoKVxuICAgIHtcbiAgICAgICAgdGhpcy5pc1JldmVyc2UgPSAhdGhpcy5pc1JldmVyc2VcbiAgICB9XG5cbiAgICBjYWxjdWxhdGUoKVxuICAgIHtcbiAgICAgICAgbGV0IGluZGV4ID0gTWF0aC5yb3VuZCh0aGlzLm9wdGlvbnMuZWFzZSh0aGlzLnRpbWUsIDAsIHRoaXMubGVuZ3RoIC0gMSwgdGhpcy5kdXJhdGlvbikpXG4gICAgICAgIGlmICh0aGlzLmlzUmV2ZXJzZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLmxlbmd0aCAtIDEgLSBpbmRleFxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmxpc3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0Lmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFtpXS50ZXh0dXJlID0gdGhpcy50ZXh0dXJlc1tpbmRleF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LnRleHR1cmUgPSB0aGlzLnRleHR1cmVzW2luZGV4XVxuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1vdmllIl19

/***/ }),

/***/ 208:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var wait = __webpack_require__(203);

/**
 * shakes an object or list of objects
 */

var shake = function (_wait) {
    _inherits(shake, _wait);

    /**
     * @param {object|array} object or list of objects to shake
     * @param {number} amount to shake
     * @param {number} duration (in milliseconds) to shake
     * @param {object} options (see Animate.wait)
     */
    function shake(object, amount, duration, options) {
        _classCallCheck(this, shake);

        options = options || {};

        var _this = _possibleConstructorReturn(this, (shake.__proto__ || Object.getPrototypeOf(shake)).call(this, object, options));

        _this.type = 'Shake';
        if (Array.isArray(object)) {
            _this.array = true;
            _this.list = object;
        }
        if (options.load) {
            _this.load(options.load);
        } else {
            if (_this.list) {
                _this.start = [];
                for (var i = 0; i < object.length; i++) {
                    var target = object[i];
                    _this.start[i] = { x: target.x, y: target.y };
                }
            } else {
                _this.start = { x: object.x, y: object.y };
            }
            _this.amount = amount;
            _this.duration = duration;
        }
        return _this;
    }

    _createClass(shake, [{
        key: 'save',
        value: function save() {
            var save = _get(shake.prototype.__proto__ || Object.getPrototypeOf(shake.prototype), 'save', this).call(this);
            save.start = this.start;
            save.amount = this.amount;
            return save;
        }
    }, {
        key: 'load',
        value: function load(_load) {
            _get(shake.prototype.__proto__ || Object.getPrototypeOf(shake.prototype), 'load', this).call(this, _load);
            this.start = _load.start;
            this.amount = _load.amount;
        }
    }, {
        key: 'calculate',
        value: function calculate() /*elapsed*/{
            var object = this.object;
            var start = this.start;
            var amount = this.amount;
            if (this.array) {
                var list = this.list;
                for (var i = 0; i < list.length; i++) {
                    var _object = list[i];
                    var actual = start[i];
                    _object.x = actual.x + Math.floor(Math.random() * amount * 2) - amount;
                    _object.y = actual.y + Math.floor(Math.random() * amount * 2) - amount;
                }
            }
            object.x = start.x + Math.floor(Math.random() * amount * 2) - amount;
            object.y = start.y + Math.floor(Math.random() * amount * 2) - amount;
        }
    }, {
        key: 'done',
        value: function done() {
            var object = this.object;
            var start = this.start;
            if (this.array) {
                var list = this.list;
                for (var i = 0; i < list.length; i++) {
                    var _object2 = list[i];
                    var actual = start[i];
                    _object2.x = actual.x;
                    _object2.y = actual.y;
                }
            } else {
                object.x = start.x;
                object.y = start.y;
            }
        }
    }]);

    return shake;
}(wait);

module.exports = shake;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGFrZS5qcyJdLCJuYW1lcyI6WyJ3YWl0IiwicmVxdWlyZSIsInNoYWtlIiwib2JqZWN0IiwiYW1vdW50IiwiZHVyYXRpb24iLCJvcHRpb25zIiwidHlwZSIsIkFycmF5IiwiaXNBcnJheSIsImFycmF5IiwibGlzdCIsImxvYWQiLCJzdGFydCIsImkiLCJsZW5ndGgiLCJ0YXJnZXQiLCJ4IiwieSIsInNhdmUiLCJhY3R1YWwiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxPQUFPQyxRQUFRLFFBQVIsQ0FBYjs7QUFFQTs7OztJQUdNQyxLOzs7QUFFRjs7Ozs7O0FBTUEsbUJBQVlDLE1BQVosRUFBb0JDLE1BQXBCLEVBQTRCQyxRQUE1QixFQUFzQ0MsT0FBdEMsRUFDQTtBQUFBOztBQUNJQSxrQkFBVUEsV0FBVyxFQUFyQjs7QUFESixrSEFFVUgsTUFGVixFQUVrQkcsT0FGbEI7O0FBR0ksY0FBS0MsSUFBTCxHQUFZLE9BQVo7QUFDQSxZQUFJQyxNQUFNQyxPQUFOLENBQWNOLE1BQWQsQ0FBSixFQUNBO0FBQ0ksa0JBQUtPLEtBQUwsR0FBYSxJQUFiO0FBQ0Esa0JBQUtDLElBQUwsR0FBWVIsTUFBWjtBQUNIO0FBQ0QsWUFBSUcsUUFBUU0sSUFBWixFQUNBO0FBQ0ksa0JBQUtBLElBQUwsQ0FBVU4sUUFBUU0sSUFBbEI7QUFDSCxTQUhELE1BS0E7QUFDSSxnQkFBSSxNQUFLRCxJQUFULEVBQ0E7QUFDSSxzQkFBS0UsS0FBTCxHQUFhLEVBQWI7QUFDQSxxQkFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlYLE9BQU9ZLE1BQTNCLEVBQW1DRCxHQUFuQyxFQUNBO0FBQ0ksd0JBQU1FLFNBQVNiLE9BQU9XLENBQVAsQ0FBZjtBQUNBLDBCQUFLRCxLQUFMLENBQVdDLENBQVgsSUFBZ0IsRUFBQ0csR0FBR0QsT0FBT0MsQ0FBWCxFQUFjQyxHQUFHRixPQUFPRSxDQUF4QixFQUFoQjtBQUNIO0FBQ0osYUFSRCxNQVVBO0FBQ0ksc0JBQUtMLEtBQUwsR0FBYSxFQUFDSSxHQUFHZCxPQUFPYyxDQUFYLEVBQWNDLEdBQUdmLE9BQU9lLENBQXhCLEVBQWI7QUFDSDtBQUNELGtCQUFLZCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxrQkFBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDSDtBQTlCTDtBQStCQzs7OzsrQkFHRDtBQUNJLGdCQUFNYyx5R0FBTjtBQUNBQSxpQkFBS04sS0FBTCxHQUFhLEtBQUtBLEtBQWxCO0FBQ0FNLGlCQUFLZixNQUFMLEdBQWMsS0FBS0EsTUFBbkI7QUFDQSxtQkFBT2UsSUFBUDtBQUNIOzs7NkJBRUlQLEssRUFDTDtBQUNJLCtHQUFXQSxLQUFYO0FBQ0EsaUJBQUtDLEtBQUwsR0FBYUQsTUFBS0MsS0FBbEI7QUFDQSxpQkFBS1QsTUFBTCxHQUFjUSxNQUFLUixNQUFuQjtBQUNIOzs7b0NBRVMsV0FDVjtBQUNJLGdCQUFNRCxTQUFTLEtBQUtBLE1BQXBCO0FBQ0EsZ0JBQU1VLFFBQVEsS0FBS0EsS0FBbkI7QUFDQSxnQkFBTVQsU0FBUyxLQUFLQSxNQUFwQjtBQUNBLGdCQUFJLEtBQUtNLEtBQVQsRUFDQTtBQUNJLG9CQUFNQyxPQUFPLEtBQUtBLElBQWxCO0FBQ0EscUJBQUssSUFBSUcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSCxLQUFLSSxNQUF6QixFQUFpQ0QsR0FBakMsRUFDQTtBQUNJLHdCQUFNWCxVQUFTUSxLQUFLRyxDQUFMLENBQWY7QUFDQSx3QkFBTU0sU0FBU1AsTUFBTUMsQ0FBTixDQUFmO0FBQ0FYLDRCQUFPYyxDQUFQLEdBQVdHLE9BQU9ILENBQVAsR0FBV0ksS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCbkIsTUFBaEIsR0FBeUIsQ0FBcEMsQ0FBWCxHQUFvREEsTUFBL0Q7QUFDQUQsNEJBQU9lLENBQVAsR0FBV0UsT0FBT0YsQ0FBUCxHQUFXRyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JuQixNQUFoQixHQUF5QixDQUFwQyxDQUFYLEdBQW9EQSxNQUEvRDtBQUNIO0FBQ0o7QUFDREQsbUJBQU9jLENBQVAsR0FBV0osTUFBTUksQ0FBTixHQUFVSSxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JuQixNQUFoQixHQUF5QixDQUFwQyxDQUFWLEdBQW1EQSxNQUE5RDtBQUNBRCxtQkFBT2UsQ0FBUCxHQUFXTCxNQUFNSyxDQUFOLEdBQVVHLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsTUFBTCxLQUFnQm5CLE1BQWhCLEdBQXlCLENBQXBDLENBQVYsR0FBbURBLE1BQTlEO0FBQ0g7OzsrQkFHRDtBQUNJLGdCQUFNRCxTQUFTLEtBQUtBLE1BQXBCO0FBQ0EsZ0JBQU1VLFFBQVEsS0FBS0EsS0FBbkI7QUFDQSxnQkFBSSxLQUFLSCxLQUFULEVBQ0E7QUFDSSxvQkFBTUMsT0FBTyxLQUFLQSxJQUFsQjtBQUNBLHFCQUFLLElBQUlHLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsS0FBS0ksTUFBekIsRUFBaUNELEdBQWpDLEVBQ0E7QUFDSSx3QkFBTVgsV0FBU1EsS0FBS0csQ0FBTCxDQUFmO0FBQ0Esd0JBQU1NLFNBQVNQLE1BQU1DLENBQU4sQ0FBZjtBQUNBWCw2QkFBT2MsQ0FBUCxHQUFXRyxPQUFPSCxDQUFsQjtBQUNBZCw2QkFBT2UsQ0FBUCxHQUFXRSxPQUFPRixDQUFsQjtBQUNIO0FBQ0osYUFWRCxNQVlBO0FBQ0lmLHVCQUFPYyxDQUFQLEdBQVdKLE1BQU1JLENBQWpCO0FBQ0FkLHVCQUFPZSxDQUFQLEdBQVdMLE1BQU1LLENBQWpCO0FBQ0g7QUFDSjs7OztFQWpHZWxCLEk7O0FBb0dwQndCLE9BQU9DLE9BQVAsR0FBaUJ2QixLQUFqQiIsImZpbGUiOiJzaGFrZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHdhaXQgPSByZXF1aXJlKCcuL3dhaXQnKVxuXG4vKipcbiAqIHNoYWtlcyBhbiBvYmplY3Qgb3IgbGlzdCBvZiBvYmplY3RzXG4gKi9cbmNsYXNzIHNoYWtlIGV4dGVuZHMgd2FpdFxue1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fGFycmF5fSBvYmplY3Qgb3IgbGlzdCBvZiBvYmplY3RzIHRvIHNoYWtlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFtb3VudCB0byBzaGFrZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiAoaW4gbWlsbGlzZWNvbmRzKSB0byBzaGFrZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIChzZWUgQW5pbWF0ZS53YWl0KVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9iamVjdCwgYW1vdW50LCBkdXJhdGlvbiwgb3B0aW9ucylcbiAgICB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICAgIHN1cGVyKG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgdGhpcy50eXBlID0gJ1NoYWtlJ1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmFycmF5ID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5saXN0ID0gb2JqZWN0XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMubG9hZClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5sb2FkKG9wdGlvbnMubG9hZClcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpc3QpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCA9IFtdXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3QubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBvYmplY3RbaV1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydFtpXSA9IHt4OiB0YXJnZXQueCwgeTogdGFyZ2V0Lnl9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQgPSB7eDogb2JqZWN0LngsIHk6IG9iamVjdC55fVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hbW91bnQgPSBhbW91bnRcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZSgpXG4gICAge1xuICAgICAgICBjb25zdCBzYXZlID0gc3VwZXIuc2F2ZSgpXG4gICAgICAgIHNhdmUuc3RhcnQgPSB0aGlzLnN0YXJ0XG4gICAgICAgIHNhdmUuYW1vdW50ID0gdGhpcy5hbW91bnRcbiAgICAgICAgcmV0dXJuIHNhdmVcbiAgICB9XG5cbiAgICBsb2FkKGxvYWQpXG4gICAge1xuICAgICAgICBzdXBlci5sb2FkKGxvYWQpXG4gICAgICAgIHRoaXMuc3RhcnQgPSBsb2FkLnN0YXJ0XG4gICAgICAgIHRoaXMuYW1vdW50ID0gbG9hZC5hbW91bnRcbiAgICB9XG5cbiAgICBjYWxjdWxhdGUoLyplbGFwc2VkKi8pXG4gICAge1xuICAgICAgICBjb25zdCBvYmplY3QgPSB0aGlzLm9iamVjdFxuICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhcnRcbiAgICAgICAgY29uc3QgYW1vdW50ID0gdGhpcy5hbW91bnRcbiAgICAgICAgaWYgKHRoaXMuYXJyYXkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmxpc3RcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3QgPSBsaXN0W2ldXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsID0gc3RhcnRbaV1cbiAgICAgICAgICAgICAgICBvYmplY3QueCA9IGFjdHVhbC54ICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYW1vdW50ICogMikgLSBhbW91bnRcbiAgICAgICAgICAgICAgICBvYmplY3QueSA9IGFjdHVhbC55ICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYW1vdW50ICogMikgLSBhbW91bnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvYmplY3QueCA9IHN0YXJ0LnggKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhbW91bnQgKiAyKSAtIGFtb3VudFxuICAgICAgICBvYmplY3QueSA9IHN0YXJ0LnkgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhbW91bnQgKiAyKSAtIGFtb3VudFxuICAgIH1cblxuICAgIGRvbmUoKVxuICAgIHtcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gdGhpcy5vYmplY3RcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0XG4gICAgICAgIGlmICh0aGlzLmFycmF5KVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5saXN0XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqZWN0ID0gbGlzdFtpXVxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbCA9IHN0YXJ0W2ldXG4gICAgICAgICAgICAgICAgb2JqZWN0LnggPSBhY3R1YWwueFxuICAgICAgICAgICAgICAgIG9iamVjdC55ID0gYWN0dWFsLnlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9iamVjdC54ID0gc3RhcnQueFxuICAgICAgICAgICAgb2JqZWN0LnkgPSBzdGFydC55XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hha2UiXX0=

/***/ }),

/***/ 209:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var wait = __webpack_require__(203);

/** move an object to a target's location */

var target = function (_wait) {
    _inherits(target, _wait);

    /**
     * move to a target
     * @param {object} object - object to animate
     * @param {object} target - object needs to contain {x: x, y: y}
     * @param {number} speed - number of pixels to move per millisecond
     * @param {object} [options] @see {@link Wait}
     * @param {boolean} [options.keepAlive] don't cancel the animation when target is reached
     */
    function target(object, _target, speed, options) {
        _classCallCheck(this, target);

        options = options || {};

        var _this = _possibleConstructorReturn(this, (target.__proto__ || Object.getPrototypeOf(target)).call(this, object, options));

        _this.type = 'Target';
        _this.target = _target;
        if (options.load) {
            _this.load(options.load);
        } else {
            _this.speed = speed;
        }
        return _this;
    }

    _createClass(target, [{
        key: 'save',
        value: function save() {
            var save = _get(target.prototype.__proto__ || Object.getPrototypeOf(target.prototype), 'save', this).call(this);
            save.speed = this.speed;
            save.keepAlive = this.options.keepAlive;
            return save;
        }
    }, {
        key: 'load',
        value: function load(_load) {
            _get(target.prototype.__proto__ || Object.getPrototypeOf(target.prototype), 'load', this).call(this, _load);
            this.speed = _load.speed;
            this.options.keepAlive = _load.keepAlive;
        }
    }, {
        key: 'calculate',
        value: function calculate(elapsed) {
            var deltaX = this.target.x - this.object.x;
            var deltaY = this.target.y - this.object.y;
            if (deltaX === 0 && deltaY === 0) {
                this.emit('done', this.object);
                if (!this.options.keepAlive) {
                    return true;
                }
            } else {
                var angle = Math.atan2(deltaY, deltaX);
                this.object.x += Math.cos(angle) * elapsed * this.speed;
                this.object.y += Math.sin(angle) * elapsed * this.speed;
                if (deltaX >= 0 !== this.target.x - this.object.x >= 0) {
                    this.object.x = this.target.x;
                }
                if (deltaY >= 0 !== this.target.y - this.object.y >= 0) {
                    this.object.y = this.target.y;
                }
            }
        }
    }]);

    return target;
}(wait);

module.exports = target;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90YXJnZXQuanMiXSwibmFtZXMiOlsid2FpdCIsInJlcXVpcmUiLCJ0YXJnZXQiLCJvYmplY3QiLCJzcGVlZCIsIm9wdGlvbnMiLCJ0eXBlIiwibG9hZCIsInNhdmUiLCJrZWVwQWxpdmUiLCJlbGFwc2VkIiwiZGVsdGFYIiwieCIsImRlbHRhWSIsInkiLCJlbWl0IiwiYW5nbGUiLCJNYXRoIiwiYXRhbjIiLCJjb3MiLCJzaW4iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxPQUFPQyxRQUFRLFFBQVIsQ0FBYjs7QUFFQTs7SUFDTUMsTTs7O0FBRUY7Ozs7Ozs7O0FBUUEsb0JBQVlDLE1BQVosRUFBb0JELE9BQXBCLEVBQTRCRSxLQUE1QixFQUFtQ0MsT0FBbkMsRUFDQTtBQUFBOztBQUNJQSxrQkFBVUEsV0FBVyxFQUFyQjs7QUFESixvSEFFVUYsTUFGVixFQUVrQkUsT0FGbEI7O0FBR0ksY0FBS0MsSUFBTCxHQUFZLFFBQVo7QUFDQSxjQUFLSixNQUFMLEdBQWNBLE9BQWQ7QUFDQSxZQUFJRyxRQUFRRSxJQUFaLEVBQ0E7QUFDSSxrQkFBS0EsSUFBTCxDQUFVRixRQUFRRSxJQUFsQjtBQUNILFNBSEQsTUFLQTtBQUNJLGtCQUFLSCxLQUFMLEdBQWFBLEtBQWI7QUFDSDtBQVpMO0FBYUM7Ozs7K0JBR0Q7QUFDSSxnQkFBTUksMkdBQU47QUFDQUEsaUJBQUtKLEtBQUwsR0FBYSxLQUFLQSxLQUFsQjtBQUNBSSxpQkFBS0MsU0FBTCxHQUFpQixLQUFLSixPQUFMLENBQWFJLFNBQTlCO0FBQ0EsbUJBQU9ELElBQVA7QUFDSDs7OzZCQUVJRCxLLEVBQ0w7QUFDSSxpSEFBV0EsS0FBWDtBQUNBLGlCQUFLSCxLQUFMLEdBQWFHLE1BQUtILEtBQWxCO0FBQ0EsaUJBQUtDLE9BQUwsQ0FBYUksU0FBYixHQUF5QkYsTUFBS0UsU0FBOUI7QUFDSDs7O2tDQUVTQyxPLEVBQ1Y7QUFDSSxnQkFBTUMsU0FBUyxLQUFLVCxNQUFMLENBQVlVLENBQVosR0FBZ0IsS0FBS1QsTUFBTCxDQUFZUyxDQUEzQztBQUNBLGdCQUFNQyxTQUFTLEtBQUtYLE1BQUwsQ0FBWVksQ0FBWixHQUFnQixLQUFLWCxNQUFMLENBQVlXLENBQTNDO0FBQ0EsZ0JBQUlILFdBQVcsQ0FBWCxJQUFnQkUsV0FBVyxDQUEvQixFQUNBO0FBQ0kscUJBQUtFLElBQUwsQ0FBVSxNQUFWLEVBQWtCLEtBQUtaLE1BQXZCO0FBQ0Esb0JBQUksQ0FBQyxLQUFLRSxPQUFMLENBQWFJLFNBQWxCLEVBQ0E7QUFDSSwyQkFBTyxJQUFQO0FBQ0g7QUFDSixhQVBELE1BU0E7QUFDSSxvQkFBTU8sUUFBUUMsS0FBS0MsS0FBTCxDQUFXTCxNQUFYLEVBQW1CRixNQUFuQixDQUFkO0FBQ0EscUJBQUtSLE1BQUwsQ0FBWVMsQ0FBWixJQUFpQkssS0FBS0UsR0FBTCxDQUFTSCxLQUFULElBQWtCTixPQUFsQixHQUE0QixLQUFLTixLQUFsRDtBQUNBLHFCQUFLRCxNQUFMLENBQVlXLENBQVosSUFBaUJHLEtBQUtHLEdBQUwsQ0FBU0osS0FBVCxJQUFrQk4sT0FBbEIsR0FBNEIsS0FBS04sS0FBbEQ7QUFDQSxvQkFBS08sVUFBVSxDQUFYLEtBQW9CLEtBQUtULE1BQUwsQ0FBWVUsQ0FBWixHQUFnQixLQUFLVCxNQUFMLENBQVlTLENBQTdCLElBQW1DLENBQTFELEVBQ0E7QUFDSSx5QkFBS1QsTUFBTCxDQUFZUyxDQUFaLEdBQWdCLEtBQUtWLE1BQUwsQ0FBWVUsQ0FBNUI7QUFDSDtBQUNELG9CQUFLQyxVQUFVLENBQVgsS0FBb0IsS0FBS1gsTUFBTCxDQUFZWSxDQUFaLEdBQWdCLEtBQUtYLE1BQUwsQ0FBWVcsQ0FBN0IsSUFBbUMsQ0FBMUQsRUFDQTtBQUNJLHlCQUFLWCxNQUFMLENBQVlXLENBQVosR0FBZ0IsS0FBS1osTUFBTCxDQUFZWSxDQUE1QjtBQUNIO0FBQ0o7QUFDSjs7OztFQW5FZ0JkLEk7O0FBc0VyQnFCLE9BQU9DLE9BQVAsR0FBaUJwQixNQUFqQiIsImZpbGUiOiJ0YXJnZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB3YWl0ID0gcmVxdWlyZSgnLi93YWl0JylcblxuLyoqIG1vdmUgYW4gb2JqZWN0IHRvIGEgdGFyZ2V0J3MgbG9jYXRpb24gKi9cbmNsYXNzIHRhcmdldCBleHRlbmRzIHdhaXRcbntcbiAgICAvKipcbiAgICAgKiBtb3ZlIHRvIGEgdGFyZ2V0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCAtIG9iamVjdCB0byBhbmltYXRlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldCAtIG9iamVjdCBuZWVkcyB0byBjb250YWluIHt4OiB4LCB5OiB5fVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCAtIG51bWJlciBvZiBwaXhlbHMgdG8gbW92ZSBwZXIgbWlsbGlzZWNvbmRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdIEBzZWUge0BsaW5rIFdhaXR9XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5rZWVwQWxpdmVdIGRvbid0IGNhbmNlbCB0aGUgYW5pbWF0aW9uIHdoZW4gdGFyZ2V0IGlzIHJlYWNoZWRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvYmplY3QsIHRhcmdldCwgc3BlZWQsIG9wdGlvbnMpXG4gICAge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgICAgICBzdXBlcihvYmplY3QsIG9wdGlvbnMpXG4gICAgICAgIHRoaXMudHlwZSA9ICdUYXJnZXQnXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAgIGlmIChvcHRpb25zLmxvYWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubG9hZChvcHRpb25zLmxvYWQpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmUoKVxuICAgIHtcbiAgICAgICAgY29uc3Qgc2F2ZSA9IHN1cGVyLnNhdmUoKVxuICAgICAgICBzYXZlLnNwZWVkID0gdGhpcy5zcGVlZFxuICAgICAgICBzYXZlLmtlZXBBbGl2ZSA9IHRoaXMub3B0aW9ucy5rZWVwQWxpdmVcbiAgICAgICAgcmV0dXJuIHNhdmVcbiAgICB9XG5cbiAgICBsb2FkKGxvYWQpXG4gICAge1xuICAgICAgICBzdXBlci5sb2FkKGxvYWQpXG4gICAgICAgIHRoaXMuc3BlZWQgPSBsb2FkLnNwZWVkXG4gICAgICAgIHRoaXMub3B0aW9ucy5rZWVwQWxpdmUgPSBsb2FkLmtlZXBBbGl2ZVxuICAgIH1cblxuICAgIGNhbGN1bGF0ZShlbGFwc2VkKVxuICAgIHtcbiAgICAgICAgY29uc3QgZGVsdGFYID0gdGhpcy50YXJnZXQueCAtIHRoaXMub2JqZWN0LnhcbiAgICAgICAgY29uc3QgZGVsdGFZID0gdGhpcy50YXJnZXQueSAtIHRoaXMub2JqZWN0LnlcbiAgICAgICAgaWYgKGRlbHRhWCA9PT0gMCAmJiBkZWx0YVkgPT09IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnZG9uZScsIHRoaXMub2JqZWN0KVxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMua2VlcEFsaXZlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IE1hdGguYXRhbjIoZGVsdGFZLCBkZWx0YVgpXG4gICAgICAgICAgICB0aGlzLm9iamVjdC54ICs9IE1hdGguY29zKGFuZ2xlKSAqIGVsYXBzZWQgKiB0aGlzLnNwZWVkXG4gICAgICAgICAgICB0aGlzLm9iamVjdC55ICs9IE1hdGguc2luKGFuZ2xlKSAqIGVsYXBzZWQgKiB0aGlzLnNwZWVkXG4gICAgICAgICAgICBpZiAoKGRlbHRhWCA+PSAwKSAhPT0gKCh0aGlzLnRhcmdldC54IC0gdGhpcy5vYmplY3QueCkgPj0gMCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3QueCA9IHRoaXMudGFyZ2V0LnhcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoZGVsdGFZID49IDApICE9PSAoKHRoaXMudGFyZ2V0LnkgLSB0aGlzLm9iamVjdC55KSA+PSAwKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC55ID0gdGhpcy50YXJnZXQueVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRhcmdldCJdfQ==

/***/ }),

/***/ 210:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Color = __webpack_require__(226);
var wait = __webpack_require__(203);

var tint = function (_wait) {
    _inherits(tint, _wait);

    /**
     * @param {PIXI.DisplayObject|PIXI.DisplayObject[]} object
     * @param {number|number[]} tint
     * @param {number} [duration] in milliseconds
     * @param {object} [options] @see {@link Wait}
     */
    function tint(object, _tint, duration, options) {
        _classCallCheck(this, tint);

        options = options || {};

        var _this = _possibleConstructorReturn(this, (tint.__proto__ || Object.getPrototypeOf(tint)).call(this, object, options));

        _this.type = 'Tint';
        if (Array.isArray(object)) {
            _this.list = object;
            _this.object = _this.list[0];
        }
        _this.duration = duration;
        if (options.load) {
            _this.load(options.load);
        } else if (Array.isArray(_tint)) {
            _this.tints = [_this.object.tint].concat(_toConsumableArray(_tint));
        } else {
            _this.start = _this.object.tint;
            _this.to = _tint;
        }
        return _this;
    }

    _createClass(tint, [{
        key: 'save',
        value: function save() {
            var save = _get(tint.prototype.__proto__ || Object.getPrototypeOf(tint.prototype), 'save', this).call(this);
            save.start = this.start;
            save.to = this.to;
            return save;
        }
    }, {
        key: 'load',
        value: function load(_load) {
            _get(tint.prototype.__proto__ || Object.getPrototypeOf(tint.prototype), 'load', this).call(this, _load);
            this.start = _load.start;
            this.to = _load.to;
        }
    }, {
        key: 'calculate',
        value: function calculate() {
            var percent = this.options.ease(this.time, 0, 1, this.duration);
            if (this.tints) {
                var each = 1 / (this.tints.length - 1);
                var per = each;
                for (var i = 1; i < this.tints.length; i++) {
                    if (percent <= per) {
                        var color = Color.blend(1 - (per - percent) / each, this.tints[i - 1], this.tints[i]);
                        if (this.list) {
                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = this.list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var object = _step.value;

                                    object.tint = color;
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                        } else {
                            this.object.tint = color;
                        }
                        break;
                    }
                    per += each;
                }
            } else {
                var _color = Color.blend(percent, this.start, this.to);
                if (this.list) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = this.list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _object = _step2.value;

                            _object.tint = _color;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                } else {
                    this.object.tint = _color;
                }
            }
        }
    }, {
        key: 'reverse',
        value: function reverse() {
            if (this.tints) {
                var tints = [];
                for (var i = this.tints.length - 1; i >= 0; i--) {
                    tints.push(this.tints[i]);
                }
                this.tints = tints;
            } else {
                var swap = this.to;
                this.to = this.start;
                this.start = swap;
            }
        }
    }]);

    return tint;
}(wait);

module.exports = tint;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90aW50LmpzIl0sIm5hbWVzIjpbIkNvbG9yIiwicmVxdWlyZSIsIndhaXQiLCJ0aW50Iiwib2JqZWN0IiwiZHVyYXRpb24iLCJvcHRpb25zIiwidHlwZSIsIkFycmF5IiwiaXNBcnJheSIsImxpc3QiLCJsb2FkIiwidGludHMiLCJzdGFydCIsInRvIiwic2F2ZSIsInBlcmNlbnQiLCJlYXNlIiwidGltZSIsImVhY2giLCJsZW5ndGgiLCJwZXIiLCJpIiwiY29sb3IiLCJibGVuZCIsInB1c2giLCJzd2FwIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLFVBQVIsQ0FBZDtBQUNBLElBQU1DLE9BQU9ELFFBQVEsUUFBUixDQUFiOztJQUVNRSxJOzs7QUFFRjs7Ozs7O0FBTUEsa0JBQVlDLE1BQVosRUFBb0JELEtBQXBCLEVBQTBCRSxRQUExQixFQUFvQ0MsT0FBcEMsRUFDQTtBQUFBOztBQUNJQSxrQkFBVUEsV0FBVyxFQUFyQjs7QUFESixnSEFFVUYsTUFGVixFQUVrQkUsT0FGbEI7O0FBR0ksY0FBS0MsSUFBTCxHQUFZLE1BQVo7QUFDQSxZQUFJQyxNQUFNQyxPQUFOLENBQWNMLE1BQWQsQ0FBSixFQUNBO0FBQ0ksa0JBQUtNLElBQUwsR0FBWU4sTUFBWjtBQUNBLGtCQUFLQSxNQUFMLEdBQWMsTUFBS00sSUFBTCxDQUFVLENBQVYsQ0FBZDtBQUNIO0FBQ0QsY0FBS0wsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxZQUFJQyxRQUFRSyxJQUFaLEVBQ0E7QUFDSSxrQkFBS0EsSUFBTCxDQUFVTCxRQUFRSyxJQUFsQjtBQUNILFNBSEQsTUFJSyxJQUFJSCxNQUFNQyxPQUFOLENBQWNOLEtBQWQsQ0FBSixFQUNMO0FBQ0ksa0JBQUtTLEtBQUwsSUFBYyxNQUFLUixNQUFMLENBQVlELElBQTFCLDRCQUFtQ0EsS0FBbkM7QUFDSCxTQUhJLE1BS0w7QUFDSSxrQkFBS1UsS0FBTCxH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O0VBL0djeEIsSTs7QUFrSG5CeUIsT0FBT0MsT0FBUCxHQUFpQnpCLElBQWpCIiwiZmlsZSI6InRpbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBDb2xvciA9IHJlcXVpcmUoJ3l5LWNvbG9yJylcbmNvbnN0IHdhaXQgPSByZXF1aXJlKCcuL3dhaXQnKVxuXG5jbGFzcyB0aW50IGV4dGVuZHMgd2FpdFxue1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7UElYSS5EaXNwbGF5T2JqZWN0fFBJWEkuRGlzcGxheU9iamVjdFtdfSBvYmplY3RcbiAgICAgKiBAcGFyYW0ge251bWJlcnxudW1iZXJbXX0gdGludFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb25dIGluIG1pbGxpc2Vjb25kc1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gQHNlZSB7QGxpbmsgV2FpdH1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvYmplY3QsIHRpbnQsIGR1cmF0aW9uLCBvcHRpb25zKVxuICAgIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgICAgc3VwZXIob2JqZWN0LCBvcHRpb25zKVxuICAgICAgICB0aGlzLnR5cGUgPSAnVGludCdcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0KSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5saXN0ID0gb2JqZWN0XG4gICAgICAgICAgICB0aGlzLm9iamVjdCA9IHRoaXMubGlzdFswXVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvblxuICAgICAgICBpZiAob3B0aW9ucy5sb2FkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmxvYWQob3B0aW9ucy5sb2FkKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGludCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMudGludHMgPSBbdGhpcy5vYmplY3QudGludCwgLi4udGludF1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSB0aGlzLm9iamVjdC50aW50XG4gICAgICAgICAgICB0aGlzLnRvID0gdGludFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZSgpXG4gICAge1xuICAgICAgICBjb25zdCBzYXZlID0gc3VwZXIuc2F2ZSgpXG4gICAgICAgIHNhdmUuc3RhcnQgPSB0aGlzLnN0YXJ0XG4gICAgICAgIHNhdmUudG8gPSB0aGlzLnRvXG4gICAgICAgIHJldHVybiBzYXZlXG4gICAgfVxuXG4gICAgbG9hZChsb2FkKVxuICAgIHtcbiAgICAgICAgc3VwZXIubG9hZChsb2FkKVxuICAgICAgICB0aGlzLnN0YXJ0ID0gbG9hZC5zdGFydFxuICAgICAgICB0aGlzLnRvID0gbG9hZC50b1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZSgpXG4gICAge1xuICAgICAgICBjb25zdCBwZXJjZW50ID0gdGhpcy5vcHRpb25zLmVhc2UodGhpcy50aW1lLCAwLCAxLCB0aGlzLmR1cmF0aW9uKVxuICAgICAgICBpZiAodGhpcy50aW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgZWFjaCA9IDEgLyAodGhpcy50aW50cy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgbGV0IHBlciA9IGVhY2hcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy50aW50cy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudCA8PSBwZXIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IENvbG9yLmJsZW5kKDEgLSAocGVyIC0gcGVyY2VudCkgLyBlYWNoLCB0aGlzLnRpbnRzW2kgLSAxXSwgdGhpcy50aW50c1tpXSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGlzdClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgb2JqZWN0IG9mIHRoaXMubGlzdClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QudGludCA9IGNvbG9yXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdC50aW50ID0gY29sb3JcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVyICs9IGVhY2hcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gQ29sb3IuYmxlbmQocGVyY2VudCwgdGhpcy5zdGFydCwgdGhpcy50bylcbiAgICAgICAgICAgIGlmICh0aGlzLmxpc3QpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgb2JqZWN0IG9mIHRoaXMubGlzdClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC50aW50ID0gY29sb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3QudGludCA9IGNvbG9yXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXZlcnNlKClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLnRpbnRzKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCB0aW50cyA9IFtdXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gdGhpcy50aW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aW50cy5wdXNoKHRoaXMudGludHNbaV0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRpbnRzID0gdGludHNcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHN3YXAgPSB0aGlzLnRvXG4gICAgICAgICAgICB0aGlzLnRvID0gdGhpcy5zdGFydFxuICAgICAgICAgICAgdGhpcy5zdGFydCA9IHN3YXBcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aW50Il19

/***/ }),

/***/ 211:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var wait = __webpack_require__(203);

/** animate any numeric parameter of an object or array of objects */

var to = function (_wait) {
    _inherits(to, _wait);

    /**
     * @private
     * @param {object} object to animate
     * @param {object} goto - parameters to animate, e.g.: {alpha: 5, scale: {3, 5}, scale: 5, rotation: Math.PI}
     * @param {number} duration - time to run
     * @param {object} [options]
     * @param {number} [options.wait=0] n milliseconds before starting animation (can also be used to pause animation for a length of time)
     * @param {boolean} [options.pause] start the animation paused
     * @param {boolean|number} [options.repeat] true: repeat animation forever n: repeat animation n times
     * @param {boolean|number} [options.reverse] true: reverse animation (if combined with repeat, then pulse) n: reverse animation n times
     * @param {Function} [options.load] loads an animation using an .save() object note the * parameters below cannot be loaded and must be re-set
     * @param {string|Function} [options.ease] name or function from easing.js (see http://easings.net for examples)
     * @emits to:done animation expires
     * @emits to:wait each update during a wait
     * @emits to:first first update when animation starts
     * @emits to:each each update while animation is running
     * @emits to:loop when animation is repeated
     * @emits to:reverse when animation is reversed
     */
    function to(object, goto, duration, options) {
        _classCallCheck(this, to);

        options = options || {};

        var _this = _possibleConstructorReturn(this, (to.__proto__ || Object.getPrototypeOf(to)).call(this, object, options));

        _this.type = 'To';
        if (Array.isArray(object)) {
            _this.list = object;
            _this.object = _this.list[0];
        }
        if (options.load) {
            _this.load(options.load);
        } else {
            _this.goto = goto;
            _this.fixScale();
            _this.duration = duration;
            _this.restart();
        }
        return _this;
    }

    /**
     * converts scale from { scale: n } to { scale: { x: n, y: n }}
     * @private
     */


    _createClass(to, [{
        key: 'fixScale',
        value: function fixScale() {
            if (typeof this.goto['scale'] !== 'undefined' && !Number.isNaN(this.goto['scale'])) {
                this.goto['scale'] = { x: this.goto['scale'], y: this.goto['scale'] };
            }
        }
    }, {
        key: 'save',
        value: function save() {
            var save = _get(to.prototype.__proto__ || Object.getPrototypeOf(to.prototype), 'save', this).call(this);
            save.goto = this.goto;
            save.start = this.start;
            save.delta = this.delta;
            save.keys = this.keys;
            return save;
        }
    }, {
        key: 'load',
        value: function load(_load) {
            _get(to.prototype.__proto__ || Object.getPrototypeOf(to.prototype), 'load', this).call(this, _load);
            this.goto = _load.goto;
            this.start = _load.start;
            this.delta = _load.delta;
            this.keys = _load.keys;
        }
    }, {
        key: 'restart',
        value: function restart() {
            var i = 0;
            var start = this.start = [];
            var delta = this.delta = [];
            var keys = this.keys = [];
            var goto = this.goto;
            var object = this.object;

            // loops through all keys in goto object
            for (var key in goto) {

                // handles keys with one additional level e.g.: goto = {scale: {x: 5, y: 3}}
                if (isNaN(goto[key])) {
                    keys[i] = { key: key, children: [] };
                    start[i] = [];
                    delta[i] = [];
                    var j = 0;
                    for (var key2 in goto[key]) {
                        keys[i].children[j] = key2;
                        start[i][j] = parseFloat(object[key][key2]);
                        start[i][j] = this._correctDOM(key2, start[i][j]);
                        start[i][j] = isNaN(this.start[i][j]) ? 0 : start[i][j];
                        delta[i][j] = goto[key][key2] - start[i][j];
                        j++;
                    }
                } else {
                    start[i] = parseFloat(object[key]);
                    start[i] = this._correctDOM(key, start[i]);
                    start[i] = isNaN(this.start[i]) ? 0 : start[i];
                    delta[i] = goto[key] - start[i];
                    keys[i] = key;
                }
                i++;
            }
            this.time = 0;
        }
    }, {
        key: 'reverse',
        value: function reverse() {
            var object = this.object;
            var keys = this.keys;
            var goto = this.goto;
            var delta = this.delta;
            var start = this.start;

            for (var i = 0, _i = keys.length; i < _i; i++) {
                var key = keys[i];
                if (isNaN(goto[key])) {
                    for (var j = 0, _j = key.children.length; j < _j; j++) {
                        delta[i][j] = -delta[i][j];
                        start[i][j] = parseFloat(object[key.key][key.children[j]]);
                        start[i][j] = isNaN(start[i][j]) ? 0 : start[i][j];
                    }
                } else {
                    delta[i] = -delta[i];
                    start[i] = parseFloat(object[key]);
                    start[i] = isNaN(start[i]) ? 0 : start[i];
                }
            }
        }
    }, {
        key: 'calculate',
        value: function calculate() /*elapsed*/{
            var object = this.object;
            var list = this.list;
            var keys = this.keys;
            var goto = this.goto;
            var time = this.time;
            var start = this.start;
            var delta = this.delta;
            var duration = this.duration;
            var ease = this.options.ease;
            for (var i = 0, _i = this.keys.length; i < _i; i++) {
                var key = keys[i];
                if (isNaN(goto[key])) {
                    var key1 = key.key;
                    for (var j = 0, _j = key.children.length; j < _j; j++) {
                        var key2 = key.children[j];
                        var others = object[key1][key2] = time >= duration ? start[i][j] + delta[i][j] : ease(time, start[i][j], delta[i][j], duration);
                        if (list) {
                            for (var k = 1, _k = list.length; k < _k; k++) {
                                list[k][key1][key2] = others;
                            }
                        }
                    }
                } else {
                    var _key = keys[i];
                    var _others = object[_key] = time >= duration ? start[i] + delta[i] : ease(time, start[i], delta[i], duration);
                    if (list) {
                        for (var _j2 = 1, _j3 = this.list.length; _j2 < _j3; _j2++) {
                            list[_j2][_key] = _others;
                        }
                    }
                }
            }
        }
    }]);

    return to;
}(wait);

module.exports = to;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90by5qcyJdLCJuYW1lcyI6WyJ3YWl0IiwicmVxdWlyZSIsInRvIiwib2JqZWN0IiwiZ290byIsImR1cmF0aW9uIiwib3B0aW9ucyIsInR5cGUiLCJBcnJheSIsImlzQXJyYXkiLCJsaXN0IiwibG9hZCIsImZpeFNjYWxlIiwicmVzdGFydCIsIk51bWJlciIsImlzTmFOIiwieCIsInkiLCJzYXZlIiwic3RhcnQiLCJkZWx0YSIsImtleXMiLCJpIiwia2V5IiwiY2hpbGRyZW4iLCJqIiwia2V5MiIsInBhcnNlRmxvYXQiLCJfY29ycmVjdERPTSIsInRpbWUiLCJfaSIsImxlbmd0aCIsIl9qIiwiZWFzZSIsImtleTEiLCJvdGhlcnMiLCJrIiwiX2siLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxPQUFPQyxRQUFRLFFBQVIsQ0FBYjs7QUFFQTs7SUFDTUMsRTs7O0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsZ0JBQVlDLE1BQVosRUFBb0JDLElBQXBCLEVBQTBCQyxRQUExQixFQUFvQ0MsT0FBcEMsRUFDQTtBQUFBOztBQUNJQSxrQkFBVUEsV0FBVyxFQUFyQjs7QUFESiw0R0FFVUgsTUFGVixFQUVrQkcsT0FGbEI7O0FBR0ksY0FBS0MsSUFBTCxHQUFZLElBQVo7QUFDQSxZQUFJQyxNQUFNQyxPQUFOLENBQWNOLE1BQWQsQ0FBSixFQUNBO0FBQ0ksa0JBQUtPLElBQUwsR0FBWVAsTUFBWjtBQUNBLGtCQUFLQSxNQUFMLEdBQWMsTUFBS08sSUFBTCxDQUFVLENBQVYsQ0FBZDtBQUNIO0FBQ0QsWUFBSUosUUFBUUssSUFBWixFQUNBO0FBQ0ksa0JBQUtBLElBQUwsQ0FBVUwsUUFBUUssSUFBbEI7QUFDSCxTQUhELE1BS0E7QUFDSSxrQkFBS1AsSUFBTCxHQUFZQSxJQUFaO0FBQ0Esa0JBQUtRLFFBQUw7QUFDQSxrQkFBS1AsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxrQkFBS1EsT0FBTDtB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LFFBQVQsR0FBcUJjLE1BQU1HLENBQU4sRUFBU0csQ0FBVCxJQUFjTCxNQUFNRSxDQUFOLEVBQVNHLENBQVQsQ0FBbkMsR0FBaURRLEtBQUtKLElBQUwsRUFBV1YsTUFBTUcsQ0FBTixFQUFTRyxDQUFULENBQVgsRUFBd0JMLE1BQU1FLENBQU4sRUFBU0csQ0FBVCxDQUF4QixFQUFxQ3BCLFFBQXJDLENBQXJGO0FBQ0EsNEJBQUlLLElBQUosRUFDQTtBQUNJLGlDQUFLLElBQUkwQixJQUFJLENBQVIsRUFBV0MsS0FBSzNCLEtBQUtxQixNQUExQixFQUFrQ0ssSUFBSUMsRUFBdEMsRUFBMENELEdBQTFDLEVBQ0E7QUFDSTFCLHFDQUFLMEIsQ0FBTCxFQUFRRixJQUFSLEVBQWNSLElBQWQsSUFBc0JTLE1BQXRCO0FBQ0g7QUFDSjtBQUNKO0FBQ0osaUJBZkQsTUFpQkE7QUFDSSx3QkFBTVosT0FBTUYsS0FBS0MsQ0FBTCxDQUFaO0FBQ0Esd0JBQU1hLFVBQVNoQyxPQUFPb0IsSUFBUCxJQUFlTSxRQUFReEIsUUFBVCxHQUFxQmMsTUFBTUcsQ0FBTixJQUFXRixNQUFNRSxDQUFOLENBQWhDLEdBQTJDVyxLQUFLSixJQUFMLEVBQVdWLE1BQU1HLENBQU4sQ0FBWCxFQUFxQkYsTUFBTUUsQ0FBTixDQUFyQixFQUErQmpCLFFBQS9CLENBQXhFO0FBQ0Esd0JBQUlLLElBQUosRUFDQTtBQUNJLDZCQUFLLElBQUllLE1BQUksQ0FBUixFQUFXTyxNQUFLLEtBQUt0QixJQUFMLENBQVVxQixNQUEvQixFQUF1Q04sTUFBSU8sR0FBM0MsRUFBK0NQLEtBQS9DLEVBQ0E7QUFDSWYsaUNBQUtlLEdBQUwsRUFBUUYsSUFBUixJQUFlWSxPQUFmO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDSjs7OztFQTlMWW5DLEk7O0FBaU1qQnNDLE9BQU9DLE9BQVAsR0FBaUJyQyxFQUFqQiIsImZpbGUiOiJ0by5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHdhaXQgPSByZXF1aXJlKCcuL3dhaXQnKVxyXG5cclxuLyoqIGFuaW1hdGUgYW55IG51bWVyaWMgcGFyYW1ldGVyIG9mIGFuIG9iamVjdCBvciBhcnJheSBvZiBvYmplY3RzICovXHJcbmNsYXNzIHRvIGV4dGVuZHMgd2FpdFxyXG57XHJcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IHRvIGFuaW1hdGVcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBnb3RvIC0gcGFyYW1ldGVycyB0byBhbmltYXRlLCBlLmcuOiB7YWxwaGE6IDUsIHNjYWxlOiB7MywgNX0sIHNjYWxlOiA1LCByb3RhdGlvbjogTWF0aC5QSX1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiAtIHRpbWUgdG8gcnVuXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMud2FpdD0wXSBuIG1pbGxpc2Vjb25kcyBiZWZvcmUgc3RhcnRpbmcgYW5pbWF0aW9uIChjYW4gYWxzbyBiZSB1c2VkIHRvIHBhdXNlIGFuaW1hdGlvbiBmb3IgYSBsZW5ndGggb2YgdGltZSlcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMucGF1c2VdIHN0YXJ0IHRoZSBhbmltYXRpb24gcGF1c2VkXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW58bnVtYmVyfSBbb3B0aW9ucy5yZXBlYXRdIHRydWU6IHJlcGVhdCBhbmltYXRpb24gZm9yZXZlciBuOiByZXBlYXQgYW5pbWF0aW9uIG4gdGltZXNcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbnxudW1iZXJ9IFtvcHRpb25zLnJldmVyc2VdIHRydWU6IHJldmVyc2UgYW5pbWF0aW9uIChpZiBjb21iaW5lZCB3aXRoIHJlcGVhdCwgdGhlbiBwdWxzZSkgbjogcmV2ZXJzZSBhbmltYXRpb24gbiB0aW1lc1xyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMubG9hZF0gbG9hZHMgYW4gYW5pbWF0aW9uIHVzaW5nIGFuIC5zYXZlKCkgb2JqZWN0IG5vdGUgdGhlICogcGFyYW1ldGVycyBiZWxvdyBjYW5ub3QgYmUgbG9hZGVkIGFuZCBtdXN0IGJlIHJlLXNldFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8RnVuY3Rpb259IFtvcHRpb25zLmVhc2VdIG5hbWUgb3IgZnVuY3Rpb24gZnJvbSBlYXNpbmcuanMgKHNlZSBodHRwOi8vZWFzaW5ncy5uZXQgZm9yIGV4YW1wbGVzKVxyXG4gICAgICogQGVtaXRzIHRvOmRvbmUgYW5pbWF0aW9uIGV4cGlyZXNcclxuICAgICAqIEBlbWl0cyB0bzp3YWl0IGVhY2ggdXBkYXRlIGR1cmluZyBhIHdhaXRcclxuICAgICAqIEBlbWl0cyB0bzpmaXJzdCBmaXJzdCB1cGRhdGUgd2hlbiBhbmltYXRpb24gc3RhcnRzXHJcbiAgICAgKiBAZW1pdHMgdG86ZWFjaCBlYWNoIHVwZGF0ZSB3aGlsZSBhbmltYXRpb24gaXMgcnVubmluZ1xyXG4gICAgICogQGVtaXRzIHRvOmxvb3Agd2hlbiBhbmltYXRpb24gaXMgcmVwZWF0ZWRcclxuICAgICAqIEBlbWl0cyB0bzpyZXZlcnNlIHdoZW4gYW5pbWF0aW9uIGlzIHJldmVyc2VkXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9iamVjdCwgZ290bywgZHVyYXRpb24sIG9wdGlvbnMpXHJcbiAgICB7XHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cclxuICAgICAgICBzdXBlcihvYmplY3QsIG9wdGlvbnMpXHJcbiAgICAgICAgdGhpcy50eXBlID0gJ1RvJ1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxpc3QgPSBvYmplY3RcclxuICAgICAgICAgICAgdGhpcy5vYmplY3QgPSB0aGlzLmxpc3RbMF1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMubG9hZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZChvcHRpb25zLmxvYWQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ290byA9IGdvdG9cclxuICAgICAgICAgICAgdGhpcy5maXhTY2FsZSgpXHJcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvblxyXG4gICAgICAgICAgICB0aGlzLnJlc3RhcnQoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNvbnZlcnRzIHNjYWxlIGZyb20geyBzY2FsZTogbiB9IHRvIHsgc2NhbGU6IHsgeDogbiwgeTogbiB9fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgZml4U2NhbGUoKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5nb3RvWydzY2FsZSddICE9PSAndW5kZWZpbmVkJyAmJiAhTnVtYmVyLmlzTmFOKHRoaXMuZ290b1snc2NhbGUnXSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmdvdG9bJ3NjYWxlJ10gPSB7eDogdGhpcy5nb3RvWydzY2FsZSddLCB5OiB0aGlzLmdvdG9bJ3NjYWxlJ119XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNhdmUoKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHNhdmUgPSBzdXBlci5zYXZlKClcclxuICAgICAgICBzYXZlLmdvdG8gPSB0aGlzLmdvdG9cclxuICAgICAgICBzYXZlLnN0YXJ0ID0gdGhpcy5zdGFydFxyXG4gICAgICAgIHNhdmUuZGVsdGEgPSB0aGlzLmRlbHRhXHJcbiAgICAgICAgc2F2ZS5rZXlzID0gdGhpcy5rZXlzXHJcbiAgICAgICAgcmV0dXJuIHNhdmVcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKGxvYWQpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIubG9hZChsb2FkKVxyXG4gICAgICAgIHRoaXMuZ290byA9IGxvYWQuZ290b1xyXG4gICAgICAgIHRoaXMuc3RhcnQgPSBsb2FkLnN0YXJ0XHJcbiAgICAgICAgdGhpcy5kZWx0YSA9IGxvYWQuZGVsdGFcclxuICAgICAgICB0aGlzLmtleXMgPSBsb2FkLmtleXNcclxuICAgIH1cclxuXHJcbiAgICByZXN0YXJ0KClcclxuICAgIHtcclxuICAgICAgICBsZXQgaSA9IDBcclxuICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhcnQgPSBbXVxyXG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5kZWx0YSA9IFtdXHJcbiAgICAgICAgY29uc3Qga2V5cyA9IHRoaXMua2V5cyA9IFtdXHJcbiAgICAgICAgY29uc3QgZ290byA9IHRoaXMuZ290b1xyXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IHRoaXMub2JqZWN0XHJcblxyXG4gICAgICAgIC8vIGxvb3BzIHRocm91Z2ggYWxsIGtleXMgaW4gZ290byBvYmplY3RcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZ290bylcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAvLyBoYW5kbGVzIGtleXMgd2l0aCBvbmUgYWRkaXRpb25hbCBsZXZlbCBlLmcuOiBnb3RvID0ge3NjYWxlOiB7eDogNSwgeTogM319XHJcbiAgICAgICAgICAgIGlmIChpc05hTihnb3RvW2tleV0pKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBrZXlzW2ldID0geyBrZXk6IGtleSwgY2hpbGRyZW46IFtdIH1cclxuICAgICAgICAgICAgICAgIHN0YXJ0W2ldID0gW11cclxuICAgICAgICAgICAgICAgIGRlbHRhW2ldID0gW11cclxuICAgICAgICAgICAgICAgIGxldCBqID0gMFxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQga2V5MiBpbiBnb3RvW2tleV0pXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5c1tpXS5jaGlsZHJlbltqXSA9IGtleTJcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFtpXVtqXSA9IHBhcnNlRmxvYXQob2JqZWN0W2tleV1ba2V5Ml0pXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRbaV1bal0gPSB0aGlzLl9jb3JyZWN0RE9NKGtleTIsIHN0YXJ0W2ldW2pdKVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0W2ldW2pdID0gaXNOYU4odGhpcy5zdGFydFtpXVtqXSkgPyAwIDogc3RhcnRbaV1bal1cclxuICAgICAgICAgICAgICAgICAgICBkZWx0YVtpXVtqXSA9IGdvdG9ba2V5XVtrZXkyXSAtIHN0YXJ0W2ldW2pdXHJcbiAgICAgICAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzdGFydFtpXSA9IHBhcnNlRmxvYXQob2JqZWN0W2tleV0pXHJcbiAgICAgICAgICAgICAgICBzdGFydFtpXSA9IHRoaXMuX2NvcnJlY3RET00oa2V5LCBzdGFydFtpXSlcclxuICAgICAgICAgICAgICAgIHN0YXJ0W2ldID0gaXNOYU4odGhpcy5zdGFydFtpXSkgPyAwIDogc3RhcnRbaV1cclxuICAgICAgICAgICAgICAgIGRlbHRhW2ldID0gZ290b1trZXldIC0gc3RhcnRbaV1cclxuICAgICAgICAgICAgICAgIGtleXNbaV0gPSBrZXlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aW1lID0gMFxyXG4gICAgfVxyXG5cclxuICAgIHJldmVyc2UoKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IHRoaXMub2JqZWN0XHJcbiAgICAgICAgY29uc3Qga2V5cyA9IHRoaXMua2V5c1xyXG4gICAgICAgIGNvbnN0IGdvdG8gPSB0aGlzLmdvdG9cclxuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuZGVsdGFcclxuICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhcnRcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIF9pID0ga2V5cy5sZW5ndGg7IGkgPCBfaTsgaSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXVxyXG4gICAgICAgICAgICBpZiAoaXNOYU4oZ290b1trZXldKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDAsIF9qID0ga2V5LmNoaWxkcmVuLmxlbmd0aDsgaiA8IF9qOyBqKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsdGFbaV1bal0gPSAtZGVsdGFbaV1bal1cclxuICAgICAgICAgICAgICAgICAgICBzdGFydFtpXVtqXSA9IHBhcnNlRmxvYXQob2JqZWN0W2tleS5rZXldW2tleS5jaGlsZHJlbltqXV0pXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRbaV1bal0gPSBpc05hTihzdGFydFtpXVtqXSkgPyAwIDogc3RhcnRbaV1bal1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRlbHRhW2ldID0gLWRlbHRhW2ldXHJcbiAgICAgICAgICAgICAgICBzdGFydFtpXSA9IHBhcnNlRmxvYXQob2JqZWN0W2tleV0pXHJcbiAgICAgICAgICAgICAgICBzdGFydFtpXSA9IGlzTmFOKHN0YXJ0W2ldKSA/IDAgOiBzdGFydFtpXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNhbGN1bGF0ZSgvKmVsYXBzZWQqLylcclxuICAgIHtcclxuICAgICAgICBjb25zdCBvYmplY3QgPSB0aGlzLm9iamVjdFxyXG4gICAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmxpc3RcclxuICAgICAgICBjb25zdCBrZXlzID0gdGhpcy5rZXlzXHJcbiAgICAgICAgY29uc3QgZ290byA9IHRoaXMuZ290b1xyXG4gICAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLnRpbWVcclxuICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhcnRcclxuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuZGVsdGFcclxuICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb25cclxuICAgICAgICBjb25zdCBlYXNlID0gdGhpcy5vcHRpb25zLmVhc2VcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgX2kgPSB0aGlzLmtleXMubGVuZ3RoOyBpIDwgX2k7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV1cclxuICAgICAgICAgICAgaWYgKGlzTmFOKGdvdG9ba2V5XSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleTEgPSBrZXkua2V5XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgX2ogPSBrZXkuY2hpbGRyZW4ubGVuZ3RoOyBqIDwgX2o7IGorKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkyID0ga2V5LmNoaWxkcmVuW2pdXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJzID0gb2JqZWN0W2tleTFdW2tleTJdID0gKHRpbWUgPj0gZHVyYXRpb24pID8gc3RhcnRbaV1bal0gKyBkZWx0YVtpXVtqXSA6IGVhc2UodGltZSwgc3RhcnRbaV1bal0sIGRlbHRhW2ldW2pdLCBkdXJhdGlvbilcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAxLCBfayA9IGxpc3QubGVuZ3RoOyBrIDwgX2s7IGsrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdFtrXVtrZXkxXVtrZXkyXSA9IG90aGVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJzID0gb2JqZWN0W2tleV0gPSAodGltZSA+PSBkdXJhdGlvbikgPyBzdGFydFtpXSArIGRlbHRhW2ldIDogZWFzZSh0aW1lLCBzdGFydFtpXSwgZGVsdGFbaV0sIGR1cmF0aW9uKVxyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3QpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDEsIF9qID0gdGhpcy5saXN0Lmxlbmd0aDsgaiA8IF9qOyBqKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0W2pdW2tleV0gPSBvdGhlcnNcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdG8iXX0=

/***/ }),

/***/ 212:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var wait = __webpack_require__(203);
var to = __webpack_require__(211);
var tint = __webpack_require__(210);
var shake = __webpack_require__(208);
var angle = __webpack_require__(205);
var face = __webpack_require__(206);
var target = __webpack_require__(209);
var movie = __webpack_require__(207);

/**
 * restart an animation = requires a saved state
 * @param {object} object(s) to animate
 */
function load(object, load) {
    if (!load) {
        return null;
    }
    var options = { load: load };
    switch (load.type) {
        case 'Wait':
            return new wait(object, options);
        case 'To':
            return new to(object, null, null, options);
        case 'Tint':
            return new tint(object, null, null, options);
        case 'Shake':
            return new shake(object, null, null, options);
        case 'Angle':
            return new angle(object, null, null, null, options);
        case 'Face':
            return new face(object[0], object[1], null, options);
        case 'Target':
            return new target(object[0], object[1], null, options);
        case 'Movie':
            return new movie(object, object[1], null, options);
    }
}

module.exports = load;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2FkLmpzIl0sIm5hbWVzIjpbIndhaXQiLCJyZXF1aXJlIiwidG8iLCJ0aW50Iiwic2hha2UiLCJhbmdsZSIsImZhY2UiLCJ0YXJnZXQiLCJtb3ZpZSIsImxvYWQiLCJvYmplY3QiLCJvcHRpb25zIiwidHlwZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsT0FBT0MsUUFBUSxRQUFSLENBQWI7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQU1FLE9BQU9GLFFBQVEsUUFBUixDQUFiO0FBQ0EsSUFBTUcsUUFBUUgsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFNSSxRQUFRSixRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQU1LLE9BQU9MLFFBQVEsUUFBUixDQUFiO0FBQ0EsSUFBTU0sU0FBU04sUUFBUSxVQUFSLENBQWY7QUFDQSxJQUFNTyxRQUFRUCxRQUFRLFNBQVIsQ0FBZDs7QUFFQTs7OztBQUlBLFNBQVNRLElBQVQsQ0FBY0MsTUFBZCxFQUFzQkQsSUFBdEIsRUFDQTtBQUNJLFFBQUksQ0FBQ0EsSUFBTCxFQUNBO0FBQ0ksZUFBTyxJQUFQO0FBQ0g7QUFDRCxRQUFNRSxVQUFVLEVBQUVGLFVBQUYsRUFBaEI7QUFDQSxZQUFRQSxLQUFLRyxJQUFiO0FBRUksYUFBSyxNQUFMO0FBQ0ksbUJBQU8sSUFBSVosSUFBSixDQUFTVSxNQUFULEVBQWlCQyxPQUFqQixDQUFQO0FBQ0osYUFBSyxJQUFMO0FBQ0ksbUJBQU8sSUFBSVQsRUFBSixDQUFPUSxNQUFQLEVBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQkMsT0FBM0IsQ0FBUDtBQUNKLGFBQUssTUFBTDtBQUNJLG1CQUFPLElBQUlSLElBQUosQ0FBU08sTUFBVCxFQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUE2QkMsT0FBN0IsQ0FBUDtBQUNKLGFBQUssT0FBTDtBQUNJLG1CQUFPLElBQUlQLEtBQUosQ0FBVU0sTUFBVixFQUFrQixJQUFsQixFQUF3QixJQUF4QixFQUE4QkMsT0FBOUIsQ0FBUDtBQUNKLGFBQUssT0FBTDtBQUNJLG1CQUFPLElBQUlOLEtBQUosQ0FBVUssTUFBVixFQUFrQixJQUFsQixFQUF3QixJQUF4QixFQUE4QixJQUE5QixFQUFvQ0MsT0FBcEMsQ0FBUDtBQUNKLGFBQUssTUFBTDtBQUNJLG1CQUFPLElBQUlMLElBQUosQ0FBU0ksT0FBTyxDQUFQLENBQVQsRUFBb0JBLE9BQU8sQ0FBUCxDQUFwQixFQUErQixJQUEvQixFQUFxQ0MsT0FBckMsQ0FBUDtBQUNKLGFBQUssUUFBTDtBQUNJLG1CQUFPLElBQUlKLE1BQUosQ0FBV0csT0FBTyxDQUFQLENBQVgsRUFBc0JBLE9BQU8sQ0FBUCxDQUF0QixFQUFpQyxJQUFqQyxFQUF1Q0MsT0FBdkMsQ0FBUDtBQUNKLGFBQUssT0FBTDtBQUNJLG1CQUFPLElBQUlILEtBQUosQ0FBVUUsTUFBVixFQUFrQkEsT0FBTyxDQUFQLENBQWxCLEVBQTZCLElBQTdCLEVBQW1DQyxPQUFuQyxDQUFQO0FBakJSO0FBbUJIOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCTCxJQUFqQiIsImZpbGUiOiJsb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgd2FpdCA9IHJlcXVpcmUoJy4vd2FpdCcpXG5jb25zdCB0byA9IHJlcXVpcmUoJy4vdG8nKVxuY29uc3QgdGludCA9IHJlcXVpcmUoJy4vdGludCcpXG5jb25zdCBzaGFrZSA9IHJlcXVpcmUoJy4vc2hha2UnKVxuY29uc3QgYW5nbGUgPSByZXF1aXJlKCcuL2FuZ2xlJylcbmNvbnN0IGZhY2UgPSByZXF1aXJlKCcuL2ZhY2UnKVxuY29uc3QgdGFyZ2V0ID0gcmVxdWlyZSgnLi90YXJnZXQnKVxuY29uc3QgbW92aWUgPSByZXF1aXJlKCcuL21vdmllJylcblxuLyoqXG4gKiByZXN0YXJ0IGFuIGFuaW1hdGlvbiA9IHJlcXVpcmVzIGEgc2F2ZWQgc3RhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3QocykgdG8gYW5pbWF0ZVxuICovXG5mdW5jdGlvbiBsb2FkKG9iamVjdCwgbG9hZClcbntcbiAgICBpZiAoIWxvYWQpXG4gICAge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBjb25zdCBvcHRpb25zID0geyBsb2FkIH1cbiAgICBzd2l0Y2ggKGxvYWQudHlwZSlcbiAgICB7XG4gICAgICAgIGNhc2UgJ1dhaXQnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyB3YWl0KG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgY2FzZSAnVG8nOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyB0byhvYmplY3QsIG51bGwsIG51bGwsIG9wdGlvbnMpXG4gICAgICAgIGNhc2UgJ1RpbnQnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyB0aW50KG9iamVjdCwgbnVsbCwgbnVsbCwgb3B0aW9ucylcbiAgICAgICAgY2FzZSAnU2hha2UnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBzaGFrZShvYmplY3QsIG51bGwsIG51bGwsIG9wdGlvbnMpXG4gICAgICAgIGNhc2UgJ0FuZ2xlJzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgYW5nbGUob2JqZWN0LCBudWxsLCBudWxsLCBudWxsLCBvcHRpb25zKVxuICAgICAgICBjYXNlICdGYWNlJzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgZmFjZShvYmplY3RbMF0sIG9iamVjdFsxXSwgbnVsbCwgb3B0aW9ucylcbiAgICAgICAgY2FzZSAnVGFyZ2V0JzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgdGFyZ2V0KG9iamVjdFswXSwgb2JqZWN0WzFdLCBudWxsLCBvcHRpb25zKVxuICAgICAgICBjYXNlICdNb3ZpZSc6XG4gICAgICAgICAgICByZXR1cm4gbmV3IG1vdmllKG9iamVjdCwgb2JqZWN0WzFdLCBudWxsLCBvcHRpb25zKVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2FkIl19

/***/ }),

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {


/*
	Copyright © 2001 Robert Penner
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, 
	are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of 
	conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list 
	of conditions and the following disclaimer in the documentation and/or other materials 
	provided with the distribution.

	Neither the name of the author nor the names of contributors may be used to endorse 
	or promote products derived from this software without specific prior written permission.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
	EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
	AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
	OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function() {
  var penner, umd;

  umd = function(factory) {
    if (true) {
      return module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else {
      return this.penner = factory;
    }
  };

  penner = {
    linear: function(t, b, c, d) {
      return c * t / d + b;
    },
    easeInQuad: function(t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      } else {
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }
    },
    easeInCubic: function(t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    },
    easeInQuart: function(t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      } else {
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      }
    },
    easeInQuint: function(t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      }
    },
    easeInSine: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(t, b, c, d) {
      if (t === 0) {
        return b;
      } else {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
      }
    },
    easeOutExpo: function(t, b, c, d) {
      if (t === d) {
        return b + c;
      } else {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
      }
    },
    easeInOutExpo: function(t, b, c, d) {
      if (t === 0) {
        b;
      }
      if (t === d) {
        b + c;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      } else {
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    },
    easeInCirc: function(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      } else {
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      }
    },
    easeInElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) {
        b;
      } else if ((t /= d) === 1) {
        b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) {
        b;
      } else if ((t /= d) === 1) {
        b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) {
        b;
      } else if ((t /= d / 2) === 2) {
        b + c;
      }
      if (!p) {
        p = d * (.3 * 1.5);
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      if (t < 1) {
        return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      } else {
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      }
    },
    easeInBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      } else {
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
      }
    },
    easeInBounce: function(t, b, c, d) {
      var v;
      v = penner.easeOutBounce(d - t, 0, c, d);
      return c - v + b;
    },
    easeOutBounce: function(t, b, c, d) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
      }
    },
    easeInOutBounce: function(t, b, c, d) {
      var v;
      if (t < d / 2) {
        v = penner.easeInBounce(t * 2, 0, c, d);
        return v * .5 + b;
      } else {
        v = penner.easeOutBounce(t * 2 - d, 0, c, d);
        return v * .5 + c * .5 + b;
      }
    }
  };

  umd(penner);

}).call(this);


/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Ease = {
    list: __webpack_require__(216),
    wait: __webpack_require__(203),
    to: __webpack_require__(211),
    shake: __webpack_require__(208),
    tint: __webpack_require__(210),
    face: __webpack_require__(206),
    angle: __webpack_require__(205),
    target: __webpack_require__(209),
    movie: __webpack_require__(207),
    load: __webpack_require__(212)
};

PIXI.extras.Ease = Ease;

module.exports = Ease;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJFYXNlIiwibGlzdCIsInJlcXVpcmUiLCJ3YWl0IiwidG8iLCJzaGFrZSIsInRpbnQiLCJmYWNlIiwiYW5nbGUiLCJ0YXJnZXQiLCJtb3ZpZSIsImxvYWQiLCJQSVhJIiwiZXh0cmFzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxPQUFPO0FBQ1RDLFVBQU1DLFFBQVEsUUFBUixDQURHO0FBRVRDLFVBQU1ELFFBQVEsUUFBUixDQUZHO0FBR1RFLFFBQUlGLFFBQVEsTUFBUixDQUhLO0FBSVRHLFdBQU9ILFFBQVEsU0FBUixDQUpFO0FBS1RJLFVBQU1KLFFBQVEsUUFBUixDQUxHO0FBTVRLLFVBQU1MLFFBQVEsUUFBUixDQU5HO0FBT1RNLFdBQU9OLFFBQVEsU0FBUixDQVBFO0FBUVRPLFlBQVFQLFFBQVEsVUFBUixDQVJDO0FBU1RRLFdBQU9SLFFBQVEsU0FBUixDQVRFO0FBVVRTLFVBQU1ULFFBQVEsUUFBUjtBQVZHLENBQWI7O0FBYUFVLEtBQUtDLE1BQUwsQ0FBWWIsSUFBWixHQUFtQkEsSUFBbkI7O0FBRUFjLE9BQU9DLE9BQVAsR0FBaUJmLElBQWpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRWFzZSA9IHtcclxuICAgIGxpc3Q6IHJlcXVpcmUoJy4vbGlzdCcpLFxyXG4gICAgd2FpdDogcmVxdWlyZSgnLi93YWl0JyksXHJcbiAgICB0bzogcmVxdWlyZSgnLi90bycpLFxyXG4gICAgc2hha2U6IHJlcXVpcmUoJy4vc2hha2UnKSxcclxuICAgIHRpbnQ6IHJlcXVpcmUoJy4vdGludCcpLFxyXG4gICAgZmFjZTogcmVxdWlyZSgnLi9mYWNlJyksXHJcbiAgICBhbmdsZTogcmVxdWlyZSgnLi9hbmdsZScpLFxyXG4gICAgdGFyZ2V0OiByZXF1aXJlKCcuL3RhcmdldCcpLFxyXG4gICAgbW92aWU6IHJlcXVpcmUoJy4vbW92aWUnKSxcclxuICAgIGxvYWQ6IHJlcXVpcmUoJy4vbG9hZCcpXHJcbn1cclxuXHJcblBJWEkuZXh0cmFzLkVhc2UgPSBFYXNlXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVhc2UiXX0=

/***/ }),

/***/ 216:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Events = __webpack_require__(213);

var Angle = __webpack_require__(205);
var Face = __webpack_require__(206);
var Load = __webpack_require__(212);
var Movie = __webpack_require__(207);
var Shake = __webpack_require__(208);
var Target = __webpack_require__(209);
var Tint = __webpack_require__(210);
var To = __webpack_require__(211);
var Wait = __webpack_require__(203);

var Ease = function (_Events) {
    _inherits(Ease, _Events);

    /**
     * Main class for creating eases
     * @param {object} [options]
     * @param {boolean} [options.noTicker] don't add the update function to PIXI.ticker
     * @param {PIXI.ticker} [options.ticker=PIXI.ticker.shared] use this PIXI.ticker for the list
     * @extends eventemitter
     * @fire done
     * @fire each
     */
    function Ease(options) {
        _classCallCheck(this, Ease);

        options = options || {};

        var _this = _possibleConstructorReturn(this, (Ease.__proto__ || Object.getPrototypeOf(Ease)).call(this));

        if (!options.noTicker) {
            var ticker = options.ticker || PIXI.ticker.shared;
            ticker.add(function () {
                return _this.update(ticker.deltaTime * 16.66);
            });
        }
        _this.list = [];
        _this.empty = true;
        _this.removeWaiting = [];
        _this.removeAllWaiting = false;
        return _this;
    }

    /**
     * Add animation(s) to animation list
     * @param {(object|object[])} any animation class
     * @return {object} first animation
     */


    _createClass(Ease, [{
        key: 'add',
        value: function add() {
            var first = void 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = arguments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var arg = _step.value;

                    if (Array.isArray(arg)) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = arg[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var entry = _step2.value;

                                if (!first) {
                                    first = entry;
                                }
                                this.list.push(entry);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    } else {
                        first = arg;
                        this.list.push(arg);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.empty = false;
            return first;
        }

        /**
         * remove animation(s)
         * @param {object|array} animate - the animation (or array of animations) to remove; can be null
         */

    }, {
        key: 'remove',
        value: function remove(animate) {
            if (this.inUpdate) {
                this.removeWaiting.push(animate);
            } else {
                var index = this.list.indexOf(animate);
                if (index !== -1) {
                    this.list.splice(index, 1);
                }
            }
        }

        /**
         * remove all animations from list
         * @inherited from yy-loop
         */

    }, {
        key: 'removeAll',
        value: function removeAll() {
            if (this.inUpdate) {
                this.removeAllWaiting = true;
            } else {
                this.list = [];
            }
        }

        /**
         * update frame
         * this is automatically added to PIXI.ticker unless options.noTicker is set
         * if using options.noTicker, this should be called manually
         * @param {number} elasped time in MS since last update
         */

    }, {
        key: 'update',
        value: function update(elapsed) {
            this.inUpdate = true;
            for (var i = 0, _i = this.list.length; i < _i; i++) {
                if (this.list[i] && this.list[i].update(elapsed)) {
                    this.list.splice(i, 1);
                    i--;
                    _i--;
                }
            }
            this.emit('each', this);
            if (this.list.length === 0 && !this.empty) {
                this.emit('done', this);
                this.empty = true;
            }
            this.inUpdate = false;
            if (this.removeAllWaiting) {
                this.removeAll();
                this.removeAllWaiting = false;
            }
            while (this.removeWaiting.length) {
                this.remove(this.removeWaiting.pop());
            }
        }

        /**
         * number of animations
         * @type {number}
         */

    }, {
        key: 'to',


        /**
         * default options for all eases
         * @typedef {object} EaseOptions
         * @param {object} [EaseOptions.options]
         * @param {number} [EaseOptions.options.wait=0] n milliseconds before starting animation (can also be used to pause animation for a length of time)
         * @param {boolean} [EaseOptions.options.pause] start the animation paused
         * @param {boolean|number} [EaseOptions.options.repeat] true: repeat animation forever n: repeat animation n times
         * @param {boolean|number} [EaseOptions.options.reverse] true: reverse animation (if combined with repeat, then pulse) n: reverse animation n times
         * @param {Function} [EaseOptions.options.load] loads an animation using an .save() object note the * parameters below cannot be loaded and must be re-set
         * @param {string|Function} [EaseOptions.options.ease] name or function from easing.js (see http://easings.net for examples)
         */

        /**
         * ease parameters of object
         * @param {PIXI.DisplayObject} object to animate
         * @param {object} goto - parameters to animate, e.g.: {alpha: 5, scale: {3, 5}, scale: 5, rotation: Math.PI}
         * @param {number} duration - time to run
         * @fires done
         * @fires wait
         * @fires first
         * @fires each
         * @fires loop
         * @fires reverse
         */
        value: function to() {
            return this.add(new (Function.prototype.bind.apply(To, [null].concat(Array.prototype.slice.call(arguments))))());
        }

        /**
         * animate object's {x, y} using an angle
         * @param {object} object to animate
         * @param {number} angle in radians
         * @param {number} speed in pixels/millisecond
         * @param {number} [duration=0] in milliseconds; if 0, then continues forever
         * @param {object} [options] @see {@link Wait}
         */

    }, {
        key: 'angle',
        value: function angle() {
            return this.add(new (Function.prototype.bind.apply(Angle, [null].concat(Array.prototype.slice.call(arguments))))());
        }

        /** helper to add to the list a new Ease.face class; see Ease.to class below for parameters */

    }, {
        key: 'face',
        value: function face() {
            return this.add(new (Function.prototype.bind.apply(Face, [null].concat(Array.prototype.slice.call(arguments))))());
        }

        /** helper to add to the list a new Ease.load class; see Ease.to class below for parameters */

    }, {
        key: 'load',
        value: function load() {
            return this.add(new (Function.prototype.bind.apply(Load, [null].concat(Array.prototype.slice.call(arguments))))());
        }

        /** helper to add to the list a new Ease.movie class; see Ease.to class below for parameters */

    }, {
        key: 'movie',
        value: function movie() {
            return this.add(new (Function.prototype.bind.apply(Movie, [null].concat(Array.prototype.slice.call(arguments))))());
        }

        /** helper to add to the list a new Ease.shake class; see Ease.to class below for parameters */

    }, {
        key: 'shake',
        value: function shake() {
            return this.add(new (Function.prototype.bind.apply(Shake, [null].concat(Array.prototype.slice.call(arguments))))());
        }

        /** helper to add to the list a new Ease.target class; see Ease.to class below for parameters */

    }, {
        key: 'target',
        value: function target() {
            return this.add(new (Function.prototype.bind.apply(Target, [null].concat(Array.prototype.slice.call(arguments))))());
        }

        /** helper to add to the list a new Ease.angle tint; see Ease.to class below for parameters */

    }, {
        key: 'tint',
        value: function tint() {
            return this.add(new (Function.prototype.bind.apply(Tint, [null].concat(Array.prototype.slice.call(arguments))))());
        }

        /** helper to add to the list a new Ease.wait class; see Ease.to class below for parameters */

    }, {
        key: 'wait',
        value: function wait() {
            return this.add(new (Function.prototype.bind.apply(Wait, [null].concat(Array.prototype.slice.call(arguments))))());
        }
    }, {
        key: 'count',
        get: function get() {
            return this.list.length;
        }

        /**
         * number of active animations
         * @type {number}
         */

    }, {
        key: 'countRunning',
        get: function get() {
            var count = 0;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var entry = _step3.value;

                    if (!entry.pause) {
                        count++;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return count;
        }
    }]);

    return Ease;
}(Events);

module.exports = Ease;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9saXN0LmpzIl0sIm5hbWVzIjpbIkV2ZW50cyIsInJlcXVpcmUiLCJBbmdsZSIsIkZhY2UiLCJMb2FkIiwiTW92aWUiLCJTaGFrZSIsIlRhcmdldCIsIlRpbnQiLCJUbyIsIldhaXQiLCJFYXNlIiwib3B0aW9ucyIsIm5vVGlja2VyIiwidGlja2VyIiwiUElYSSIsInNoYXJlZCIsImFkZCIsInVwZGF0ZSIsImRlbHRhVGltZSIsImxpc3QiLCJlbXB0eSIsInJlbW92ZVdhaXRpbmciLCJyZW1vdmVBbGxXYWl0aW5nIiwiZmlyc3QiLCJhcmd1bWVudHMiLCJhcmciLCJBcnJheSIsImlzQXJyYXkiLCJlbnRyeSIsInB1c2giLCJhbmltYXRlIiwiaW5VcGRhdGUiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJlbGFwc2VkIiwiaSIsIl9pIiwibGVuZ3RoIiwiZW1pdCIsInJlbW92ZUFsbCIsInJlbW92ZSIsInBvcCIsImNvdW50IiwicGF1c2UiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBTUEsU0FBU0MsUUFBUSxlQUFSLENBQWY7O0FBRUEsSUFBTUMsUUFBUUQsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFNRSxPQUFPRixRQUFRLFFBQVIsQ0FBYjtBQUNBLElBQU1HLE9BQU9ILFFBQVEsUUFBUixDQUFiO0FBQ0EsSUFBTUksUUFBUUosUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFNSyxRQUFRTCxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQU1NLFNBQVNOLFFBQVEsVUFBUixDQUFmO0FBQ0EsSUFBTU8sT0FBT1AsUUFBUSxRQUFSLENBQWI7QUFDQSxJQUFNUSxLQUFLUixRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQU1TLE9BQU9ULFFBQVEsUUFBUixDQUFiOztJQUVNVSxJOzs7QUFFRjs7Ozs7Ozs7O0FBU0Esa0JBQVlDLE9BQVosRUFDQTtBQUFBOztBQUNJQSxrQkFBVUEsV0FBVyxFQUFyQjs7QUFESjs7QUFH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QUFMLG9DQUFhUCxJQUFiLDJDQUFxQmUsU0FBckIsT0FBUDtBQUF5Qzs7OzRCQTVFbEQ7QUFDSSxtQkFBTyxLQUFLTCxJQUFMLENBQVVtQixNQUFqQjtBQUNIOztBQUVEOzs7Ozs7OzRCQUtBO0FBQ0ksZ0JBQUlLLFFBQVEsQ0FBWjtBQURKO0FBQUE7QUFBQTs7QUFBQTtBQUVJLHNDQUFrQixLQUFLeEIsSUFBdkIsbUlBQ0E7QUFBQSx3QkFEU1MsS0FDVDs7QUFDSSx3QkFBSSxDQUFDQSxNQUFNZ0IsS0FBWCxFQUNBO0FBQ0lEO0FBQ0g7QUFDSjtBQVJMO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBU0ksbUJBQU9BLEtBQVA7QUFDSDs7OztFQXpKYzVDLE07O0FBcU5uQjhDLE9BQU9DLE9BQVAsR0FBaUJwQyxJQUFqQiIsImZpbGUiOiJsaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRXZlbnRzID0gcmVxdWlyZSgnZXZlbnRlbWl0dGVyMycpXHJcblxyXG5jb25zdCBBbmdsZSA9IHJlcXVpcmUoJy4vYW5nbGUnKVxyXG5jb25zdCBGYWNlID0gcmVxdWlyZSgnLi9mYWNlJylcclxuY29uc3QgTG9hZCA9IHJlcXVpcmUoJy4vbG9hZCcpXHJcbmNvbnN0IE1vdmllID0gcmVxdWlyZSgnLi9tb3ZpZScpXHJcbmNvbnN0IFNoYWtlID0gcmVxdWlyZSgnLi9zaGFrZScpXHJcbmNvbnN0IFRhcmdldCA9IHJlcXVpcmUoJy4vdGFyZ2V0JylcclxuY29uc3QgVGludCA9IHJlcXVpcmUoJy4vdGludCcpXHJcbmNvbnN0IFRvID0gcmVxdWlyZSgnLi90bycpXHJcbmNvbnN0IFdhaXQgPSByZXF1aXJlKCcuL3dhaXQnKVxyXG5cclxuY2xhc3MgRWFzZSBleHRlbmRzIEV2ZW50c1xyXG57XHJcbiAgICAvKipcclxuICAgICAqIE1haW4gY2xhc3MgZm9yIGNyZWF0aW5nIGVhc2VzXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLm5vVGlja2VyXSBkb24ndCBhZGQgdGhlIHVwZGF0ZSBmdW5jdGlvbiB0byBQSVhJLnRpY2tlclxyXG4gICAgICogQHBhcmFtIHtQSVhJLnRpY2tlcn0gW29wdGlvbnMudGlja2VyPVBJWEkudGlja2VyLnNoYXJlZF0gdXNlIHRoaXMgUElYSS50aWNrZXIgZm9yIHRoZSBsaXN0XHJcbiAgICAgKiBAZXh0ZW5kcyBldmVudGVtaXR0ZXJcclxuICAgICAqIEBmaXJlIGRvbmVcclxuICAgICAqIEBmaXJlIGVhY2hcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICBpZiAoIW9wdGlvbnMubm9UaWNrZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCB0aWNrZXIgPSBvcHRpb25zLnRpY2tlciB8fCBQSVhJLnRpY2tlci5zaGFyZWRcclxuICAgICAgICAgICAgdGlja2VyLmFkZCgoKSA9PiB0aGlzLnVwZGF0ZSh0aWNrZXIuZGVsdGFUaW1lICogMTYuNjYpKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxpc3QgPSBbXVxyXG4gICAgICAgIHRoaXMuZW1wdHkgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5yZW1vdmVXYWl0aW5nID0gW11cclxuICAgICAgICB0aGlzLnJlbW92ZUFsbFdhaXRpbmcgPSBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuaW1hdGlvbihzKSB0byBhbmltYXRpb24gbGlzdFxyXG4gICAgICogQHBhcmFtIHsob2JqZWN0fG9iamVjdFtdKX0gYW55IGFuaW1hdGlvbiBjbGFzc1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBmaXJzdCBhbmltYXRpb25cclxuICAgICAqL1xyXG4gICAgYWRkKClcclxuICAgIHtcclxuICAgICAgICBsZXQgZmlyc3RcclxuICAgICAgICBmb3IgKGxldCBhcmcgb2YgYXJndW1lbnRzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZW50cnkgb2YgYXJnKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3QpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdCA9IGVudHJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdC5wdXNoKGVudHJ5KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZmlyc3QgPSBhcmdcclxuICAgICAgICAgICAgICAgIHRoaXMubGlzdC5wdXNoKGFyZylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVtcHR5ID0gZmFsc2VcclxuICAgICAgICByZXR1cm4gZmlyc3RcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlbW92ZSBhbmltYXRpb24ocylcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fGFycmF5fSBhbmltYXRlIC0gdGhlIGFuaW1hdGlvbiAob3IgYXJyYXkgb2YgYW5pbWF0aW9ucykgdG8gcmVtb3ZlOyBjYW4gYmUgbnVsbFxyXG4gICAgICovXHJcbiAgICByZW1vdmUoYW5pbWF0ZSlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5pblVwZGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlV2FpdGluZy5wdXNoKGFuaW1hdGUpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5saXN0LmluZGV4T2YoYW5pbWF0ZSlcclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0LnNwbGljZShpbmRleCwgMSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlbW92ZSBhbGwgYW5pbWF0aW9ucyBmcm9tIGxpc3RcclxuICAgICAqIEBpbmhlcml0ZWQgZnJvbSB5eS1sb29wXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUFsbCgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5VcGRhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbFdhaXRpbmcgPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdCA9IFtdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdXBkYXRlIGZyYW1lXHJcbiAgICAgKiB0aGlzIGlzIGF1dG9tYXRpY2FsbHkgYWRkZWQgdG8gUElYSS50aWNrZXIgdW5sZXNzIG9wdGlvbnMubm9UaWNrZXIgaXMgc2V0XHJcbiAgICAgKiBpZiB1c2luZyBvcHRpb25zLm5vVGlja2VyLCB0aGlzIHNob3VsZCBiZSBjYWxsZWQgbWFudWFsbHlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbGFzcGVkIHRpbWUgaW4gTVMgc2luY2UgbGFzdCB1cGRhdGVcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKGVsYXBzZWQpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5pblVwZGF0ZSA9IHRydWVcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgX2kgPSB0aGlzLmxpc3QubGVuZ3RoOyBpIDwgX2k7IGkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxpc3RbaV0gJiYgdGhpcy5saXN0W2ldLnVwZGF0ZShlbGFwc2VkKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0LnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgICAgaS0tXHJcbiAgICAgICAgICAgICAgICBfaS0tXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbWl0KCdlYWNoJywgdGhpcylcclxuICAgICAgICBpZiAodGhpcy5saXN0Lmxlbmd0aCA9PT0gMCAmJiAhdGhpcy5lbXB0eSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnZG9uZScsIHRoaXMpXHJcbiAgICAgICAgICAgIHRoaXMuZW1wdHkgPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5VcGRhdGUgPSBmYWxzZVxyXG4gICAgICAgIGlmICh0aGlzLnJlbW92ZUFsbFdhaXRpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUFsbCgpXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsV2FpdGluZyA9IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlICh0aGlzLnJlbW92ZVdhaXRpbmcubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUodGhpcy5yZW1vdmVXYWl0aW5nLnBvcCgpKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG51bWJlciBvZiBhbmltYXRpb25zXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgY291bnQoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxpc3QubGVuZ3RoXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBudW1iZXIgb2YgYWN0aXZlIGFuaW1hdGlvbnNcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBjb3VudFJ1bm5pbmcoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBjb3VudCA9IDBcclxuICAgICAgICBmb3IgKGxldCBlbnRyeSBvZiB0aGlzLmxpc3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIWVudHJ5LnBhdXNlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdW50XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkZWZhdWx0IG9wdGlvbnMgZm9yIGFsbCBlYXNlc1xyXG4gICAgICogQHR5cGVkZWYge29iamVjdH0gRWFzZU9wdGlvbnNcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbRWFzZU9wdGlvbnMub3B0aW9uc11cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbRWFzZU9wdGlvbnMub3B0aW9ucy53YWl0PTBdIG4gbWlsbGlzZWNvbmRzIGJlZm9yZSBzdGFydGluZyBhbmltYXRpb24gKGNhbiBhbHNvIGJlIHVzZWQgdG8gcGF1c2UgYW5pbWF0aW9uIGZvciBhIGxlbmd0aCBvZiB0aW1lKVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbRWFzZU9wdGlvbnMub3B0aW9ucy5wYXVzZV0gc3RhcnQgdGhlIGFuaW1hdGlvbiBwYXVzZWRcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbnxudW1iZXJ9IFtFYXNlT3B0aW9ucy5vcHRpb25zLnJlcGVhdF0gdHJ1ZTogcmVwZWF0IGFuaW1hdGlvbiBmb3JldmVyIG46IHJlcGVhdCBhbmltYXRpb24gbiB0aW1lc1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufG51bWJlcn0gW0Vhc2VPcHRpb25zLm9wdGlvbnMucmV2ZXJzZV0gdHJ1ZTogcmV2ZXJzZSBhbmltYXRpb24gKGlmIGNvbWJpbmVkIHdpdGggcmVwZWF0LCB0aGVuIHB1bHNlKSBuOiByZXZlcnNlIGFuaW1hdGlvbiBuIHRpbWVzXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbRWFzZU9wdGlvbnMub3B0aW9ucy5sb2FkXSBsb2FkcyBhbiBhbmltYXRpb24gdXNpbmcgYW4gLnNhdmUoKSBvYmplY3Qgbm90ZSB0aGUgKiBwYXJhbWV0ZXJzIGJlbG93IGNhbm5vdCBiZSBsb2FkZWQgYW5kIG11c3QgYmUgcmUtc2V0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xGdW5jdGlvbn0gW0Vhc2VPcHRpb25zLm9wdGlvbnMuZWFzZV0gbmFtZSBvciBmdW5jdGlvbiBmcm9tIGVhc2luZy5qcyAoc2VlIGh0dHA6Ly9lYXNpbmdzLm5ldCBmb3IgZXhhbXBsZXMpXHJcbiAgICAgKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIGVhc2UgcGFyYW1ldGVycyBvZiBvYmplY3RcclxuICAgICAqIEBwYXJhbSB7UElYSS5EaXNwbGF5T2JqZWN0fSBvYmplY3QgdG8gYW5pbWF0ZVxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGdvdG8gLSBwYXJhbWV0ZXJzIHRvIGFuaW1hdGUsIGUuZy46IHthbHBoYTogNSwgc2NhbGU6IHszLCA1fSwgc2NhbGU6IDUsIHJvdGF0aW9uOiBNYXRoLlBJfVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIC0gdGltZSB0byBydW5cclxuICAgICAqIEBmaXJlcyBkb25lXHJcbiAgICAgKiBAZmlyZXMgd2FpdFxyXG4gICAgICogQGZpcmVzIGZpcnN0XHJcbiAgICAgKiBAZmlyZXMgZWFjaFxyXG4gICAgICogQGZpcmVzIGxvb3BcclxuICAgICAqIEBmaXJlcyByZXZlcnNlXHJcbiAgICAgKi9cclxuICAgIHRvKCkgeyByZXR1cm4gdGhpcy5hZGQobmV3IFRvKC4uLmFyZ3VtZW50cykpIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFuaW1hdGUgb2JqZWN0J3Mge3gsIHl9IHVzaW5nIGFuIGFuZ2xlXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0IHRvIGFuaW1hdGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbmdsZSBpbiByYWRpYW5zXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgaW4gcGl4ZWxzL21pbGxpc2Vjb25kXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2R1cmF0aW9uPTBdIGluIG1pbGxpc2Vjb25kczsgaWYgMCwgdGhlbiBjb250aW51ZXMgZm9yZXZlclxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBAc2VlIHtAbGluayBXYWl0fVxyXG4gICAgICovXHJcbiAgICBhbmdsZSgpIHsgcmV0dXJuIHRoaXMuYWRkKG5ldyBBbmdsZSguLi5hcmd1bWVudHMpKSB9XHJcblxyXG4gICAgLyoqIGhlbHBlciB0byBhZGQgdG8gdGhlIGxpc3QgYSBuZXcgRWFzZS5mYWNlIGNsYXNzOyBzZWUgRWFzZS50byBjbGFzcyBiZWxvdyBmb3IgcGFyYW1ldGVycyAqL1xyXG4gICAgZmFjZSgpIHsgcmV0dXJuIHRoaXMuYWRkKG5ldyBGYWNlKC4uLmFyZ3VtZW50cykpIH1cclxuXHJcbiAgICAvKiogaGVscGVyIHRvIGFkZCB0byB0aGUgbGlzdCBhIG5ldyBFYXNlLmxvYWQgY2xhc3M7IHNlZSBFYXNlLnRvIGNsYXNzIGJlbG93IGZvciBwYXJhbWV0ZXJzICovXHJcbiAgICBsb2FkKCkgeyByZXR1cm4gdGhpcy5hZGQobmV3IExvYWQoLi4uYXJndW1lbnRzKSkgfVxyXG5cclxuICAgIC8qKiBoZWxwZXIgdG8gYWRkIHRvIHRoZSBsaXN0IGEgbmV3IEVhc2UubW92aWUgY2xhc3M7IHNlZSBFYXNlLnRvIGNsYXNzIGJlbG93IGZvciBwYXJhbWV0ZXJzICovXHJcbiAgICBtb3ZpZSgpIHsgcmV0dXJuIHRoaXMuYWRkKG5ldyBNb3ZpZSguLi5hcmd1bWVudHMpKSB9XHJcblxyXG4gICAgLyoqIGhlbHBlciB0byBhZGQgdG8gdGhlIGxpc3QgYSBuZXcgRWFzZS5zaGFrZSBjbGFzczsgc2VlIEVhc2UudG8gY2xhc3MgYmVsb3cgZm9yIHBhcmFtZXRlcnMgKi9cclxuICAgIHNoYWtlKCkgeyByZXR1cm4gdGhpcy5hZGQobmV3IFNoYWtlKC4uLmFyZ3VtZW50cykpIH1cclxuXHJcbiAgICAvKiogaGVscGVyIHRvIGFkZCB0byB0aGUgbGlzdCBhIG5ldyBFYXNlLnRhcmdldCBjbGFzczsgc2VlIEVhc2UudG8gY2xhc3MgYmVsb3cgZm9yIHBhcmFtZXRlcnMgKi9cclxuICAgIHRhcmdldCgpIHsgcmV0dXJuIHRoaXMuYWRkKG5ldyBUYXJnZXQoLi4uYXJndW1lbnRzKSkgfVxyXG5cclxuICAgIC8qKiBoZWxwZXIgdG8gYWRkIHRvIHRoZSBsaXN0IGEgbmV3IEVhc2UuYW5nbGUgdGludDsgc2VlIEVhc2UudG8gY2xhc3MgYmVsb3cgZm9yIHBhcmFtZXRlcnMgKi9cclxuICAgIHRpbnQoKSB7IHJldHVybiB0aGlzLmFkZChuZXcgVGludCguLi5hcmd1bWVudHMpKSB9XHJcblxyXG4gICAgLyoqIGhlbHBlciB0byBhZGQgdG8gdGhlIGxpc3QgYSBuZXcgRWFzZS53YWl0IGNsYXNzOyBzZWUgRWFzZS50byBjbGFzcyBiZWxvdyBmb3IgcGFyYW1ldGVycyAqL1xyXG4gICAgd2FpdCgpIHsgcmV0dXJuIHRoaXMuYWRkKG5ldyBXYWl0KC4uLmFyZ3VtZW50cykpIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFYXNlIl19

/***/ }),

/***/ 217:
/***/ (function(module, exports, __webpack_require__) {

// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = __webpack_require__(218);

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = __webpack_require__(220);

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = __webpack_require__(223);

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = __webpack_require__(222);

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = __webpack_require__(221);

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = __webpack_require__(219);

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = __webpack_require__(224);

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;


/***/ }),

/***/ 218:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(202) && __webpack_require__(204)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(202)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(200)(module)))

/***/ }),

/***/ 219:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(202) && __webpack_require__(204)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(202)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(200)(module)))

/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(202) && __webpack_require__(204)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(202)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(200)(module)))

/***/ }),

/***/ 221:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(202) && __webpack_require__(204)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(202)   // present with an AMD loader
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(200)(module)))

/***/ }),

/***/ 222:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(202) && __webpack_require__(204)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(202)   // present with an AMD loader
);


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(200)(module)))

/***/ }),

/***/ 223:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(202) && __webpack_require__(204)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(202)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(200)(module)))

/***/ }),

/***/ 224:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//
var global = this,
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}
math['seed' + rngname] = seedrandom;

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = __webpack_require__(228);
  } catch (ex) {}
} else if (true) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return seedrandom; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);


/***/ }),

/***/ 225:
/***/ (function(module, exports) {

// angle.js <https://github.com/davidfig/anglejs>
// Released under MIT license <https://github.com/davidfig/angle/blob/master/LICENSE>
// Author: David Figatner
// Copyright (c) 2016-17 YOPEY YOPEY LLC

var _toDegreeConversion = 180 / Math.PI
var _toRadianConversion = Math.PI / 180

/** @constant {number} */
var UP = Math.PI / 2
var DOWN = 3 * Math.PI / 2
var LEFT = Math.PI
var RIGHT = 0

var NORTH = UP
var SOUTH = DOWN
var WEST = LEFT
var EAST = RIGHT

var PI_2 = Math.PI * 2
var PI_QUARTER = Math.PI / 4
var PI_HALF = Math.PI / 2

/**
 * converts from radians to degrees (all other functions expect radians)
 * @param {number} radians
 * @return {number} degrees
 */
function toDegrees(radians)
{
    return radians * _toDegreeConversion
}

/**
 * converts from degrees to radians (all other functions expect radians)
 * @param {number} degrees
 * @return {number} radians
 */
function toRadians(degrees)
{
    return degrees * _toRadianConversion
}

/**
 * returns whether the target angle is between angle1 and angle2 (in radians)
 * (based on: http://stackoverflow.com/questions/11406189/determine-if-angle-lies-between-2-other-angles)
 * @param {number} target angle
 * @param {number} angle1
 * @param {number} angle2
 * @return {boolean}
 */
function isAngleBetween(target, angle1, angle2)
{
    var rAngle = ((angle2 - angle1) % PI_2 + PI_2) % PI_2
    if (rAngle >= Math.PI)
    {
        var swap = angle1
        angle1 = angle2
        angle2 = swap
    }

    if (angle1 <= angle2)
    {
        return target >= angle1 && target <= angle2
    }
    else
    {
        return target >= angle1 || target <= angle2
    }
}

/**
 * returns +1 or -1 based on whether the difference between two angles is positive or negative (in radians)
 * @param {number} target angle
 * @param {number} source angle
 * @return {number} 1 or -1
 */
function differenceAnglesSign(target, source)
{
    function mod(a, n)
    {
        return (a % n + n) % n
    }

    var a = target - source
    return mod((a + Math.PI), PI_2) - Math.PI > 0 ? 1 : -1
}

/**
 * returns the normalized difference between two angles (in radians)
 * @param {number} a - first angle
 * @param {number} b - second angle
 * @return {number} normalized difference between a and b
 */
function differenceAngles(a, b)
{
    var c = Math.abs(a - b) % PI_2
    return c > Math.PI ? (PI_2 - c) : c
}

/**
 * returns a target angle that is the shortest way to rotate an object between start and to--may choose a negative angle
 * @param {number} start
 * @param {number} to
 * @return {number} shortest target angle
 */
function shortestAngle(start, to)
{
    var difference = differenceAngles(to, start)
    var sign = differenceAnglesSign(to, start)
    var delta = difference * sign
    return delta + start
}

/**
 * returns the normalized angle (0 - PI x 2)
 * @param {number} radians
 * @return {number} normalized angle in radians
 */
function normalize(radians)
{
    return radians - PI_2 * Math.floor(radians / PI_2)
}

/**
 * returns angle between two points (in radians)
 * @param {Point} [point1] {x: x, y: y}
 * @param {Point} [point2] {x: x, y: y}
 * @param {number} [x1]
 * @param {number} [y1]
 * @param {number} [x2]
 * @param {number} [y2]
 * @return {number} angle
 */
function angleTwoPoints(/* (point1, point2) OR (x1, y1, x2, y2) */)
{
    if (arguments.length === 4)
    {
        return Math.atan2(arguments[3] - arguments[1], arguments[2] - arguments[0])
    }
    else
    {
        return Math.atan2(arguments[1].y - arguments[0].y, arguments[1].x - arguments[0].x)
    }
}

/**
 * returns distance between two points
 * @param {Point} [point1] {x: x, y: y}
 * @param {Point} [point2] {x: x, y: y}
 * @param {number} [x1]
 * @param {number} [y1]
 * @param {number} [x2]
 * @param {number} [y2]
 * @return {number} distance
 */
function distanceTwoPoints(/* (point1, point2) OR (x1, y1, x2, y2) */)
{
    if (arguments.length === 2)
    {
        return Math.sqrt(Math.pow(arguments[1].x - arguments[0].x, 2) + Math.pow(arguments[1].y - arguments[0].y, 2))
    }
    else
    {
        return Math.sqrt(Math.pow(arguments[2] - arguments[0], 2) + Math.pow(arguments[3] - arguments[1], 2))
    }
}

/**
 * returns the squared distance between two points
 * @param {Point} [point1] {x: x, y: y}
 * @param {Point} [point2] {x: x, y: y}
 * @param {number} [x1]
 * @param {number} [y1]
 * @param {number} [x2]
 * @param {number} [y2]
 * @return {number} squared distance
 */
function distanceTwoPointsSquared(/* (point1, point2) OR (x1, y1, x2, y2) */)
{
    if (arguments.length === 2)
    {
        return Math.pow(arguments[1].x - arguments[0].x, 2) + Math.pow(arguments[1].y - arguments[0].y, 2)
    }
    else
    {
        return Math.pow(arguments[2] - arguments[0], 2) + Math.pow(arguments[3] - arguments[1], 2)
    }
}

/**
 * returns the closest cardinal (N, S, E, W) to the given angle (in radians)
 * @param {number} angle
 * @return {number} closest cardinal in radians
 */
function closestAngle(angle)
{
    var left = differenceAngles(angle, LEFT)
    var right = differenceAngles(angle, RIGHT)
    var up = differenceAngles(angle, UP)
    var down = differenceAngles(angle, DOWN)
    if (left <= right && left <= up && left <= down)
    {
        return LEFT
    }
    else if (right <= up && right <= down)
    {
        return RIGHT
    }
    else if (up <= down)
    {
        return UP
    }
    else
    {
        return DOWN
    }
}

/**
 * checks whether angles a1 and a2 are equal (after normalizing)
 * @param {number} a1
 * @param {number} a2
 * @param {number} [wiggle] return true if the difference between the angles is <= wiggle
 * @return {boolean} a1 === a2
 */
function equals(a1, a2, wiggle)
{
    if (wiggle)
    {
        return differenceAngles(a1, a2) < wiggle
    }
    else
    {
        return normalize(a1) === normalize(a2)
    }
}

/**
 * return a text representation of the cardinal direction
 * @param {number} angle
 * @returns {string} UP, DOWN, LEFT, RIGHT, or NOT CARDINAL
 */
function explain(angle)
{
    switch (angle)
    {
        case UP: return 'UP'
        case DOWN: return 'DOWN'
        case LEFT: return 'LEFT'
        case RIGHT: return 'RIGHT'
        default: return 'NOT CARDINAL'
    }
}

module.exports = {
    UP: UP,
    DOWN: DOWN,
    LEFT: LEFT,
    RIGHT: RIGHT,
    NORTH: NORTH,
    SOUTH: SOUTH,
    WEST: WEST,
    EAST: EAST,
    PI_2: PI_2,
    PI_QUARTER: PI_QUARTER,
    PI_HALF: PI_HALF,

    toDegrees: toDegrees,
    toRadians: toRadians,
    isAngleBetween: isAngleBetween,
    differenceAnglesSign: differenceAnglesSign,
    differenceAngles: differenceAngles,
    shortestAngle: shortestAngle,
    normalize: normalize,
    angleTwoPoints: angleTwoPoints,
    distanceTwoPoints: distanceTwoPoints,
    distanceTwoPointsSquared: distanceTwoPointsSquared,
    closestAngle: closestAngle,
    equals: equals,
    explain: explain
}

/***/ }),

/***/ 226:
/***/ (function(module, exports, __webpack_require__) {

// yy-color
// by David Figatner
// MIT License
// (c) YOPEY YOPEY LLC 2017
// https://github.com/davidfig/color

var Random = __webpack_require__(227)

/**
 * converts a #FFFFFF to 0x123456
 * @param  {string} color
 * @return {string}
 */
function poundToHex(color)
{
    return '0x' + parseInt(color.substr(1)).toString(16)
}

/**
 * converts a 0x123456 to #FFFFFF
 * @param  {string} color
 * @return {string}
 */
function hexToPound(color)
{
    return '#' + color.substr(2)
}

/**
 * converts a number to #FFFFFF
 * @param  {number} color
 * @return {string}
 */
function valueToPound(color)
{
    return '#' + color.toString(16)
}

/**
 * based on tinycolor
 * https://github.com/bgrins/TinyColor
 * BSD license: https://github.com/bgrins/TinyColor/blob/master/LICENSE
 * @param {string} color
 * @returns {object}
 */
function hexToHsl (color)
{
    var rgb = this.hexToRgb(color),
        r = rgb.r,
        g = rgb.g,
        b = rgb.b
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b)
    var h, s, l = (max + min) / 2

    if (max === min)
    {
        h = s = 0 // achromatic
    }
    else
    {
        var d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max)
        {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }

        h /= 6
    }

    return { h: h, s: s, l: l }
}

/** based on tinycolor
* https://github.com/bgrins/TinyColor
* BSD license: https://github.com/bgrins/TinyColor/blob/master/LICENSE
* @param {object|number} color {h, s, b} or h
* @param {number} [s]
* @param {number} [l]
* @returns number
*/
function hslToHex(color)
{
    var r, g, b, h, s, l
    if (arguments.length === 1)
    {
        h = color.h,
        s = color.s,
        l = color.l
    }
    else
    {
        h = arguments[0]
        s = arguments[1]
        l = arguments[2]
    }

    function hue2rgb(p, q, t) {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
    }

    if (s === 0)
    {
        r = g = b = l // achromatic
    }
    else
    {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s
        var p = 2 * l - q
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
    }

    return this.rgbToHex(r * 255, g * 255, b * 255)
}

/* darkens a color by the percentage
* @param {object} color in hex (0xabcdef)
* @param {number} amount
* @return {number}
*/
function darken(color, amount)
{
    return this.blend(amount, color, 0)
}

/** based on tinycolor
* https://github.com/bgrins/TinyColor
* BSD license: https://github.com/bgrins/TinyColor/blob/master/LICENSE
* @param {object} color
* @param {number} amount
*/
function saturate(color, amount)
{
    amount = (amount === 0) ? 0 : (amount || 10)
    var hsl = this.hexToHsl(color)
    hsl.s += amount / 100
    hsl.s = Math.min(1, Math.max(0, hsl.s))
    return this.hslToHex(hsl)
}

/** based on tinycolor
* https://github.com/bgrins/TinyColor
* BSD license: https://github.com/bgrins/TinyColor/blob/master/LICENSE
* @param {object} color
* @param {number} amount
*/
function desaturate(color, amount)
{
    amount = (amount === 0) ? 0 : (amount || 10)
    var hsl = this.hexToHsl(color)
    hsl.s -= amount / 100
    hsl.s = Math.min(1, Math.max(0, hsl.s))
    return this.hslToHex(hsl)
}

/**
 * blends two colors together
 * @param  {number} percent [0.0 - 1.0]
 * @param  {string} color1 first color in 0x123456 format
 * @param  {string} color2 second color in 0x123456 format
 * @return {number}
 */
function blend(percent, color1, color2)
{
    if (percent === 0)
    {
        return color1
    }
    if (percent === 1)
    {
        return color2
    }
    var r1 = color1 >> 16
    var g1 = color1 >> 8 & 0x0000ff
    var b1 = color1 & 0x0000ff
    var r2 = color2 >> 16
    var g2 = color2 >> 8 & 0x0000ff
    var b2 = color2 & 0x0000ff
    var percent1 = 1 - percent
    var r = percent1 * r1 + percent * r2
    var g = percent1 * g1 + percent * g2
    var b = percent1 * b1 + percent * b2
    return r << 16 | g << 8 | b
}

/**
 * returns a hex color into an rgb value
 * @param  {number} hex
 * @return {string}
 */
function hexToRgb(hex)
{
    if (hex === 0)
    {
        hex = '0x000000'
    }
    else if (typeof hex !== 'string')
    {
        var s = '000000' + hex.toString(16)
        hex = '0x' + s.substr(s.length - 6)
    }
    var result = /^0x?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

/**
 * rgb color to hex in the form of 0x123456
 * @param  {(number|string)} r first number or 'rgb(...)' string
 * @param  {(number|null)} g
 * @param  {(number|null)} b
 * @return {string}
 */
function rgbToHex(r, g, b)
{
    if (arguments.length === 1) {
        if (Array.isArray(arguments[0])) {
            var number = arguments[0]
            r = number[0]
            g = number[1]
            b = number[2]
        } else {
            var parse = r.replace(/( *rgb *\( *)|( )|(\) *;?)/,'')
            var numbers = parse.split(',')
            r = numbers[0]
            g = numbers[1]
            b = numbers[2]
        }
    }
    return '0x' + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1)
}

/**
 * returns a random color with balanced r, g, b values (i.e., r, g, b either have the same value or are 0)
 * @param {number} min value for random number
 * @param {number} max value for random number
 * @return {number} color
 */
function random(min, max)
{
    function random()
    {
        return Random.range(min, max)
    }

    var colors = [{r:1, g:1, b:1}, {r:1, g:1, b:0}, {r:1,g:0,b:1}, {r:0,g:1,b:1}, {r:1,g:0,b:0}, {r:0,g:1,b:0}, {r:0,g:0,b:1}]
    var color = Random.pick(colors)
    min = min || 0
    max = max || 255
    return this.rgbToHex(color.r ? random() : 0, color.g ? random() : 0, color.b ? random() : 0)
}

// h: 0-360, s: 0-1, l: 0-1
/**
 * returns a random color based on hsl
 * @param {number} hMin [0, 360]
 * @param {number} hMax [hMin, 360]
 * @param {number} sMin [0, 1]
 * @param {number} sMax [sMin, 1]
 * @param {number} lMin [0, 1]
 * @param {number} lMax [lMin, 1]
 */
function randomHSL(hMin, hMax, sMin, sMax, lMin, lMax)
{
    var color = {
        h: Random.range(hMin, hMax),
        s: Random.range(sMin, sMax, true),
        l: Random.range(lMin, lMax, true)
    }
    return this.hslToHex(color)
}

/**
 * returns random colors based on HSL with different hues
 * based on http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
 * @returns {number[]} colors in hex format (0x123456)
 */
function randomGoldenRatioHSL(count, saturation, luminosity)
{
    var goldenRatio = 0.618033988749895
    var h = Random.get(1, true)
    var colors = []
    for (var i = 0; i < count; i++)
    {
        colors.push(this.hslToHex(h, saturation, luminosity))
        h = (h + goldenRatio) % 1
    }
    return colors
}

module.exports = {
    poundToHex: poundToHex,
    hexToPound: hexToPound,
    valueToPound: valueToPound,
    hexToHsl: hexToHsl,
    hslToHex: hslToHex,
    hexToRgb: hexToRgb,
    rgbToHex: rgbToHex,
    darken: darken,
    saturate: saturate,
    desaturate: desaturate,
    blend: blend,
    random: random,
    randomHSL: randomHSL,
    randomGoldenRatioHSL: randomGoldenRatioHSL
}

/***/ }),

/***/ 227:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// yy-random
// by David Figatner
// MIT license
// copyright YOPEY YOPEY LLC 2016-17
// https://github.com/davidfig/random

var seedrandom = __webpack_require__(217);

var Random = function () {
    function Random() {
        _classCallCheck(this, Random);

        this.generator = Math.random;
    }

    /**
     * generates a seeded number
     * @param {number} seed
     * @param {object} [options]
     * @param {string} [PRNG="alea"] - name of algorithm, see https://github.com/davidbau/seedrandom
     * @param {(boolean|string)} [state] - can include the state returned from save()
     */


    _createClass(Random, [{
        key: 'seed',
        value: function seed(_seed, options) {
            options = options || {};
            this.generator = seedrandom[options.PRNG || 'alea'](_seed, { state: options.state });
            this.options = options;
        }

        /**
         * saves the state of the random generator
         * can only be used after Random.seed() is called with options.state = true
         * @returns {number} state
         */

    }, {
        key: 'save',
        value: function save() {
            if (this.generator !== Math.random) {
                return this.generator.state();
            }
        }

        /**
         * restores the state of the random generator
         * @param {number} state
         */

    }, {
        key: 'restore',
        value: function restore(state) {
            this.generator = seedrandom[this.options.PRNG || 'alea']('', { state: state });
        }

        /**
         * changes the generator to use the old Math.sin-based random function
         * based on : http://stackoverflow.com/questions/521295/javascript-random-seeds
         * (deprecated) Use only for compatibility purposes
         * @param {number} seed
         */

    }, {
        key: 'seedOld',
        value: function seedOld(seed) {
            this.generator = function () {
                var x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            };
        }

        /**
         * create a separate random generator using the seed
         * @param {number} seed
         * @return {object}
         */

    }, {
        key: 'separateSeed',
        value: function separateSeed(seed) {
            var random = new Random();
            random.seed(seed);
            return random;
        }

        /**
         * resets the random number this.generator to Math.random()
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.generator = Math.random;
        }

        /**
         * returns a random number using the this.generator between [0, ceiling - 1]
         * @param {number} ceiling
         * @param {boolean} [useFloat=false]
         * @return {number}
         */

    }, {
        key: 'get',
        value: function get(ceiling, useFloat) {
            var negative = ceiling < 0 ? -1 : 1;
            ceiling *= negative;
            var result = void 0;
            if (useFloat) {
                result = this.generator() * ceiling;
            } else {
                result = Math.floor(this.generator() * ceiling);
            }
            return result * negative;
        }

        /**
         * returns a random integer between 0 - Number.MAX_SAFE_INTEGER
         * @return {number}
         */

    }, {
        key: 'getHuge',
        value: function getHuge() {
            return this.get(Number.MAX_SAFE_INTEGER);
        }

        /**
         * random number [middle - range, middle + range]
         * @param {number} middle
         * @param {number} delta
         * @param {boolean} [useFloat=false]
         * @return {number}
         */

    }, {
        key: 'middle',
        value: function middle(_middle, delta, useFloat) {
            var half = delta / 2;
            return this.range(_middle - half, _middle + half, useFloat);
        }

        /**
         * random number [start, end]
         * @param {number} start
         * @param {number} end
         * @param {boolean} [useFloat=false] if true, then range is (start, end)--i.e., not inclusive to start and end
         * @return {number}
         */

    }, {
        key: 'range',
        value: function range(start, end, useFloat) {
            // case where there is no range
            if (end === start) {
                return end;
            }

            if (useFloat) {
                return this.get(end - start, true) + start;
            } else {
                var range = void 0;
                if (start < 0 && end > 0) {
                    range = -start + end + 1;
                } else if (start === 0 && end > 0) {
                    range = end + 1;
                } else if (start < 0 && end === 0) {
                    range = start - 1;
                    start = 1;
                } else if (start < 0 && end < 0) {
                    range = end - start - 1;
                } else {
                    range = end - start + 1;
                }
                return Math.floor(this.generator() * range) + start;
            }
        }

        /**
         * an array of random numbers between [start, end]
         * @param {number} start
         * @param {number} end
         * @param {number} count
         * @param {boolean} [useFloat=false]
         * @return {number[]}
         */

    }, {
        key: 'rangeMultiple',
        value: function rangeMultiple(start, end, count, useFloat) {
            var array = [];
            for (var i = 0; i < count; i++) {
                array.push(this.range(start, end, useFloat));
            }
            return array;
        }

        /**
         * an array of random numbers between [middle - range, middle + range]
         * @param {number} middle
         * @param {number} range
         * @param {number} count
         * @param {boolean} [useFloat=false]
         * @return {number[]}
         */

    }, {
        key: 'middleMultiple',
        value: function middleMultiple(middle, range, count, useFloat) {
            var array = [];
            for (var i = 0; i < count; i++) {
                array.push(middle(middle, range, useFloat));
            }
            return array;
        }

        /**
         * @param {number} [chance=0.5]
         * returns random sign (either +1 or -1)
         * @return {number}
         */

    }, {
        key: 'sign',
        value: function sign(chance) {
            chance = chance || 0.5;
            return this.generator() < chance ? 1 : -1;
        }

        /**
         * tells you whether a random chance was achieved
         * @param {number} [percent=0.5]
         * @return {boolean}
         */

    }, {
        key: 'chance',
        value: function chance(percent) {
            return this.generator() < (percent || 0.5);
        }

        /**
         * returns a random angle in radians [0 - 2 * Math.PI)
         */

    }, {
        key: 'angle',
        value: function angle() {
            return this.get(Math.PI * 2, true);
        }

        /**
         * Shuffle array (either in place or copied)
         * from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
         * @param {Array} array
         * @param {boolean} [copy=false] whether to shuffle in place (default) or return a new shuffled array
         * @return {Array} a shuffled array
         */

    }, {
        key: 'shuffle',
        value: function shuffle(array, copy) {
            if (copy) {
                array = array.slice();
            }
            if (array.length === 0) {
                return array;
            }

            var currentIndex = array.length,
                temporaryValue = void 0,
                randomIndex = void 0;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = this.get(currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }

        /**
         * picks a random element from an array
         * @param {Array} array
         * @return {*}
         */

    }, {
        key: 'pick',
        value: function pick(array, remove) {
            if (!remove) {
                return array[this.get(array.length)];
            } else {
                var pick = this.get(array.length);
                var temp = array[pick];
                array.splice(pick, 1);
                return temp;
            }
        }

        /**
         * returns a random property from an object
         * from http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
         * @param {object} obj
         * @return {*}
         */

    }, {
        key: 'property',
        value: function property(obj) {
            var result;
            var count = 0;
            for (var prop in obj) {
                if (this.chance(1 / ++count)) {
                    result = prop;
                }
            }
            return result;
        }

        /**
         * creates a random set where each entry is a value between [min, max]
         * @param {number} min
         * @param {number} max
         * @param {number} amount of numbers in set
         * @param {number[]}
         */

    }, {
        key: 'set',
        value: function set(min, max, amount) {
            var set = [],
                all = [],
                i;
            for (i = min; i < max; i++) {
                all.push(i);
            }

            for (i = 0; i < amount; i++) {
                var found = this.get(all.length);
                set.push(all[found]);
                all.splice(found, 1);
            }
            return set;
        }

        /**
         * returns a set of numbers with a randomly even distribution (i.e., no overlapping and filling the space)
         * @param {number} start position
         * @param {number} end position
         * @param {number} count of non-start/end points
         * @param {boolean} [includeStart=false] includes start point (count++)
         * @param {boolean} [includeEnd=false] includes end point (count++)
         * @param {boolean} [useFloat=false]
         * @param {number[]}
         */

    }, {
        key: 'distribution',
        value: function distribution(start, end, count, includeStart, includeEnd, useFloat) {
            var interval = Math.floor((end - start) / count);
            var halfInterval = interval / 2;
            var quarterInterval = interval / 4;
            var set = [];
            if (includeStart) {
                set.push(start);
            }
            for (var i = 0; i < count; i++) {
                set.push(start + i * interval + halfInterval + this.range(-quarterInterval, quarterInterval, useFloat));
            }
            if (includeEnd) {
                set.push(end);
            }
            return set;
        }

        /**
         * returns a random number based on weighted probability between [min, max]
         * from http://stackoverflow.com/questions/22656126/javascript-random-number-with-weighted-probability
         * @param {number} min value
         * @param {number} max value
         * @param {number} target for average value
         * @param {number} stddev - standard deviation
         */

    }, {
        key: 'weightedProbabilityInt',
        value: function weightedProbabilityInt(min, max, target, stddev) {
            function normRand() {
                var x1 = void 0,
                    x2 = void 0,
                    rad = void 0;
                do {
                    x1 = 2 * this.get(1, true) - 1;
                    x2 = 2 * this.get(1, true) - 1;
                    rad = x1 * x1 + x2 * x2;
                } while (rad >= 1 || rad === 0);
                var c = Math.sqrt(-2 * Math.log(rad) / rad);
                return x1 * c;
            }

            stddev = stddev || 1;
            if (Math.random() < 0.81546) {
                while (true) {
                    var sample = normRand() * stddev + target;
                    if (sample >= min && sample <= max) {
                        return sample;
                    }
                }
            } else {
                return this.range(min, max);
            }
        }

        /*
         * returns a random hex color (0 - 0xffffff)
         * @return {number}
         */

    }, {
        key: 'color',
        value: function color() {
            return this.get(0xffffff);
        }
    }]);

    return Random;
}();

module.exports = new Random();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB5eS1yYW5kb21cbi8vIGJ5IERhdmlkIEZpZ2F0bmVyXG4vLyBNSVQgbGljZW5zZVxuLy8gY29weXJpZ2h0IFlPUEVZIFlPUEVZIExMQyAyMDE2LTE3XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRmaWcvcmFuZG9tXG5cbmNvbnN0IHNlZWRyYW5kb20gPSByZXF1aXJlKCdzZWVkcmFuZG9tJylcblxuY2xhc3MgUmFuZG9tXG57XG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBNYXRoLnJhbmRvbVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdlbmVyYXRlcyBhIHNlZWRlZCBudW1iZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW1BSTkc9XCJhbGVhXCJdIC0gbmFtZSBvZiBhbGdvcml0aG0sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZGF2aWRiYXUvc2VlZHJhbmRvbVxuICAgICAqIEBwYXJhbSB7KGJvb2xlYW58c3RyaW5nKX0gW3N0YXRlXSAtIGNhbiBpbmNsdWRlIHRoZSBzdGF0ZSByZXR1cm5lZCBmcm9tIHNhdmUoKVxuICAgICAqL1xuICAgIHNlZWQoc2VlZCwgb3B0aW9ucylcbiAgICB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gc2VlZHJhbmRvbVtvcHRpb25zLlBSTkcgfHwgJ2FsZWEnXShzZWVkLCB7IHN0YXRlOiBvcHRpb25zLnN0YXRlIH0pXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzYXZlcyB0aGUgc3RhdGUgb2YgdGhlIHJhbmRvbSBnZW5lcmF0b3JcbiAgICAgKiBjYW4gb25seSBiZSB1c2VkIGFmdGVyIFJhbmRvbS5zZWVkKCkgaXMgY2FsbGVkIHdpdGggb3B0aW9ucy5zdGF0ZSA9IHRydWVcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBzdGF0ZVxuICAgICAqL1xuICAgIHNhdmUoKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdG9yICE9PSBNYXRoLnJhbmRvbSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdG9yLnN0YXRlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc3RvcmVzIHRoZSBzdGF0ZSBvZiB0aGUgcmFuZG9tIGdlbmVyYXRvclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0ZVxuICAgICAqL1xuICAgIHJlc3RvcmUoc3RhdGUpXG4gICAge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IHNlZWRyYW5kb21bdGhpcy5vcHRpb25zLlBSTkcgfHwgJ2FsZWEnXSgnJywgeyBzdGF0ZSB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNoYW5nZXMgdGhlIGdlbmVyYXRvciB0byB1c2UgdGhlIG9sZCBNYXRoLnNpbi1iYXNlZCByYW5kb20gZnVuY3Rpb25cbiAgICAgKiBiYXNlZCBvbiA6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTIxMjk1L2phdmFzY3JpcHQtcmFuZG9tLXNlZWRzXG4gICAgICogKGRlcHJlY2F0ZWQpIFVzZSBvbmx5IGZvciBjb21wYXRpYmlsaXR5IHB1cnBvc2VzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNlZWRcbiAgICAgKi9cbiAgICBzZWVkT2xkKHNlZWQpXG4gICAge1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgeCA9IE1hdGguc2luKHNlZWQrKykgKiAxMDAwMFxuICAgICAgICAgICAgcmV0dXJuIHggLSBNYXRoLmZsb29yKHgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgYSBzZXBhcmF0ZSByYW5kb20gZ2VuZXJhdG9yIHVzaW5nIHRoZSBzZWVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNlZWRcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgc2VwYXJhdGVTZWVkKHNlZWQpXG4gICAge1xuICAgICAgICBjb25zdCByYW5kb20gPSBuZXcgUmFuZG9tKClcbiAgICAgICAgcmFuZG9tLnNlZWQoc2VlZClcbiAgICAgICAgcmV0dXJuIHJhbmRvbVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc2V0cyB0aGUgcmFuZG9tIG51bWJlciB0aGlzLmdlbmVyYXRvciB0byBNYXRoLnJhbmRvbSgpXG4gICAgICovXG4gICAgcmVzZXQoKVxuICAgIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBNYXRoLnJhbmRvbVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gbnVtYmVyIHVzaW5nIHRoZSB0aGlzLmdlbmVyYXRvciBiZXR3ZWVuIFswLCBjZWlsaW5nIC0gMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY2VpbGluZ1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQoY2VpbGluZywgdXNlRmxvYXQpXG4gICAge1xuICAgICAgICBjb25zdCBuZWdhdGl2ZSA9IGNlaWxpbmcgPCAwID8gLTEgOiAxXG4gICAgICAgIGNlaWxpbmcgKj0gbmVnYXRpdmVcbiAgICAgICAgbGV0IHJlc3VsdFxuICAgICAgICBpZiAodXNlRmxvYXQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZ2VuZXJhdG9yKCkgKiBjZWlsaW5nXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQgPSBNYXRoLmZsb29yKHRoaXMuZ2VuZXJhdG9yKCkgKiBjZWlsaW5nKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQgKiBuZWdhdGl2ZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIDAgLSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXRIdWdlKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChOdW1iZXIuTUFYX1NBRkVfSU5URUdFUilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByYW5kb20gbnVtYmVyIFttaWRkbGUgLSByYW5nZSwgbWlkZGxlICsgcmFuZ2VdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pZGRsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWx0YVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBtaWRkbGUobWlkZGxlLCBkZWx0YSwgdXNlRmxvYXQpXG4gICAge1xuICAgICAgICBjb25zdCBoYWxmID0gZGVsdGEgLyAyXG4gICAgICAgIHJldHVybiB0aGlzLnJhbmdlKG1pZGRsZSAtIGhhbGYsIG1pZGRsZSArIGhhbGYsIHVzZUZsb2F0KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJhbmRvbSBudW1iZXIgW3N0YXJ0LCBlbmRdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXSBpZiB0cnVlLCB0aGVuIHJhbmdlIGlzIChzdGFydCwgZW5kKS0taS5lLiwgbm90IGluY2x1c2l2ZSB0byBzdGFydCBhbmQgZW5kXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIHJhbmdlKHN0YXJ0LCBlbmQsIHVzZUZsb2F0KVxuICAgIHtcbiAgICAgICAgLy8gY2FzZSB3aGVyZSB0aGVyZSBpcyBubyByYW5nZVxuICAgICAgICBpZiAoZW5kID09PSBzdGFydClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGVuZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVzZUZsb2F0KVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoZW5kIC0gc3RhcnQsIHRydWUpICsgc3RhcnRcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxldCByYW5nZVxuICAgICAgICAgICAgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPiAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJhbmdlID0gLXN0YXJ0ICsgZW5kICsgMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID4gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByYW5nZSA9IGVuZCArIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPT09IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBzdGFydCAtIDFcbiAgICAgICAgICAgICAgICBzdGFydCA9IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YXJ0IDwgMCAmJiBlbmQgPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJhbmdlID0gZW5kIC0gc3RhcnQgLSAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSBlbmQgLSBzdGFydCArIDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2VuZXJhdG9yKCkgKiByYW5nZSkgKyBzdGFydFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYW4gYXJyYXkgb2YgcmFuZG9tIG51bWJlcnMgYmV0d2VlbiBbc3RhcnQsIGVuZF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXNlRmxvYXQ9ZmFsc2VdXG4gICAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAgICovXG4gICAgcmFuZ2VNdWx0aXBsZShzdGFydCwgZW5kLCBjb3VudCwgdXNlRmxvYXQpXG4gICAge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy5yYW5nZShzdGFydCwgZW5kLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYW4gYXJyYXkgb2YgcmFuZG9tIG51bWJlcnMgYmV0d2VlbiBbbWlkZGxlIC0gcmFuZ2UsIG1pZGRsZSArIHJhbmdlXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtaWRkbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFuZ2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY291bnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1c2VGbG9hdD1mYWxzZV1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBtaWRkbGVNdWx0aXBsZShtaWRkbGUsIHJhbmdlLCBjb3VudCwgdXNlRmxvYXQpXG4gICAge1xuICAgICAgICBjb25zdCBhcnJheSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKylcbiAgICAgICAge1xuICAgICAgICAgICAgYXJyYXkucHVzaChtaWRkbGUobWlkZGxlLCByYW5nZSwgdXNlRmxvYXQpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbY2hhbmNlPTAuNV1cbiAgICAgKiByZXR1cm5zIHJhbmRvbSBzaWduIChlaXRoZXIgKzEgb3IgLTEpXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIHNpZ24oY2hhbmNlKVxuICAgIHtcbiAgICAgICAgY2hhbmNlID0gY2hhbmNlIHx8IDAuNVxuICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0b3IoKSA8IGNoYW5jZSA/IDEgOiAtMVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRlbGxzIHlvdSB3aGV0aGVyIGEgcmFuZG9tIGNoYW5jZSB3YXMgYWNoaWV2ZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3BlcmNlbnQ9MC41XVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgY2hhbmNlKHBlcmNlbnQpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0b3IoKSA8IChwZXJjZW50IHx8IDAuNSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgcmFuZG9tIGFuZ2xlIGluIHJhZGlhbnMgWzAgLSAyICogTWF0aC5QSSlcbiAgICAgKi9cbiAgICBhbmdsZSgpXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoTWF0aC5QSSAqIDIsIHRydWUpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2h1ZmZsZSBhcnJheSAoZWl0aGVyIGluIHBsYWNlIG9yIGNvcGllZClcbiAgICAgKiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQ1MDk1NC9ob3ctdG8tcmFuZG9taXplLXNodWZmbGUtYS1qYXZhc2NyaXB0LWFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjb3B5PWZhbHNlXSB3aGV0aGVyIHRvIHNodWZmbGUgaW4gcGxhY2UgKGRlZmF1bHQpIG9yIHJldHVybiBhIG5ldyBzaHVmZmxlZCBhcnJheVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhIHNodWZmbGVkIGFycmF5XG4gICAgICovXG4gICAgc2h1ZmZsZShhcnJheSwgY29weSlcbiAgICB7XG4gICAgICAgIGlmIChjb3B5KVxuICAgICAgICB7XG4gICAgICAgICAgICBhcnJheSA9IGFycmF5LnNsaWNlKClcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleFxuXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gICAgICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSB0aGlzLmdldChjdXJyZW50SW5kZXgpXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMVxuXG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF1cbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF1cbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcGlja3MgYSByYW5kb20gZWxlbWVudCBmcm9tIGFuIGFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIHBpY2soYXJyYXksIHJlbW92ZSlcbiAgICB7XG4gICAgICAgIGlmICghcmVtb3ZlKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlbdGhpcy5nZXQoYXJyYXkubGVuZ3RoKV1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHBpY2sgPSB0aGlzLmdldChhcnJheS5sZW5ndGgpXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gYXJyYXlbcGlja11cbiAgICAgICAgICAgIGFycmF5LnNwbGljZShwaWNrLCAxKVxuICAgICAgICAgICAgcmV0dXJuIHRlbXBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gcHJvcGVydHkgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjUzMjIxOC9waWNrLXJhbmRvbS1wcm9wZXJ0eS1mcm9tLWEtamF2YXNjcmlwdC1vYmplY3RcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBwcm9wZXJ0eShvYmopXG4gICAge1xuICAgICAgICB2YXIgcmVzdWx0XG4gICAgICAgIHZhciBjb3VudCA9IDBcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYW5jZSgxIC8gKytjb3VudCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcHJvcFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcmVhdGVzIGEgcmFuZG9tIHNldCB3aGVyZSBlYWNoIGVudHJ5IGlzIGEgdmFsdWUgYmV0d2VlbiBbbWluLCBtYXhdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW1vdW50IG9mIG51bWJlcnMgaW4gc2V0XG4gICAgICogQHBhcmFtIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBzZXQobWluLCBtYXgsIGFtb3VudClcbiAgICB7XG4gICAgICAgIHZhciBzZXQgPSBbXSwgYWxsID0gW10sIGlcbiAgICAgICAgZm9yIChpID0gbWluOyBpIDwgbWF4OyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFsbC5wdXNoKGkpXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYW1vdW50OyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IHRoaXMuZ2V0KGFsbC5sZW5ndGgpXG4gICAgICAgICAgICBzZXQucHVzaChhbGxbZm91bmRdKVxuICAgICAgICAgICAgYWxsLnNwbGljZShmb3VuZCwgMSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGEgc2V0IG9mIG51bWJlcnMgd2l0aCBhIHJhbmRvbWx5IGV2ZW4gZGlzdHJpYnV0aW9uIChpLmUuLCBubyBvdmVybGFwcGluZyBhbmQgZmlsbGluZyB0aGUgc3BhY2UpXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IHBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBwb3NpdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCBvZiBub24tc3RhcnQvZW5kIHBvaW50c1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2luY2x1ZGVTdGFydD1mYWxzZV0gaW5jbHVkZXMgc3RhcnQgcG9pbnQgKGNvdW50KyspXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaW5jbHVkZUVuZD1mYWxzZV0gaW5jbHVkZXMgZW5kIHBvaW50IChjb3VudCsrKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VzZUZsb2F0PWZhbHNlXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119XG4gICAgICovXG4gICAgZGlzdHJpYnV0aW9uKHN0YXJ0LCBlbmQsIGNvdW50LCBpbmNsdWRlU3RhcnQsIGluY2x1ZGVFbmQsIHVzZUZsb2F0KVxuICAgIHtcbiAgICAgICAgdmFyIGludGVydmFsID0gTWF0aC5mbG9vcigoZW5kIC0gc3RhcnQpIC8gY291bnQpXG4gICAgICAgIHZhciBoYWxmSW50ZXJ2YWwgPSBpbnRlcnZhbCAvIDJcbiAgICAgICAgdmFyIHF1YXJ0ZXJJbnRlcnZhbCA9IGludGVydmFsIC8gNFxuICAgICAgICB2YXIgc2V0ID0gW11cbiAgICAgICAgaWYgKGluY2x1ZGVTdGFydClcbiAgICAgICAge1xuICAgICAgICAgICAgc2V0LnB1c2goc3RhcnQpXG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZXQucHVzaChzdGFydCArIGkgKiBpbnRlcnZhbCArIGhhbGZJbnRlcnZhbCArIHRoaXMucmFuZ2UoLXF1YXJ0ZXJJbnRlcnZhbCwgcXVhcnRlckludGVydmFsLCB1c2VGbG9hdCkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluY2x1ZGVFbmQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNldC5wdXNoKGVuZClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIHJhbmRvbSBudW1iZXIgYmFzZWQgb24gd2VpZ2h0ZWQgcHJvYmFiaWxpdHkgYmV0d2VlbiBbbWluLCBtYXhdXG4gICAgICogZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIyNjU2MTI2L2phdmFzY3JpcHQtcmFuZG9tLW51bWJlci13aXRoLXdlaWdodGVkLXByb2JhYmlsaXR5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiB2YWx1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXggdmFsdWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGFyZ2V0IGZvciBhdmVyYWdlIHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0ZGRldiAtIHN0YW5kYXJkIGRldmlhdGlvblxuICAgICAqL1xuICAgIHdlaWdodGVkUHJvYmFiaWxpdHlJbnQobWluLCBtYXgsIHRhcmdldCwgc3RkZGV2KVxuICAgIHtcbiAgICAgICAgZnVuY3Rpb24gbm9ybVJhbmQoKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgeDEsIHgyLCByYWRcbiAgICAgICAgICAgIGRvXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgeDEgPSAyICogdGhpcy5nZXQoMSwgdHJ1ZSkgLSAxXG4gICAgICAgICAgICAgICAgeDIgPSAyICogdGhpcy5nZXQoMSwgdHJ1ZSkgLSAxXG4gICAgICAgICAgICAgICAgcmFkID0geDEgKiB4MSArIHgyICogeDJcbiAgICAgICAgICAgIH0gd2hpbGUgKHJhZCA+PSAxIHx8IHJhZCA9PT0gMClcbiAgICAgICAgICAgIGNvbnN0IGMgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhyYWQpIC8gcmFkKVxuICAgICAgICAgICAgcmV0dXJuIHgxICogY1xuICAgICAgICB9XG5cbiAgICAgICAgc3RkZGV2ID0gc3RkZGV2IHx8IDFcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjgxNTQ2KVxuICAgICAgICB7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzYW1wbGUgPSAoKG5vcm1SYW5kKCkgKiBzdGRkZXYpICsgdGFyZ2V0KVxuICAgICAgICAgICAgICAgIGlmIChzYW1wbGUgPj0gbWluICYmIHNhbXBsZSA8PSBtYXgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2FtcGxlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmFuZ2UobWluLCBtYXgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqIHJldHVybnMgYSByYW5kb20gaGV4IGNvbG9yICgwIC0gMHhmZmZmZmYpXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGNvbG9yKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgweGZmZmZmZilcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFJhbmRvbSgpIl19

/***/ }),

/***/ 228:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pixi = __webpack_require__(11);

var PIXI = _interopRequireWildcard(_pixi);

var _pixiEase = __webpack_require__(215);

var _pixiEase2 = _interopRequireDefault(_pixiEase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        var list = new _pixiEase2.default.list();
        var POSITION_X = PARTICLE.x - 50 - _this.getRandomInt(-30, 30);
        var DURATION = _this.getRandomInt(3000, 5000);
        list.to(PARTICLE, { x: POSITION_X }, DURATION, {
          ease: "easeInOutSine",
          repeat: true,
          reverse: true
        });
      }

      app.ticker.add(function () {
        for (var _index = 0; _index < PARTICLES.length; _index++) {
          //配列からデータ取得
          var _PARTICLE = PARTICLES[_index];
          var POSITION = positions[_index];
          var TURNED = turned[_index];

          //横の位置
          // const SWING =
          //   TURNED === "left" ? Math.random() * 50 : Math.random() * -50;
          // PARTICLE.x += SWING * (PARTICLE.width / 5000);

          // if (PARTICLE.x >= POSITION + 50) turned[index] = "right";
          // if (PARTICLE.x <= POSITION - 50) turned[index] = "left";

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