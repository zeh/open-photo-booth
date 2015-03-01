module PhotoBooth {
    export class Quad extends PIXI.Graphics {

		constructor(desiredColor, desiredWidth, desiredHeight) {
			super();

			// Draws quad
			this.beginFill(desiredColor);
			this.lineStyle(0);
			this.drawRect(0, 0, desiredWidth, desiredHeight);
		}
	}
}
