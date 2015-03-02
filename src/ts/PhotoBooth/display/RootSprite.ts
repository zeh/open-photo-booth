/// <reference path='FilterFactory.ts'/>
/// <reference path='camera/CameraContainerSprite.ts'/>
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
		private desiredWidth: number;
		private desiredHeight: number;
		private cameraView: CameraContainerSprite;
		private state: RootState;

		private debugText: PIXI.Text;


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(desiredWidth, desiredHeight) {
			super();

			// Properties
			this.desiredWidth = desiredWidth;
			this.desiredHeight = desiredHeight;
			this.state = RootState.Unknown;

			// Camera layer
			this.cameraView = new CameraContainerSprite(desiredWidth, desiredHeight);
			this.addChild(this.cameraView);

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

			// End
			this.changeState(RootState.Standby);
		}


		// ================================================================================================================
		// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

		private changeState(newState: RootState) {
			// Set the new state, doing all transitions necessary

			switch (newState) {
				case RootState.Standby:
					this.state = newState;
					zehfernando.transitions.ZTween.add(this.cameraView, { focusedState: 0 }, { time: 0.5, transition: zehfernando.transitions.Easing.backInOut });
					//this.cameraFocusedState = 0;
					break;
				case RootState.Photographing:
					this.state = newState;
					zehfernando.transitions.ZTween.add(this.cameraView, { focusedState: 1 }, { time: 0.5, transition: zehfernando.transitions.Easing.backInOut });
					//this.cameraFocusedState = 1;
					break;
				case RootState.Filter:
					this.state = newState;
					this.cameraView.focusedState = 0;
					break;
			}

			// Switch the debug text
			if (this.state == RootState.Unknown)		this.debugText.setText("STATE: Unknown");
			if (this.state == RootState.Standby)		this.debugText.setText("STATE: Standby");
			if (this.state == RootState.Photographing)	this.debugText.setText("STATE: Photographing");
			if (this.state == RootState.Filter)			this.debugText.setText("STATE: Filter");
		}

		get width(): number {
			return this.desiredWidth;
		}

		get height(): number {
			return this.desiredHeight;
		}

	}
}
