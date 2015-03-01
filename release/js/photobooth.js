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
                    this.cameraFocusedState = 0;
                    break;
                case 2 /* Photographing */:
                    this.state = newState;
                    this.cameraFocusedState = 1;
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