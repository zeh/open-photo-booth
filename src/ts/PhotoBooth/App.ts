/// <reference path='display/CameraSprite.ts'/>
/// <reference path="../definitions/stats.d.ts" />
/// <reference path="../definitions/pixi.d.ts" />

module PhotoBooth {
	export class App {

        rootElement: HTMLElement;
		cameraSprite: CameraSprite;
		renderer: PIXI.WebGLRenderer;
		stage: PIXI.Stage;
		videoTexture: PIXI.Texture;
		width: number;
		height: number;

		constructor(rootElement: HTMLElement, width: number, height: number) {
			this.rootElement = rootElement;
			this.width = width;
			this.height = height;

			// Create PIXI context
			this.renderer = new PIXI.WebGLRenderer(width, height);
			this.rootElement.appendChild(this.renderer.view);

			// Stage
			this.stage = new PIXI.Stage(0xff000000);

			// Camera sprite
			this.cameraSprite = new CameraSprite(width, height);
			this.stage.addChild(this.cameraSprite);

			this.videoTexture = null;

			var text = new PIXI.Text("TEST This is a test.");
			text.x = 100;
			text.y = 100;
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
		}
	}
}
