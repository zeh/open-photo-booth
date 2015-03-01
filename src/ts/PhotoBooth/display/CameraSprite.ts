/// <reference path='FilterFactory.ts'/>

module PhotoBooth {
    export class CameraSprite extends PIXI.DisplayObjectContainer {

		private video: HTMLVideoElement;
		private videoTexture: PIXI.Texture; // Actually PIXI.VideoTexture
		private videoSprite: PIXI.Sprite;
		private localMediaStream: any;

		private desiredWidth: number;
		private desiredHeight: number;

		private currentFilterTemp: number;

		constructor(desiredWidth, desiredHeight) {
			super();

			this.desiredWidth = desiredWidth;
			this.desiredHeight = desiredHeight;

			if (this.hasGetUserMedia()) {
				//this.getUserMedia({ video: true, audio: false }, this.onLocalStreamCapture.bind(this), this.onLocalStreamError.bind(this));
				this.getUserMedia({
					video: {
						mandatory: {
							maxWidth: desiredWidth,
							minHeight: desiredHeight,
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

			this.videoSprite.scale.x = this.desiredWidth / this.video.videoWidth;
			this.videoSprite.scale.y = this.desiredHeight / this.video.videoHeight;

			//this.videoSprite.click = this.onClickCanvas.bind(this);
			this.videoSprite.interactive = true;

			this.currentFilterTemp = 0;
			this.videoSprite.shader = FilterFactory.filters[0].shader;

			// Wait until video is available?
			// if( video.readyState === video.HAVE_ENOUGH_DATA ){
			//ctx.drawImage(video, 0, 0);
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

		/*
		onClickCanvas(e: PIXI.InteractionData) {
			//this.videoSprite.shader = FilterFactory.filters[(this.currentFilterTemp++) % FilterFactory.filters.length].shader;
			this.videoSprite.filters = [FilterFactory.filters[(this.currentFilterTemp++) % FilterFactory.filters.length].shader];
		}
		*/

		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		get nativeWidth(): number {
			return this.desiredWidth;
		}

		get nativeHeight(): number {
			return this.desiredHeight;
		}

		get width(): number {
			return this.desiredWidth * this.scale.x;
		}

		get height(): number {
			return this.desiredHeight * this.scale.y;
		}

	}
}
