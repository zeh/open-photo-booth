/// <reference path='display/CameraView.ts'/>
/// <reference path='display/CameraSprite.ts'/>
/// <reference path="../definitions/stats.d.ts" />
/// <reference path="../definitions/pixi.d.ts" />

module PhotoBooth {
	export class App {

        rootElement: HTMLElement;
        camera: CameraView;
		cameraSprite: CameraSprite;
		renderer: PIXI.WebGLRenderer;
		stage: PIXI.Stage;
		videoTexture: PIXI.Texture;
		width: number;
		height: number;

		constructor(root: HTMLElement, width: number, height: number) {
			this.rootElement = root;
			this.width = width;
			this.height = height;

			this.cameraSprite = new CameraSprite();

            //this.camera = new CameraView();
            //this.rootElement.appendChild(this.camera.getElement());

			this.renderer = new PIXI.WebGLRenderer(width, height);
			this.rootElement.appendChild(this.renderer.view);

			this.stage = new PIXI.Stage(0xff000000);

			var text = new PIXI.Text("TEST This is a test.");
			text.x = 100;
			text.y = 100;

			this.videoTexture = null;

			this.stage.addChild(this.cameraSprite);
			this.stage.addChild(text);

			// Start
			this.render();
		}

		start() {
			console.log("Initialized successfully");
		}

		render() {
			this.renderer.render(this.stage);
			window.requestAnimationFrame(this.render.bind(this));

			/*
			if (document.querySelector("video") && (<HTMLVideoElement>document.querySelector("video")).src.length > 0) {
				if (this.videoTexture == null) {
					// Need to create first
					console.log("Creating texture");
					this.videoTexture = PIXI.VideoTexture.fromUrl((<HTMLVideoElement>document.querySelector("video")).src, PIXI.scaleModes.NEAREST);
					var sprite = new PIXI.Sprite(this.videoTexture);
					sprite.width = 1080;
					sprite.height = 1920;
					this.stage.addChild(sprite);
				}
			}
			*/
		}

		// if( video.readyState === video.HAVE_ENOUGH_DATA ){
			//ctx.drawImage(video, 0, 0);
	}
}
