/// <reference path='CameraPreviewSprite.ts'/>

module PhotoBooth {
    export class CameraContainerSprite extends PIXI.DisplayObjectContainer {

		// Properties
		private desiredWidth: number;
		private desiredHeight: number;
		private topBar: PIXI.Sprite;
		private bottomBar: PIXI.Sprite;
		private cameraPreview: CameraPreviewSprite;
		private _focusedState: number; // 1 = focused (in center), 0 = not focused (full screen)

		constructor(desiredWidth, desiredHeight) {
			super();

			this.desiredWidth = desiredWidth;
			this.desiredHeight = desiredHeight;

			// Camera preview
			this.cameraPreview = new CameraPreviewSprite(AppConstants.DESIRED_CAMERA_DIMENSIONS, AppConstants.DESIRED_CAMERA_DIMENSIONS);
			this.addChild(this.cameraPreview);

			// Bars
			var texture;

			texture = PIXI.Texture.fromImage("images/blackbar_top.png");
			this.topBar = new PIXI.Sprite(texture);
			this.addChild(this.topBar);

			texture = PIXI.Texture.fromImage("images/blackbar_bottom.png");
			this.bottomBar = new PIXI.Sprite(texture);
			this.addChild(this.bottomBar);

			// End
			this._focusedState = 0;
			this.applyCameraFocusedState();
		}


		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		get focusedState(): number {
			return this._focusedState;
		}

		set focusedState(value: number) {
			if (this._focusedState != value) {
				this._focusedState = value;
				this.applyCameraFocusedState();
			}
		}


		// ================================================================================================================
		// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

		private applyCameraFocusedState() {
			// Set camera size
			this.cameraPreview.scale.x = this.cameraPreview.scale.y = zehfernando.utils.MathUtils.map(this._focusedState, 0, 1, this.desiredHeight / this.cameraPreview.nativeHeight, this.desiredWidth / this.cameraPreview.nativeWidth);
			this.cameraPreview.x = this.desiredWidth * 0.5 - this.cameraPreview.width * 0.5;
			this.cameraPreview.y = this.desiredHeight * 0.5 - this.cameraPreview.height * 0.5;

			// Set bar sizes and position
			this.topBar.scale.x = this.topBar.scale.y = this.desiredWidth / this.topBar.texture.baseTexture.width;
			this.topBar.x = 0;
			this.topBar.y = zehfernando.utils.MathUtils.map(this._focusedState, 0, 1, -this.topBar.height, 0);

			this.bottomBar.scale.x = this.bottomBar.scale.y = this.desiredWidth / this.bottomBar.texture.baseTexture.width;
			this.bottomBar.x = 0;
			this.bottomBar.y = zehfernando.utils.MathUtils.map(this._focusedState, 0, 1, this.desiredHeight, this.desiredHeight - this.bottomBar.height);
		}
	}
}
