module PhotoBooth {
    export class FlyingMessage extends PIXI.DisplayObjectContainer {

		// Properties
		private messageSprite: PIXI.Sprite;
		private backgroundSprite: PIXI.Sprite;
		private _phase: number; // From 0 (hidden left) to 1 (hidden right)

		constructor(messageURL: string, backgroundURL: string) {
			super();

			// Bars
			var texture;

			texture = PIXI.Texture.fromImage(backgroundURL);
			this.backgroundSprite = new PIXI.Sprite(texture);
			this.backgroundSprite.anchor.set(0.5, 0.5);
			this.addChild(this.backgroundSprite);

			texture = PIXI.Texture.fromImage(messageURL);
			this.messageSprite = new PIXI.Sprite(texture);
			this.messageSprite.anchor.set(0.5, 0.5);
			this.addChild(this.messageSprite);

			// End
			this._phase = 0;
			this.applyPhaseState();
		}


		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		get phase(): number {
			return this._phase;
		}

		set phase(value: number) {
			if (this._phase != value) {
				this._phase = value;
				this.applyPhaseState();
			}
		}


		// ================================================================================================================
		// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

		private applyPhaseState() {
			
		}
	}
}
