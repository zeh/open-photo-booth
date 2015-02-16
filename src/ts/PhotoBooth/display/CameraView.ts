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

			// Start user media
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
			console.error("Error capturing camera: ", e);
		}

		// To stop:
		//video.src = null;
		//stream.stop();

		onLocalStreamCapture(localMediaStream:any) {
			console.log("Camera capture success");
			this.video.src = URL.createObjectURL(localMediaStream);

			this.video.onloadedmetadata = function (e) {
				console.log("Loaded metadata.");
				console.log("Actual video size is " + this.videoWidth + "x" + this.videoHeight);
			};
		}
    }
}