var PhotoBooth;
(function (PhotoBooth) {
    var CameraView = (function () {
        function CameraView() {
            this.element = document.createElement("div");
            this.element.style.width = "100%";
            this.element.style.height = "100%";
            this.element.style.overflow = "hidden";
            this.video = document.createElement("video");
            this.video.play();
            this.video.autoplay = true;
            this.video.style.width = "100%";
            this.video.style.height = "100%";
            this.video.style["objectFit"] = "cover";
            this.element.appendChild(this.video);
            if (this.hasGetUserMedia()) {
                this.getUserMedia({ video: true, audio: false }, this.onLocalStreamCapture.bind(this), this.onLocalStreamError.bind(this));
            }
            else {
                console.error("getUserMedia() is not supported.");
            }
        }
        CameraView.prototype.getElement = function () {
            return this.element;
        };
        CameraView.prototype.getUserMediaWrapper = function () {
            var func = navigator["getUserMedia"] || navigator["webkitGetUserMedia"] || navigator["mozGetUserMedia"] || navigator["msGetUserMedia"];
            if (func != undefined)
                func = func.bind(navigator);
            return func;
        };
        CameraView.prototype.hasGetUserMedia = function () {
            return this.getUserMediaWrapper() != undefined;
        };
        CameraView.prototype.getUserMedia = function (constraints, successCallback, errorCallback) {
            var getUserMediaFunc = this.getUserMediaWrapper();
            if (getUserMediaFunc != undefined) {
                getUserMediaFunc(constraints, successCallback, errorCallback);
            }
        };
        CameraView.prototype.onLocalStreamError = function (e) {
            console.error("Error capturing camera");
        };
        CameraView.prototype.onLocalStreamCapture = function (localMediaStream) {
            console.log("Camera capture success");
            this.video.src = URL.createObjectURL(localMediaStream);
            this.video.onloadedmetadata = function (e) {
                console.log("Loaded metadata.");
            };
        };
        return CameraView;
    })();
    PhotoBooth.CameraView = CameraView;
})(PhotoBooth || (PhotoBooth = {}));
var PhotoBooth;
(function (PhotoBooth) {
    var App = (function () {
        function App(root) {
            this.root = root;
            this.camera = new PhotoBooth.CameraView();
            this.root.appendChild(this.camera.getElement());
        }
        App.prototype.start = function () {
            console.log("Initialized successfully");
        };
        return App;
    })();
    PhotoBooth.App = App;
})(PhotoBooth || (PhotoBooth = {}));
window.addEventListener("load", function () {
    var element = document.getElementById('content');
    var photobooth = new PhotoBooth.App(element);
    photobooth.start();
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
    setInterval(function () {
        stats.begin();
        stats.end();
    }, 1000 / 60);
    var renderer = new PIXI.WebGLRenderer(800, 600);
});
//# sourceMappingURL=photobooth.js.map