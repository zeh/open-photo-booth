module PhotoBooth {
	export class FilterDefinition {
		shader: PIXI.AbstractFilter;
		vignetteOpacity: number;
		grainOpacity: number;

		constructor(shader: PIXI.AbstractFilter, vignetteOpacity: number, grainOpacity: number) {
			this.shader = shader;
			this.vignetteOpacity = vignetteOpacity;
			this.grainOpacity = grainOpacity;
		}
	}

    export class FilterFactory {
		// All the filters
		static filters: FilterDefinition[];

		private static _constructor = (() => {
			// Creates all shaders

			FilterFactory.filters = new Array<FilterDefinition>();

			// Sepia
			FilterFactory.filters.push(new FilterDefinition(new PIXI.SepiaFilter(), 0.5, 0.5));

			// Gray
			var mtx = new PIXI.ColorMatrixFilter();
			//this.videoSprite.shader = filter;
			mtx.matrix = [
				0.2, 0.6, 0.2, 0,
				0.2, 0.6, 0.2, 0,
				0.2, 0.6, 0.2, 0,
				0, 0, 0, 1];

			FilterFactory.filters.push(new FilterDefinition(mtx, 0.5, 0.5));

			mtx = new PIXI.ColorMatrixFilter();
			mtx.matrix = [
				0.5, 0, 0, 0,
				0, 0.5, 0, 0,
				0, 0, 0.5, 0,
				0, 0, 0, 1];

			FilterFactory.filters.push(new FilterDefinition(mtx, 0.5, 0.5));

		})();
	}
}