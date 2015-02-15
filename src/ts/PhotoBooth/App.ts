module PhotoBooth {
	export class App {

		root:HTMLElement;

		constructor(root:HTMLElement) {
			this.root = root;
			this.root.innerHTML = "Loaded.";
		}

		start() {
			console.log("Initialized successfully");
		}
	}
}
