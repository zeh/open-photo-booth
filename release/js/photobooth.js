var PhotoBooth;
(function (PhotoBooth) {
    var FilterDefinition = (function () {
        function FilterDefinition(shader, vignetteOpacity, grainOpacity) {
            this.shader = shader;
            this.vignetteOpacity = vignetteOpacity;
            this.grainOpacity = grainOpacity;
        }
        return FilterDefinition;
    })();
    PhotoBooth.FilterDefinition = FilterDefinition;
    var FilterFactory = (function () {
        function FilterFactory() {
        }
        FilterFactory._constructor = (function () {
            FilterFactory.filters = new Array();
            FilterFactory.filters.push(new FilterDefinition(new PIXI.SepiaFilter(), 0.5, 0.5));
            var mtx = new PIXI.ColorMatrixFilter();
            mtx.matrix = [
                0.2,
                0.6,
                0.2,
                0,
                0.2,
                0.6,
                0.2,
                0,
                0.2,
                0.6,
                0.2,
                0,
                0,
                0,
                0,
                1
            ];
            FilterFactory.filters.push(new FilterDefinition(mtx, 0.5, 0.5));
            mtx = new PIXI.ColorMatrixFilter();
            mtx.matrix = [
                0.5,
                0,
                0,
                0,
                0,
                0.5,
                0,
                0,
                0,
                0,
                0.5,
                0,
                0,
                0,
                0,
                1
            ];
            FilterFactory.filters.push(new FilterDefinition(mtx, 0.5, 0.5));
        })();
        return FilterFactory;
    })();
    PhotoBooth.FilterFactory = FilterFactory;
})(PhotoBooth || (PhotoBooth = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PhotoBooth;
(function (PhotoBooth) {
    var CameraSprite = (function (_super) {
        __extends(CameraSprite, _super);
        function CameraSprite(desiredWidth, desiredHeight) {
            _super.call(this);
            this.desiredWidth = desiredWidth;
            this.desiredHeight = desiredHeight;
            if (this.hasGetUserMedia()) {
                this.getUserMedia({
                    video: {
                        mandatory: {
                            maxWidth: desiredWidth,
                            minHeight: desiredHeight,
                        },
                        optional: [
                            { height: 650 },
                            { aspectRatio: 1 / 2 },
                        ]
                    }
                }, this.onLocalStreamCapture.bind(this), this.onLocalStreamError.bind(this));
            }
            else {
                console.error("getUserMedia() is not supported.");
            }
        }
        CameraSprite.prototype.createVideoElement = function () {
            console.log("Creating video");
            this.video = document.createElement("video");
            this.video.autoplay = true;
            this.video.play();
            this.video.src = URL.createObjectURL(this.localMediaStream);
            this.video.onloadedmetadata = this.onVideoLoadedMetaData.bind(this);
        };
        CameraSprite.prototype.createVideoSprite = function () {
            console.log("Creating texture");
            this.videoTexture = PIXI.VideoTexture.textureFromVideo(this.video, PIXI.scaleModes.LINEAR);
            this.videoSprite = new PIXI.Sprite(this.videoTexture);
            this.addChild(this.videoSprite);
            this.videoSprite.scale.x = this.desiredWidth / this.video.videoWidth;
            this.videoSprite.scale.y = this.desiredHeight / this.video.videoHeight;
            this.videoSprite.interactive = true;
            this.currentFilterTemp = 0;
            this.videoSprite.shader = PhotoBooth.FilterFactory.filters[0].shader;
        };
        CameraSprite.prototype.getUserMediaWrapper = function () {
            var func = navigator["getUserMedia"] || navigator["webkitGetUserMedia"] || navigator["mozGetUserMedia"] || navigator["msGetUserMedia"];
            if (func != undefined)
                func = func.bind(navigator);
            return func;
        };
        CameraSprite.prototype.hasGetUserMedia = function () {
            return this.getUserMediaWrapper() != undefined;
        };
        CameraSprite.prototype.getUserMedia = function (constraints, successCallback, errorCallback) {
            var getUserMediaFunc = this.getUserMediaWrapper();
            if (getUserMediaFunc != undefined) {
                getUserMediaFunc(constraints, successCallback, errorCallback);
            }
        };
        CameraSprite.prototype.onLocalStreamError = function (e) {
            console.error("Error capturing camera: ", e);
        };
        CameraSprite.prototype.onLocalStreamCapture = function (localMediaStream) {
            console.log("Camera capture success");
            this.localMediaStream = localMediaStream;
            this.createVideoElement();
        };
        CameraSprite.prototype.onVideoLoadedMetaData = function (e) {
            console.log("Loaded metadata.");
            console.log("Actual video size is " + this.video.videoWidth + "x" + this.video.videoHeight);
            this.createVideoSprite();
        };
        Object.defineProperty(CameraSprite.prototype, "nativeWidth", {
            get: function () {
                return this.desiredWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CameraSprite.prototype, "nativeHeight", {
            get: function () {
                return this.desiredHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CameraSprite.prototype, "width", {
            get: function () {
                return this.desiredWidth * this.scale.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CameraSprite.prototype, "height", {
            get: function () {
                return this.desiredHeight * this.scale.y;
            },
            enumerable: true,
            configurable: true
        });
        return CameraSprite;
    })(PIXI.DisplayObjectContainer);
    PhotoBooth.CameraSprite = CameraSprite;
})(PhotoBooth || (PhotoBooth = {}));
var PhotoBooth;
(function (PhotoBooth) {
    var AppConstants = (function () {
        function AppConstants() {
        }
        AppConstants.DESIRED_CAMERA_DIMENSIONS = 480;
        return AppConstants;
    })();
    PhotoBooth.AppConstants = AppConstants;
})(PhotoBooth || (PhotoBooth = {}));
var PhotoBooth;
(function (PhotoBooth) {
    var Quad = (function (_super) {
        __extends(Quad, _super);
        function Quad(desiredColor, desiredWidth, desiredHeight) {
            _super.call(this);
            this.beginFill(desiredColor);
            this.lineStyle(0);
            this.drawRect(0, 0, desiredWidth, desiredHeight);
        }
        return Quad;
    })(PIXI.Graphics);
    PhotoBooth.Quad = Quad;
})(PhotoBooth || (PhotoBooth = {}));
var zehfernando;
(function (zehfernando) {
    var utils;
    (function (utils) {
        var MathUtils = (function () {
            function MathUtils() {
            }
            MathUtils.clamp = function (value, min, max) {
                if (min === void 0) { min = 0; }
                if (max === void 0) { max = 1; }
                return value < min ? min : value > max ? max : value;
            };
            MathUtils.clampAuto = function (value, clamp1, clamp2) {
                if (clamp1 === void 0) { clamp1 = 0; }
                if (clamp2 === void 0) { clamp2 = 1; }
                if (clamp2 < clamp1) {
                    var v = clamp2;
                    clamp2 = clamp1;
                    clamp1 = v;
                }
                return value < clamp1 ? clamp1 : value > clamp2 ? clamp2 : value;
            };
            MathUtils.map = function (value, oldMin, oldMax, newMin, newMax, clamp) {
                if (newMin === void 0) { newMin = 0; }
                if (newMax === void 0) { newMax = 1; }
                if (clamp === void 0) { clamp = false; }
                if (oldMin == oldMax)
                    return newMin;
                this.map_p = ((value - oldMin) / (oldMax - oldMin) * (newMax - newMin)) + newMin;
                if (clamp)
                    this.map_p = newMin < newMax ? this.clamp(this.map_p, newMin, newMax) : this.clamp(this.map_p, newMax, newMin);
                return this.map_p;
            };
            MathUtils.rangeMod = function (value, min, pseudoMax) {
                var range = pseudoMax - min;
                value = (value - min) % range;
                if (value < 0)
                    value = range - (-value % range);
                value += min;
                return value;
            };
            MathUtils.isPowerOfTwo = function (value) {
                while (value % 2 == 0 && value > 2)
                    value /= 2;
                return value == 2;
            };
            MathUtils.getHighestPowerOfTwo = function (value) {
                var c = 1;
                while (c < value)
                    c *= 2;
                return c;
            };
            MathUtils.DEG2RAD = 1 / 180 * Math.PI;
            MathUtils.RAD2DEG = 1 / Math.PI * 180;
            return MathUtils;
        })();
        utils.MathUtils = MathUtils;
    })(utils = zehfernando.utils || (zehfernando.utils = {}));
})(zehfernando || (zehfernando = {}));
var zehfernando;
(function (zehfernando) {
    var signals;
    (function (signals) {
        var SimpleSignal = (function () {
            function SimpleSignal() {
                this.functions = [];
            }
            SimpleSignal.prototype.add = function (func) {
                if (this.functions.indexOf(func) == -1) {
                    this.functions.push(func);
                    return true;
                }
                return false;
            };
            SimpleSignal.prototype.remove = function (func) {
                this.ifr = this.functions.indexOf(func);
                if (this.ifr > -1) {
                    this.functions.splice(this.ifr, 1);
                    return true;
                }
                return false;
            };
            SimpleSignal.prototype.removeAll = function () {
                if (this.functions.length > 0) {
                    this.functions.length = 0;
                    return true;
                }
                return false;
            };
            SimpleSignal.prototype.dispatch = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var functionsDuplicate = this.functions.concat();
                for (var i = 0; i < functionsDuplicate.length; i++) {
                    functionsDuplicate[i].apply(undefined, args);
                }
            };
            Object.defineProperty(SimpleSignal.prototype, "numItems", {
                get: function () {
                    return this.functions.length;
                },
                enumerable: true,
                configurable: true
            });
            return SimpleSignal;
        })();
        signals.SimpleSignal = SimpleSignal;
    })(signals = zehfernando.signals || (zehfernando.signals = {}));
})(zehfernando || (zehfernando = {}));
var zehfernando;
(function (zehfernando) {
    var transitions;
    (function (transitions) {
        var Easing = (function () {
            function Easing() {
            }
            Easing.none = function (t) {
                return t;
            };
            Easing.quadIn = function (t) {
                return t * t;
            };
            Easing.quadOut = function (t) {
                return -t * (t - 2);
            };
            Easing.quadInOut = function (t) {
                return ((t *= 2) < 1) ? t * t * 0.5 : -0.5 * (--t * (t - 2) - 1);
            };
            Easing.cubicIn = function (t) {
                return t * t * t;
            };
            Easing.cubicOut = function (t) {
                return (t = t - 1) * t * t + 1;
            };
            Easing.cubicInOut = function (t) {
                return (t *= 2) < 1 ? Easing.cubicIn(t) / 2 : Easing.cubicOut(t - 1) / 2 + 0.5;
            };
            Easing.quartIn = function (t) {
                return t * t * t * t;
            };
            Easing.quartOut = function (t) {
                t--;
                return -1 * (t * t * t * t - 1);
            };
            Easing.quartInOut = function (t) {
                return (t *= 2) < 1 ? Easing.quartIn(t) / 2 : Easing.quartOut(t - 1) / 2 + 0.5;
            };
            Easing.quintIn = function (t) {
                return t * t * t * t * t;
            };
            Easing.quintOut = function (t) {
                t--;
                return t * t * t * t * t + 1;
            };
            Easing.quintInOut = function (t) {
                return (t *= 2) < 1 ? Easing.quintIn(t) / 2 : Easing.quintOut(t - 1) / 2 + 0.5;
            };
            Easing.sineIn = function (t) {
                return -1 * Math.cos(t * Easing.HALF_PI) + 1;
            };
            Easing.sineOut = function (t) {
                return Math.sin(t * Easing.HALF_PI);
            };
            Easing.sineInOut = function (t) {
                return (t *= 2) < 1 ? Easing.sineIn(t) / 2 : Easing.sineOut(t - 1) / 2 + 0.5;
            };
            Easing.expoIn = function (t) {
                return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1)) - 0.001;
            };
            Easing.expoOut = function (t) {
                return (t >= 0.999) ? 1 : 1.001 * (-Math.pow(2, -10 * t) + 1);
            };
            Easing.expoInOut = function (t) {
                return (t *= 2) < 1 ? Easing.expoIn(t) / 2 : Easing.expoOut(t - 1) / 2 + 0.5;
            };
            Easing.circIn = function (t) {
                return -1 * (Math.sqrt(1 - t * t) - 1);
            };
            Easing.circOut = function (t) {
                t--;
                return Math.sqrt(1 - t * t);
            };
            Easing.circInOut = function (t) {
                return (t *= 2) < 1 ? Easing.circIn(t) / 2 : Easing.circOut(t - 1) / 2 + 0.5;
            };
            Easing.elasticIn = function (t, a, p) {
                if (a === void 0) { a = 0; }
                if (p === void 0) { p = 0.3; }
                if (t == 0)
                    return 0;
                if (t == 1)
                    return 1;
                var s;
                if (a < 1) {
                    a = 1;
                    s = p / 4;
                }
                else {
                    s = p / Easing.TWO_PI * Math.asin(1 / a);
                }
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * Easing.TWO_PI / p));
            };
            Easing.elasticOut = function (t, a, p) {
                if (a === void 0) { a = 0; }
                if (p === void 0) { p = 0.3; }
                if (t == 0)
                    return 0;
                if (t == 1)
                    return 1;
                var s;
                if (a < 1) {
                    a = 1;
                    s = p / 4;
                }
                else {
                    s = p / Easing.TWO_PI * Math.asin(1 / a);
                }
                return (a * Math.pow(2, -10 * t) * Math.sin((t - s) * Easing.TWO_PI / p) + 1);
            };
            Easing.backIn = function (t, s) {
                if (s === void 0) { s = 1.70158; }
                return t * t * ((s + 1) * t - s);
            };
            Easing.backOut = function (t, s) {
                if (s === void 0) { s = 1.70158; }
                t--;
                return t * t * ((s + 1) * t + s) + 1;
            };
            Easing.backInOut = function (t) {
                return (t *= 2) < 1 ? Easing.backIn(t) / 2 : Easing.backOut(t - 1) / 2 + 0.5;
            };
            Easing.bounceIn = function (t) {
                return 1 - Easing.bounceOut(1 - t);
            };
            Easing.bounceOut = function (t) {
                if (t < (1 / 2.75)) {
                    return 7.5625 * t * t;
                }
                else if (t < (2 / 2.75)) {
                    return 7.5625 * (t -= (1.5 / 2.75)) * t + .75;
                }
                else if (t < (2.5 / 2.75)) {
                    return 7.5625 * (t -= (2.25 / 2.75)) * t + .9375;
                }
                else {
                    return 7.5625 * (t -= (2.625 / 2.75)) * t + .984375;
                }
            };
            Easing.combined = function (t, __equations) {
                var l = __equations.length;
                var eq = Math.floor(t * l);
                if (eq == __equations.length)
                    eq = l - 1;
                return Number(__equations[eq](t * l - eq));
            };
            Easing.HALF_PI = Math.PI / 2;
            Easing.TWO_PI = Math.PI * 2;
            return Easing;
        })();
        transitions.Easing = Easing;
    })(transitions = zehfernando.transitions || (zehfernando.transitions = {}));
})(zehfernando || (zehfernando = {}));
var zehfernando;
(function (zehfernando) {
    var transitions;
    (function (transitions) {
        var ZTween = (function () {
            function ZTween(target, properties, parameters) {
                if (properties === void 0) { properties = null; }
                if (parameters === void 0) { parameters = null; }
                this._target = target;
                this.properties = new Array();
                for (var pName in properties) {
                    this.properties.push(new ZTweenProperty(pName, properties[pName]));
                }
                this.timeCreated = ZTween.currentTime;
                this.timeStart = this.timeCreated;
                this.time = 0;
                this.delay = 0;
                this.transition = transitions.Easing.none;
                this._onStart = new zehfernando.signals.SimpleSignal();
                this._onUpdate = new zehfernando.signals.SimpleSignal();
                this._onComplete = new zehfernando.signals.SimpleSignal();
                if (parameters != null) {
                    if (parameters.hasOwnProperty("time"))
                        this.time = parameters["time"];
                    if (parameters.hasOwnProperty("delay"))
                        this.delay = parameters["delay"];
                    if (parameters.hasOwnProperty("transition"))
                        this.transition = parameters["transition"];
                    if (parameters.hasOwnProperty("onStart"))
                        this._onStart.add(parameters["onStart"]);
                    if (parameters.hasOwnProperty("onUpdate"))
                        this._onUpdate.add(parameters["onUpdate"]);
                    if (parameters.hasOwnProperty("onComplete"))
                        this._onComplete.add(parameters["onComplete"]);
                }
                this._useFrames = false;
                this._paused = false;
                this.started = false;
            }
            ZTween._init = function () {
                this.currentTimeFrame = 0;
                this.currentTime = 0;
                this.frameTick();
            };
            ZTween.prototype.updateCache = function () {
                this.timeDuration = this.timeComplete - this.timeStart;
            };
            ZTween.updateTweens = function () {
                this.l = this.tweens.length;
                for (this.i = 0; this.i < this.l; this.i++) {
                    if (this.tweens[this.i] == null || !this.tweens[this.i].update(this.currentTime, this.currentTimeFrame)) {
                        this.tweens.splice(this.i, 1);
                        this.i--;
                        this.l--;
                    }
                }
            };
            ZTween.frameTick = function () {
                this.currentTime = (new Date()).getTime();
                this.currentTimeFrame++;
                this.updateTweens();
                window.requestAnimationFrame(this.frameTick.bind(this));
            };
            ZTween.add = function (target, properties, parameters) {
                if (properties === void 0) { properties = null; }
                if (parameters === void 0) { parameters = null; }
                var t = new ZTween(target, properties, parameters);
                this.tweens.push(t);
                return t;
            };
            ZTween.updateTime = function () {
                this.currentTime = (new Date()).getTime();
            };
            ZTween.remove = function (target) {
                var props = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    props[_i - 1] = arguments[_i];
                }
                var tl = [];
                var l = this.tweens.length;
                var i;
                var j;
                for (i = 0; i < l; i++) {
                    if (this.tweens[i] != null && this.tweens[i]._target == target) {
                        if (props.length > 0) {
                            for (j = 0; j < this.tweens[i].properties.length; j++) {
                                if (props.indexOf(this.tweens[i].properties[j].name) > -1) {
                                    this.tweens[i].properties.splice(j, 1);
                                    j--;
                                }
                            }
                            if (this.tweens[i].properties.length == 0)
                                tl.push(this.tweens[i]);
                        }
                        else {
                            tl.push(this.tweens[i]);
                        }
                    }
                }
                var removedAny = false;
                l = tl.length;
                for (i = 0; i < l; i++) {
                    j = this.tweens.indexOf(tl[i]);
                    this.removeTweenByIndex(j);
                    removedAny = true;
                }
                return removedAny;
            };
            ZTween.hasTween = function (target) {
                var props = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    props[_i - 1] = arguments[_i];
                }
                var l = this.tweens.length;
                var i;
                var j;
                for (i = 0; i < l; i++) {
                    if (this.tweens[i] != null && this.tweens[i]._target == target) {
                        if (props.length > 0) {
                            for (j = 0; j < this.tweens[i].properties.length; j++) {
                                if (props.indexOf(this.tweens[i].properties[j].name) > -1) {
                                    return true;
                                }
                            }
                        }
                        else {
                            return true;
                        }
                    }
                }
                return false;
            };
            ZTween.getTweens = function (target) {
                var props = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    props[_i - 1] = arguments[_i];
                }
                var tl = [];
                var l = this.tweens.length;
                var i;
                var j;
                var found;
                for (i = 0; i < l; i++) {
                    if (this.tweens[i] != null && this.tweens[i]._target == target) {
                        if (props.length > 0) {
                            found = false;
                            for (j = 0; j < this.tweens[i].properties.length; j++) {
                                if (props.indexOf(this.tweens[i].properties[j].name) > -1) {
                                    found = true;
                                    break;
                                }
                            }
                            if (found)
                                tl.push(this.tweens[i]);
                        }
                        else {
                            tl.push(this.tweens[i]);
                        }
                    }
                }
                return tl;
            };
            ZTween.pause = function (target) {
                var props = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    props[_i - 1] = arguments[_i];
                }
                var pausedAny = false;
                var ftweens = this.getTweens.apply(null, ([target]).concat(props));
                var i;
                for (i = 0; i < ftweens.length; i++) {
                    if (!ftweens[i].paused) {
                        ftweens[i].pause();
                        pausedAny = true;
                    }
                }
                return pausedAny;
            };
            ZTween.resume = function (target) {
                var props = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    props[_i - 1] = arguments[_i];
                }
                var resumedAny = false;
                var ftweens = this.getTweens.apply(null, ([target]).concat(props));
                var i;
                for (i = 0; i < ftweens.length; i++) {
                    if (ftweens[i].paused) {
                        ftweens[i].resume();
                        resumedAny = true;
                    }
                }
                return resumedAny;
            };
            ZTween.removeTweenByIndex = function (i) {
                this.tweens[i] = null;
            };
            ZTween.prototype.update = function (currentTime, currentTimeFrame) {
                if (this._paused)
                    return true;
                this.cTime = this._useFrames ? currentTimeFrame : currentTime;
                if (this.started || this.cTime >= this.timeStart) {
                    if (!this.started) {
                        this._onStart.dispatch();
                        for (this.i = 0; this.i < this.properties.length; this.i++) {
                            this.tProperty = this.properties[this.i];
                            this.pv = this._target[this.tProperty.name];
                            this.tProperty.valueStart = isNaN(this.pv) ? this.tProperty.valueComplete : this.pv;
                            this.tProperty.valueChange = this.tProperty.valueComplete - this.tProperty.valueStart;
                        }
                        this.started = true;
                    }
                    if (this.cTime >= this.timeComplete) {
                        for (this.i = 0; this.i < this.properties.length; this.i++) {
                            this.tProperty = this.properties[this.i];
                            this._target[this.tProperty.name] = this.tProperty.valueComplete;
                        }
                        this._onUpdate.dispatch();
                        this._onComplete.dispatch();
                        return false;
                    }
                    else {
                        this.t = this.transition((this.cTime - this.timeStart) / this.timeDuration);
                        for (this.i = 0; this.i < this.properties.length; this.i++) {
                            this.tProperty = this.properties[this.i];
                            this._target[this.tProperty.name] = this.tProperty.valueStart + this.t * this.tProperty.valueChange;
                        }
                        this._onUpdate.dispatch();
                    }
                }
                return true;
            };
            ZTween.prototype.pause = function () {
                if (!this._paused) {
                    this._paused = true;
                    this.timePaused = this._useFrames ? ZTween.currentTimeFrame : ZTween.currentTime;
                }
            };
            ZTween.prototype.resume = function () {
                if (this._paused) {
                    this._paused = false;
                    var timeNow = this._useFrames ? ZTween.currentTimeFrame : ZTween.currentTime;
                    this.timeStart += timeNow - this.timePaused;
                    this.timeComplete += timeNow - this.timePaused;
                }
            };
            Object.defineProperty(ZTween.prototype, "delay", {
                get: function () {
                    return (this.timeStart - this.timeCreated) / (this._useFrames ? 1 : 1000);
                },
                set: function (value) {
                    this.timeStart = this.timeCreated + (value * (this._useFrames ? 1 : 1000));
                    this.timeComplete = this.timeStart + this.timeDuration;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ZTween.prototype, "time", {
                get: function () {
                    return (this.timeComplete - this.timeStart) / (this._useFrames ? 1 : 1000);
                },
                set: function (value) {
                    this.timeComplete = this.timeStart + (value * (this._useFrames ? 1 : 1000));
                    this.updateCache();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ZTween.prototype, "paused", {
                get: function () {
                    return this._paused;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ZTween.prototype, "useFrames", {
                get: function () {
                    return this._useFrames;
                },
                set: function (value) {
                    var tDelay = this.delay;
                    var tTime = this.time;
                    this._useFrames = value;
                    this.timeStart = this._useFrames ? ZTween.currentTimeFrame : ZTween.currentTime;
                    this.delay = tDelay;
                    this.time = tTime;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ZTween.prototype, "target", {
                get: function () {
                    return this._target;
                },
                set: function (target) {
                    this._target = target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ZTween.prototype, "onStart", {
                get: function () {
                    return this._onStart;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ZTween.prototype, "onUpdate", {
                get: function () {
                    return this._onUpdate;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ZTween.prototype, "onComplete", {
                get: function () {
                    return this._onComplete;
                },
                enumerable: true,
                configurable: true
            });
            ZTween.tweens = [];
            return ZTween;
        })();
        transitions.ZTween = ZTween;
        var ZTweenProperty = (function () {
            function ZTweenProperty(name, valueComplete) {
                this.name = name;
                this.valueComplete = valueComplete;
            }
            return ZTweenProperty;
        })();
        ZTween._init();
    })(transitions = zehfernando.transitions || (zehfernando.transitions = {}));
})(zehfernando || (zehfernando = {}));
var PhotoBooth;
(function (PhotoBooth) {
    var RootState;
    (function (RootState) {
        RootState[RootState["Unknown"] = 0] = "Unknown";
        RootState[RootState["Standby"] = 1] = "Standby";
        RootState[RootState["Photographing"] = 2] = "Photographing";
        RootState[RootState["Filter"] = 3] = "Filter";
    })(RootState || (RootState = {}));
    ;
    var RootSprite = (function (_super) {
        __extends(RootSprite, _super);
        function RootSprite(desiredWidth, desiredHeight) {
            _super.call(this);
            this.desiredWidth = desiredWidth;
            this.desiredHeight = desiredHeight;
            this.state = 0 /* Unknown */;
            this.cameraView = new PhotoBooth.CameraSprite(PhotoBooth.AppConstants.DESIRED_CAMERA_DIMENSIONS, PhotoBooth.AppConstants.DESIRED_CAMERA_DIMENSIONS);
            this.addChild(this.cameraView);
            this.debugText = new PIXI.Text("DEBUG");
            this.debugText.x = 400;
            this.debugText.y = 50;
            this.addChild(this.debugText);
            var box = new PhotoBooth.Quad(0xff0000, 100, 100);
            box.x = 400;
            box.y = 100;
            box.interactive = true;
            box.click = function (e) {
                this.changeState(2 /* Photographing */);
            }.bind(this);
            this.addChild(box);
            var box2 = new PhotoBooth.Quad(0xffff00, 100, 100);
            box2.x = 600;
            box2.y = 100;
            box2.interactive = true;
            box2.click = function (e) {
                this.changeState(1 /* Standby */);
            }.bind(this);
            this.addChild(box2);
            this.cameraFocusedState = 0;
            this.changeState(1 /* Standby */);
        }
        Object.defineProperty(RootSprite.prototype, "cameraFocusedState", {
            get: function () {
                return this._cameraFocusedState;
            },
            set: function (value) {
                if (this._cameraFocusedState != value) {
                    this._cameraFocusedState = value;
                    this.applyCameraFocusedState();
                }
            },
            enumerable: true,
            configurable: true
        });
        RootSprite.prototype.changeState = function (newState) {
            switch (newState) {
                case 1 /* Standby */:
                    this.state = newState;
                    zehfernando.transitions.ZTween.add(this, { cameraFocusedState: 0 }, { time: 0.5, transition: zehfernando.transitions.Easing.backInOut });
                    break;
                case 2 /* Photographing */:
                    this.state = newState;
                    zehfernando.transitions.ZTween.add(this, { cameraFocusedState: 1 }, { time: 0.5, transition: zehfernando.transitions.Easing.backInOut });
                    break;
                case 3 /* Filter */:
                    this.state = newState;
                    this.cameraFocusedState = 0;
                    break;
            }
            if (this.state == 0 /* Unknown */)
                this.debugText.setText("STATE: Unknown");
            if (this.state == 1 /* Standby */)
                this.debugText.setText("STATE: Standby");
            if (this.state == 2 /* Photographing */)
                this.debugText.setText("STATE: Photographing");
            if (this.state == 3 /* Filter */)
                this.debugText.setText("STATE: Filter");
        };
        RootSprite.prototype.applyCameraFocusedState = function () {
            this.cameraView.scale.x = this.cameraView.scale.y = zehfernando.utils.MathUtils.map(this._cameraFocusedState, 0, 1, this.desiredWidth / this.cameraView.nativeWidth, this.desiredHeight / this.cameraView.nativeHeight);
            this.cameraView.x = this.width * 0.5 - this.cameraView.width * 0.5;
            this.cameraView.y = this.height * 0.5 - this.cameraView.height * 0.5;
        };
        Object.defineProperty(RootSprite.prototype, "width", {
            get: function () {
                return this.desiredWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RootSprite.prototype, "height", {
            get: function () {
                return this.desiredHeight;
            },
            enumerable: true,
            configurable: true
        });
        return RootSprite;
    })(PIXI.DisplayObjectContainer);
    PhotoBooth.RootSprite = RootSprite;
})(PhotoBooth || (PhotoBooth = {}));
var PhotoBooth;
(function (PhotoBooth) {
    var App = (function () {
        function App(rootElement, width, height) {
            this.rootElement = rootElement;
            this.width = width;
            this.height = height;
            this.renderer = new PIXI.WebGLRenderer(width, height);
            this.rootElement.appendChild(this.renderer.view);
            this.stage = new PIXI.Stage(0xff000000);
            this.rootSprite = new PhotoBooth.RootSprite(width, height);
            this.stage.addChild(this.rootSprite);
            this.render();
        }
        App.prototype.start = function () {
            console.log("Initialized successfully");
        };
        App.prototype.render = function () {
            this.renderer.render(this.stage);
            window.requestAnimationFrame(this.render.bind(this));
        };
        return App;
    })();
    PhotoBooth.App = App;
})(PhotoBooth || (PhotoBooth = {}));
window.addEventListener("load", function () {
    var element = document.getElementById('content');
    var photobooth = new PhotoBooth.App(element, window.outerWidth, window.outerHeight);
    photobooth.start();
    window["glS"] = new glStats();
    window["bS"] = new BrowserStats();
    window["rS"] = new rStats({
        CSSPath: "css/",
        values: {
            fps: { caption: 'Framerate (FPS)', below: 30 },
            raf: { caption: 'Time since last rAF (ms)' },
            frame: { caption: 'Total frame time (ms)', over: 16 },
            action1: { caption: 'Render action #1 (ms)', over: 3000 },
            render: { caption: 'WebGL Render (ms)' },
            rstats: { caption: 'rStats update (ms)' },
        },
        groups: [
            { caption: 'Framerate', values: ['fps', 'raf'] },
            { caption: 'Frame Budget', values: ['frame', 'action1', 'render', 'rstats'] }
        ],
        fractions: [
            { base: 'frame', steps: ['action1', 'render'] }
        ],
        plugins: [
            window["glS"],
            window["bS"]
        ]
    });
    window["renderStats"] = function () {
        window["glS"].start();
        var rS = window["rS"];
        rS("frame").start();
        rS("rAF").tick();
        rS("FPS").frame();
        rS("render").start();
        rS("render").end();
        rS("frame").end();
        rS().update();
        window.requestAnimationFrame(window["renderStats"]);
    };
    window["renderStats"]();
});
//# sourceMappingURL=photobooth.js.map