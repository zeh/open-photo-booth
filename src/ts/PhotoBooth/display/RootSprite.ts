/// <reference path='FilterFactory.ts'/>
/// <reference path='CameraSprite.ts'/>
/// <reference path='../AppConstants.ts'/>
/// <reference path='shapes/Quad.ts'/>
/// <reference path='../../libs/tidbits/utils/MathUtils.ts'/>

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
					this.cameraFocusedState = 0;
					break;
				case RootState.Photographing:
					this.state = newState;
					this.cameraFocusedState = 1;
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
			this.cameraView.scale.x = this.cameraView.scale.y = zehfernando.utils.MathUtils.map(this._cameraFocusedState, 0, 1, this.desiredWidth / this.cameraView.nativeWidth, this.desiredHeight / this.cameraView.nativeHeight);
			this.cameraView.x = this.width * 0.5 - this.cameraView.width * 0.5;
			this.cameraView.y = this.height * 0.5 - this.cameraView.height * 0.5;
		}

		get width(): number {
			return this.desiredWidth;
		}

		get height(): number {
			return this.desiredHeight;
		}

	}
}
