module PhotoBooth {
    export class CameraView {

        element: HTMLElement;
        video: HTMLVideoElement;

        constructor() {
            // Create DOM elements
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

			// Create hooks

			if (this.hasGetUserMedia()) {
				this.getUserMedia({ video: true, audio: false }, this.onLocalStreamCapture.bind(this), this.onLocalStreamError.bind(this));
			} else {
				console.error("getUserMedia() is not supported.");
			}

        }

        getElement() {
            return this.element;
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

		onLocalStreamError(e:Event) {
			console.error("Error capturing camera");
		}

		onLocalStreamCapture(localMediaStream:any) {
			console.log("Camera capture success");
			this.video.src = URL.createObjectURL(localMediaStream);

			// Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
			// See crbug.com/110938.
			this.video.onloadedmetadata = function (e) {
				console.log("Loaded metadata.");
			};
		}
    }
}