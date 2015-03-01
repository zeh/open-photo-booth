module zehfernando.signals {

	/**
	 * @author zeh fernando
	 */
	class SimpleSignal {

		// Super-simple signals class inspired by Robert Penner's AS3Signals:
		// http://github.com/robertpenner/as3-signals
		// TODO: pass functions with any number of params? (a: any) => any

		// Properties
		private functions:Array<any>;

		private ifr:number;										// i for removal (to limit garbage collection)

		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		SimpleSignal() {
			this.functions = [];
		}


		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public add(func:any):boolean {
			if (this.functions.indexOf(func) == -1) {
				this.functions.push(func);
				return true;
			}
			return false;
		}

		public remove(func:any):boolean {
			this.ifr = this.functions.indexOf(func);
			if (this.ifr > -1) {
				this.functions.splice(this.ifr, 1);
				return true;
			}
			return false;
		}

		public removeAll():boolean {
			if (this.functions.length > 0) {
				this.functions.length = 0;
				return true;
			}
			return false;
		}

		public dispatch(...args:any[]):void {
			var functionsDuplicate:Array<any> = this.functions.concat();
			for (var i:number = 0; i < functionsDuplicate.length; i++) {
				functionsDuplicate[i].apply(undefined, args);
			}
		}


		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		public get numItems():number {
			return this.functions.length;
		}
	}
}