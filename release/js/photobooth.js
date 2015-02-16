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
                            maxWidth: 270,
                            minHeight: 480
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
            this.videoSprite.click = this.onClickCanvas.bind(this);
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
        CameraSprite.prototype.onClickCanvas = function (e) {
            console.log("tap");
            this.videoSprite.shader = PhotoBooth.FilterFactory.filters[(this.currentFilterTemp++) % PhotoBooth.FilterFactory.filters.length].shader;
        };
        return CameraSprite;
    })(PIXI.DisplayObjectContainer);
    PhotoBooth.CameraSprite = CameraSprite;
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
            this.cameraSprite = new PhotoBooth.CameraSprite(width, height);
            this.stage.addChild(this.cameraSprite);
            this.videoTexture = null;
            var text = new PIXI.Text("TEST This is a test.");
            text.x = 100;
            text.y = 100;
            this.stage.addChild(text);
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
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    var renderStats = function () {
        stats.begin();
        stats.end();
        window.requestAnimationFrame(renderStats);
    };
    renderStats();
});
//# sourceMappingURL=photobooth.js.map