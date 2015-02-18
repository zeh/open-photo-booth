/// <reference path='FilterFactory.ts'/>
/// <reference path='CameraSprite.ts'/>
/// <reference path='../AppConstants.ts'/>

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
			this.debugText.x = 100;
			this.debugText.y = 100;
			this.addChild(this.debugText);

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
			}

			// Switch the debug text
			if (this.state == RootState.Unknown)		this.debugText.setText("STATE: Unknown");
			if (this.state == RootState.Standby)		this.debugText.setText("STATE: Standby");
			if (this.state == RootState.Photographing)	this.debugText.setText("STATE: Photographing");
			if (this.state == RootState.Filter)			this.debugText.setText("STATE: Filter");
		}

		private applyCameraFocusedState() {
			this.cameraView.scale.x = this.cameraView.scale.y = 1 + (1-this.cameraFocusedState);
		}


	}
}
