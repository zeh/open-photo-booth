module PhotoBooth {
    export class CameraSprite extends PIXI.DisplayObjectContainer {

		video: HTMLVideoElement;
		videoTexture: PIXI.Texture; // Actually PIXI.VideoTexture
		videoSprite: PIXI.Sprite;
		localMediaStream: any;

		constructor() {
			super();

			if (this.hasGetUserMedia()) {
				//this.getUserMedia({ video: true, audio: false }, this.onLocalStreamCapture.bind(this), this.onLocalStreamError.bind(this));
				this.getUserMedia({
					video: {
						mandatory: {
							maxWidth: 270,
							minHeight: 480,
							/* maxWidth, maxHeight, aspectRatio */
						},
						optional: [
							{ height: 650 },
							{ aspectRatio: 1 / 2 },
							/*
							{ width: { min: 650 } },
							{ frameRate: 60 },
							{ width: { max: 800 } },
							{ facingMode: "user" }
							*/
						]
					}
				}, this.onLocalStreamCapture.bind(this), this.onLocalStreamError.bind(this));
			} else {
				console.error("getUserMedia() is not supported.");
			}
		}

		createVideoElement() {
			// Once the stream is allowed, create the video element
			console.log("Creating video");
            this.video = document.createElement("video");
			this.video.autoplay = true;
			this.video.play();
			this.video.src = URL.createObjectURL(this.localMediaStream);
			this.video.onloadedmetadata = this.onVideoLoadedMetaData.bind(this);
		}

		createVideoSprite() {
			// Once the video actually starts, and its properties are known, create the video texture and its sprite
			console.log("Creating texture");

			this.videoTexture = PIXI.VideoTexture.textureFromVideo(this.video, PIXI.scaleModes.LINEAR);
			this.videoSprite = new PIXI.Sprite(this.videoTexture);
			this.addChild(this.videoSprite);

			/*
			this.videoTexture = PIXI.VideoTexture.fromUrl(URL.createObjectURL(this.localMediaStream), PIXI.scaleModes.LINEAR);
			var sprite = new PIXI.Sprite(this.videoTexture);
			sprite.width = 1080;
			sprite.height = 1920;
			this.stage.addChild(sprite);
			*/
		}

		getUserMediaWrapper() {
			var func = navigator["getUserMedia"] || navigator["webkitGetUserMedia"] || navigator["mozGetUserMedia"] || navigator["msGetUserMedia"];
			if (func != undefined) func = func.bind(navigator);
			return func;
		}

		hasGetUserMedia() {
			return this.getUserMediaWrapper() != undefined;
		}

		getUserMedia(constraints: any, successCallback: Function, errorCallback: Function) {
			var getUserMediaFunc = this.getUserMediaWrapper();
			if (getUserMediaFunc != undefined) {
				getUserMediaFunc(constraints, successCallback, errorCallback);
			}
		}

		onLocalStreamError(e: Event) {
			console.error("Error capturing camera: ", e);
		}

		// To stop:
		//video.src = null;
		//stream.stop();

		onLocalStreamCapture(localMediaStream: any) {
			console.log("Camera capture success");
			this.localMediaStream = localMediaStream;
			this.createVideoElement();
		}

		onVideoLoadedMetaData(e: Event) {
			console.log("Loaded metadata.");
			console.log("Actual video size is " + this.video.videoWidth + "x" + this.video.videoHeight);
			this.createVideoSprite();
		}
	}
}
