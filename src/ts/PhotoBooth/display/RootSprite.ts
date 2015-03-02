/// <reference path='FilterFactory.ts'/>
/// <reference path='CameraSprite.ts'/>
/// <reference path='../AppConstants.ts'/>
/// <reference path='shapes/Quad.ts'/>
/// <reference path='../../libs/tidbits/utils/MathUtils.ts'/>
/// <reference path='../../libs/tidbits/transitions/ZTween.ts'/>

module PhotoBooth {

	enum RootState {
		Unknown,
		Standby,
		Photographing,
		Filter
	};

    export class RootSprite extends PIXI.DisplayObjectContainer {

		// Enums

		// Properties
		private cameraView: CameraSprite;
		private topBar: PIXI.Sprite;
		private bottomBar: PIXI.Sprite;
		private desiredWidth: number;
		private desiredHeight: number;
		private state: RootState;

		private debugText: PIXI.Text;

		private _cameraFocusedState: number; // 1 = focused (in center), 0 = not focused (full screen)


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(desiredWidth, desiredHeight) {
			super();

			// Properties
			this.desiredWidth = desiredWidth;
			this.desiredHeight = desiredHeight;
			this.state = RootState.Unknown;

			// Camera sprite
			this.cameraView = new CameraSprite(AppConstants.DESIRED_CAMERA_DIMENSIONS, AppConstants.DESIRED_CAMERA_DIMENSIONS);
			this.addChild(this.cameraView);

			// Bars
			var texture;

			texture = PIXI.Texture.fromImage("images/blackbar_top.png");
			this.topBar = new PIXI.Sprite(texture);
			this.addChild(this.topBar);

			texture = PIXI.Texture.fromImage("images/blackbar_bottom.png");
			this.bottomBar = new PIXI.Sprite(texture);
			this.addChild(this.bottomBar);

			// Other
			this.debugText = new PIXI.Text("DEBUG");
			this.debugText.x = 400;
			this.debugText.y = 50;
			this.addChild(this.debugText);

			var box = new Quad(0xff0000, 100, 100);
			box.x = 400;
			box.y = 100;
			box.interactive = true;
			box.click = function(e: PIXI.InteractionData) {
				this.changeState(RootState.Photographing);
			}.bind(this);
			this.addChild(box);

			var box2 = new Quad(0xffff00, 100, 100);
			box2.x = 600;
			box2.y = 100;
			box2.interactive = true;
			box2.click = function(e: PIXI.InteractionData) {
				this.changeState(RootState.Standby);
			}.bind(this);
			this.addChild(box2);

			// Defaults for getter/setters
			this.cameraFocusedState = 0;

			// End
			this.changeState(RootState.Standby);
		}


		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		get cameraFocusedState(): number {
			return this._cameraFocusedState;
		}
		set cameraFocusedState(value: number) {
			if (this._cameraFocusedState != value) {
				this._cameraFocusedState = value;
				this.applyCameraFocusedState();
			}
		}


		// ================================================================================================================
		// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

		private changeState(newState: RootState) {
			// Set the new state, doing all transitions necessary

			switch (newState) {
				case RootState.Standby:
					this.state = newState;
					zehfernando.transitions.ZTween.add(this, { cameraFocusedState: 0 }, { time: 0.5, transition: zehfernando.transitions.Easing.backInOut });
					//this.cameraFocusedState = 0;
					break;
				case RootState.Photographing:
					this.state = newState;
					zehfernando.transitions.ZTween.add(this, { cameraFocusedState: 1 }, { time: 0.5, transition: zehfernando.transitions.Easing.backInOut });
					//this.cameraFocusedState = 1;
					break;
				case RootState.Filter:
					this.state = newState;
					this.cameraFocusedState = 0;
					break;
			}

			// Switch the debug text
			if (this.state == RootState.Unknown)		this.debugText.setText("STATE: Unknown");
			if (this.state == RootState.Standby)		this.debugText.setText("STATE: Standby");
			if (this.state == RootState.Photographing)	this.debugText.setText("STATE: Photographing");
			if (this.state == RootState.Filter)			this.debugText.setText("STATE: Filter");
		}

		private applyCameraFocusedState() {
			// Set camera size
			this.cameraView.scale.x = this.cameraView.scale.y = zehfernando.utils.MathUtils.map(this._cameraFocusedState, 0, 1, this.desiredWidth / this.cameraView.nativeWidth, this.desiredHeight / this.cameraView.nativeHeight);
			this.cameraView.x = this.width * 0.5 - this.cameraView.width * 0.5;
			this.cameraView.y = this.height * 0.5 - this.cameraView.height * 0.5;

			// Set bar sizes and position
			this.topBar.scale.x = this.topBar.scale.y = this.width / this.topBar.texture.baseTexture.width;
			this.topBar.x = 0;
			this.topBar.y = zehfernando.utils.MathUtils.map(this._cameraFocusedState, 0, 1, 0, -this.topBar.height);

			this.bottomBar.scale.x = this.bottomBar.scale.y = this.width / this.bottomBar.texture.baseTexture.width;
			this.bottomBar.x = 0;
			this.bottomBar.y = zehfernando.utils.MathUtils.map(this._cameraFocusedState, 0, 1, this.height - this.bottomBar.height, this.height);
		}

		get width(): number {
			return this.desiredWidth;
		}

		get height(): number {
			return this.desiredHeight;
		}

	}
}
