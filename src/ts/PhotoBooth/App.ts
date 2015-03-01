/// <reference path='display/RootSprite.ts'/>
/// <reference path="../definitions/pixi.d.ts" />

module PhotoBooth {
	export class App {

        private rootElement: HTMLElement;
		private cameraSprite: CameraSprite;
		private renderer: PIXI.WebGLRenderer;
		private stage: PIXI.Stage;
		private width: number;
		private height: number;
		private rootSprite: RootSprite;

		constructor(rootElement: HTMLElement, width: number, height: number) {
			this.rootElement = rootElement;
			this.width = width;
			this.height = height;

			// Create PIXI context
			this.renderer = new PIXI.WebGLRenderer(width, height);
			this.rootElement.appendChild(this.renderer.view);

			// Stage
			this.stage = new PIXI.Stage(0xff000000);

			// Root
			this.rootSprite = new RootSprite(width, height);
			this.stage.addChild(this.rootSprite);

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
