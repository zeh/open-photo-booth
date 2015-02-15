/// <reference path='display/CameraView.ts'/>

module PhotoBooth {
	export class App {

        root: HTMLElement;
        camera: CameraView;

		constructor(root:HTMLElement) {
			this.root = root;

            this.camera = new CameraView();
            this.root.appendChild(this.camera.getElement());
		}

		start() {
			console.log("Initialized successfully");
		}
	}
}
