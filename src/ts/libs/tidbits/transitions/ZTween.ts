/// <reference path='../signals/SimpleSignal.ts'/>
/// <reference path='Easing.ts'/>

module zehfernando.transitions {

	/**
	 * @author Zeh Fernando
	 */
	export class ZTween {

		// Static properties
		public static currentTime:number;					// The current time. This is generic for all tweenings for a "time grid" based update
		public static currentTimeFrame:number;				// The current frame. Used on frame-based tweenings

		private static tweens:Array<ZTween> = [];			// List of active tweens
//		protected static var tt:Vector.<ZTween>;											// Temp tween list

		// Properties
		private _target					:any;					// Object affected by this tweening
		private properties				:Array<ZTweenProperty>;		// List of properties that are tweened

		private timeStart				:number;			// Time when this tweening should start
		private timeCreated				:number;			// Time when this tweening was created
		private timeComplete			:number;			// Time when this tweening should end
		private timeDuration			:number;			// Time this tween takes (cache)
		private transition				:Function;			// Equation to control the transition animation
		//private transitionParams			:Object;		// Additional parameters for the transition
		//private rounded					:boolean;		// Use rounded values when updating
		private timePaused				:number;			// Time when this tween was paused
		//private skipUpdates				:uint;			// How many updates should be skipped (default = 0; 1 = update-skip-update-skip...)
		//private updatesSkipped			:uint;			// How many updates have already been skipped
		private started					:boolean;			// Whether or not this tween has already started executing

		private _onStart				:zehfernando.signals.SimpleSignal;
		private _onUpdate				:zehfernando.signals.SimpleSignal;
		private _onComplete				:zehfernando.signals.SimpleSignal;

		// External properties
		private _paused: boolean;			// Whether or not this tween is currently paused
		private _useFrames: boolean;		// Whether or not to use frames instead of seconds

		// Temporary variables to avoid disposal
		private t: number;		// Current time (0-1)
		private tProperty: ZTweenProperty;	// Property being checked
		private pv: number;
		private i: number;			// Loop iterator
		private cTime: number;			// Current engine time (in frames or seconds)

		// Temp vars
		protected static i: number;
		protected static l: number;

		// ================================================================================================================
		// STATIC PSEUDO-CONSTRUCTOR --------------------------------------------------------------------------------------

		public static _init():void {
			// Starts the engine
			this.currentTimeFrame = 0;
			this.currentTime = 0;

			this.frameTick();
		}

		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		/**
		 * Creates a new Tween.
		 *
		 * @param	p_scope				Object		Object that this tweening refers to.
		 */
		constructor(target:any, properties:any = null, parameters:any = null) {

			this._target		=	target;

			this.properties		=	new Array<ZTweenProperty>();
			for (var pName in properties) {
				this.properties.push(new ZTweenProperty(pName, properties[pName]));
				//addProperty(pName, __properties[pName]);
			}

			this.timeCreated	= ZTween.currentTime;
			this.timeStart		= this.timeCreated;

			// Parameters
			this.time			= 0;
			this.delay			= 0;
			this.transition		= Easing.none;

			this._onStart		= new zehfernando.signals.SimpleSignal();
			this._onUpdate		= new zehfernando.signals.SimpleSignal();
			this._onComplete	= new zehfernando.signals.SimpleSignal();

			// Read parameters
			if (parameters != null) {
				if (parameters.hasOwnProperty("time")) this.time = parameters["time"];
				if (parameters.hasOwnProperty("delay")) this.delay = parameters["delay"];

				if (parameters.hasOwnProperty("transition")) this.transition = parameters["transition"];

				if (parameters.hasOwnProperty("onStart")) this._onStart.add(parameters["onStart"]); // , parameters["onStartParams"]
				if (parameters.hasOwnProperty("onUpdate")) this._onUpdate.add(parameters["onUpdate"]);
				if (parameters.hasOwnProperty("onComplete")) this._onComplete.add(parameters["onComplete"]);
			}
			//transitionParams	=	new Array();

			this._useFrames = false;

			this._paused		=	false;
			//skipUpdates		=	0;
			//updatesSkipped	=	0;
			this.started = false;
		}


		// ================================================================================================================
		// INTERNAL functions ---------------------------------------------------------------------------------------------

		private updateCache():void {
			this.timeDuration = this.timeComplete - this.timeStart;
		}


		// ==================================================================================================================================
		// ENGINE functions -----------------------------------------------------------------------------------------------------------------

		/**
		 * Updates all existing tweenings.
		 */
		private static updateTweens():void {
			//trace ("updateTweens");

			this.l = this.tweens.length;
			for (this.i = 0; this.i < this.l; this.i++) {
				if (this.tweens[this.i] == null || !this.tweens[this.i].update(this.currentTime, this.currentTimeFrame)) {
					// Old tween, remove
					this.tweens.splice(this.i, 1);
					this.i--;
					this.l--;
				}
			}
		}

		/**
		 * Ran once every frame. It's the main engine; updates all existing tweenings.
		 */
		private static frameTick():void {
			// Update time
			this.currentTime = (new Date()).getTime();

			// Update frame
			this.currentTimeFrame++;

			// Update all tweens
			this.updateTweens();

			window.requestAnimationFrame(this.frameTick.bind(this));
		}


		// ================================================================================================================
		// PUBLIC STATIC functions ----------------------------------------------------------------------------------------

		/**
		 * Create a new tweening for an object and starts it.
		 */
		public static add(target:any, properties:any = null, parameters:any = null): ZTween {
			var t:ZTween = new ZTween(target, properties, parameters);
			this.tweens.push(t);
			return t;
		}

		/**
		 * Remove tweenings for a given object from the active tweening list.
		 */
		/*
		public static function remove(__target:Object, ...__args):boolean {
			// Create the list of valid property list
			//var properties:Vector.<String> = new Vector.<String>();
			//l = args["length"];
			//for (i = 0; i < l; i++) {
			//	properties.push(args[i]);
			//}

			// Call the affect function on the specified properties
			return affectTweens(removeTweenByIndex, __target, __args);
		}
		*/

		public static updateTime():void {
			// Force a time update - should only be used after complex calculations that take a lot more than a frame
			this.currentTime = (new Date()).getTime();
		}

		public static remove(target:any, ...props):boolean {
			var tl:Array<ZTween> = [];

			var l:number = this.tweens.length;
			var i: number;
			var j: number;
			// TODO: use filter?

			for (i = 0; i < l; i++) {
				if (this.tweens[i] != null && this.tweens[i]._target == target) {
					if (props.length > 0) {
						for (j = 0; j < this.tweens[i].properties.length; j++) {
							if (props.indexOf(this.tweens[i].properties[j].name) > -1) {
								this.tweens[i].properties.splice(j, 1);
								j--;
							}
						}
						if (this.tweens[i].properties.length == 0) tl.push(this.tweens[i]);
					} else {
						tl.push(this.tweens[i]);
					}
				}
			}

			var removedAny:boolean = false;

			l = tl.length;

			for (i = 0; i < l; i++) {
				j = this.tweens.indexOf(tl[i]);
				this.removeTweenByIndex(j);
				removedAny = true;
			}

			return removedAny;
		}

		public static hasTween(target:any, ...props):boolean {
			//return (getTweens.apply(([__target] as Array).concat(__props)) as Vector.<ZTween>).length > 0;

			var l:number = this.tweens.length;
			var i:number;
			var j:number;
			// TODO: use filter?

			for (i = 0; i < l; i++) {
				if (this.tweens[i] != null && this.tweens[i]._target == target) {
					if (props.length > 0) {
						for (j = 0; j < this.tweens[i].properties.length; j++) {
							if (props.indexOf(this.tweens[i].properties[j].name) > -1) {
								return true;
							}
						}
					} else {
						return true;
					}
				}
			}

			return false;

		}

		public static getTweens(target:any, ...props):Array<ZTween> {
			var tl:Array<ZTween> = [];

			var l:number = this.tweens.length;
			var i:number;
			var j:number;
			var found:boolean;
			// TODO: use filter?

			//trace ("ZTween :: getTweens() :: getting tweens for "+__target+", "+__props+" ("+__props.length+" properties)");

			for (i = 0; i < l; i++) {
				if (this.tweens[i] != null && this.tweens[i]._target == target) {
					if (props.length > 0) {
						found = false;
						for (j = 0; j < this.tweens[i].properties.length; j++) {
							if (props.indexOf(this.tweens[i].properties[j].name) > -1) {
								found = true;
								break;
							}
						}
						if (found) tl.push(this.tweens[i]);
					} else {
						tl.push(this.tweens[i]);
					}
				}
			}

			return tl;
		}

		public static pause(target:any, ...props):boolean {
			var pausedAny:boolean = false;

			var ftweens:Array<ZTween> = this.getTweens.apply(null, ([target]).concat(props));
			var i:number;

			//trace ("ZTween :: pause() :: pausing tweens for " + __target + ": " + ftweens.length + " actual tweens");

			// TODO: use filter/apply?
			for (i = 0; i < ftweens.length; i++) {
				if (!ftweens[i].paused) {
					ftweens[i].pause();
					pausedAny = true;
				}
			}

			return pausedAny;
		}

		public static resume(target:any, ...props):boolean {
			var resumedAny:boolean = false;

			var ftweens:Array<ZTween> = this.getTweens.apply(null, ([target]).concat(props));
			var i:number;

			// TODO: use filter/apply?
			for (i = 0; i < ftweens.length; i++) {
				if (ftweens[i].paused) {
					ftweens[i].resume();
					resumedAny = true;
				}
			}

			return resumedAny;
		}

		/**
		 * Remove a specific tweening from the tweening list.
		 *
		 * @param		p_tween				Number		Index of the tween to be removed on the tweenings list
		 * @return							boolean		Whether or not it successfully removed this tweening
		 */
		public static removeTweenByIndex(i:number):void {
			//__finalRemoval:boolean = false
			this.tweens[i] = null;
			//if (__finalRemoval) tweens.splice(__i, 1);
			//tweens.splice(__i, 1);
			//return true;
		}

		/**
		 * Do some generic action on specific tweenings (pause, resume, remove, more?)
		 *
		 * @param		__function			Function	Function to run on the tweenings that match
		 * @param		__target			Object		Object that must have its tweens affected by the function
		 * @param		__properties		Array		Array of strings that must be affected
		 * @return							boolean		Whether or not it successfully affected something
		 */
		/*
		private static function affectTweens (__affectFunction:Function, __target:Object, __properties:Array):boolean {
			var affected:boolean = false;

			l = tweens.length;

			for (i = 0; i < l; i++) {
				if (tweens[i].target == __target) {
					if (__properties.length == 0) {
						// Can affect everything
						__affectFunction(i);
						affected = true;
					} else {
						// Must check whether this tween must have specific properties affected
						var affectedProperties:Array = new Array();
						var j:uint;
						for (j = 0; j < p_properties.length; j++) {
							if (boolean(_tweenList[i].properties[p_properties[j]])) {
								affectedProperties.push(p_properties[j]);
							}
						}
						if (affectedProperties.length > 0) {
							// This tween has some properties that need to be affected
							var objectProperties:uint = AuxFunctions.getObjectLength(_tweenList[i].properties);
							if (objectProperties == affectedProperties.length) {
								// The list of properties is the same as all properties, so affect it all
								p_affectFunction(i);
								affected = true;
							} else {
								// The properties are mixed, so split the tween and affect only certain specific properties
								var slicedTweenIndex:uint = splitTweens(i, affectedProperties);
								p_affectFunction(slicedTweenIndex);
								affected = true;
							}
						}
					}
				}
			}
			return affected;
		}
		*/

		// ================================================================================================================
		// PUBLIC INSTANCE functions --------------------------------------------------------------------------------------

		// Event interceptors for caching
		public update(currentTime: number, currentTimeFrame: number):boolean {

			if (this._paused) return true;

			this.cTime = this._useFrames ? currentTimeFrame : currentTime;

			if (this.started || this.cTime >= this.timeStart) {
				if (!this.started) {
					this._onStart.dispatch();

					for (this.i = 0; this.i < this.properties.length; this.i++) {
						// Property value not initialized yet
						this.tProperty = this.properties[this.i];

						// Directly read property
						this.pv = this._target[this.tProperty.name];

						this.tProperty.valueStart = isNaN(this.pv) ? this.tProperty.valueComplete : this.pv; // If the property has no value, use the final value as the default
						this.tProperty.valueChange = this.tProperty.valueComplete - this.tProperty.valueStart;
					}
					this.started = true;
				}

				if (this.cTime >= this.timeComplete) {
					// Tweening time has finished, just set it to the final value
					for (this.i = 0; this.i < this.properties.length; this.i++) {
						this.tProperty = this.properties[this.i];
						this._target[this.tProperty.name] = this.tProperty.valueComplete;
					}

					this._onUpdate.dispatch();
					this._onComplete.dispatch();

					return false;

				} else {
					// Tweening must continue
					this.t = this.transition((this.cTime - this.timeStart) / this.timeDuration);
					for (this.i = 0; this.i < this.properties.length; this.i++) {
						this.tProperty = this.properties[this.i];
						this._target[this.tProperty.name] = this.tProperty.valueStart + this.t * this.tProperty.valueChange;
					}

					this._onUpdate.dispatch();
				}

			}

			return true;

		}

		public pause():void {
			if (!this._paused) {
				this._paused = true;
				this.timePaused = this._useFrames ? ZTween.currentTimeFrame : ZTween.currentTime;
			}
		}

		public resume():void {
			if (this._paused) {
				this._paused = false;
				var timeNow: number = this._useFrames ? ZTween.currentTimeFrame : ZTween.currentTime;
				this.timeStart += timeNow - this.timePaused;
				this.timeComplete += timeNow - this.timePaused;
			}
		}


		// ==================================================================================================================================
		// ACESSOR functions ----------------------------------------------------------------------------------------------------------------

		public get delay():number {
			return (this.timeStart - this.timeCreated) / (this._useFrames ? 1 : 1000);
		}

		public set delay(value:number) {
			this.timeStart = this.timeCreated + (value * (this._useFrames ? 1 : 1000));
			this.timeComplete = this.timeStart + this.timeDuration;
			//updateCache();
			// TODO: take pause into consideration!
		}

		public get time():number {
			return (this.timeComplete - this.timeStart) / (this._useFrames ? 1 : 1000);
		}

		public set time(value:number) {
			this.timeComplete = this.timeStart + (value * (this._useFrames ? 1 : 1000));
			this.updateCache();
			// TODO: take pause into consideration!
		}

		public get paused():boolean {
			return this._paused;
		}

		/*
		public function set paused(p_value:boolean):void {
			if (p_value == _paused) return;
			_paused = p_value;
			if (paused) {
				// pause
			} else {
				// resume
			}
		}
		*/

		public get useFrames():boolean {
			return this._useFrames;
		}

		public set useFrames(value:boolean) {
			var tDelay:number = this.delay;
			var tTime:number = this.time;
			this._useFrames = value;
			this.timeStart = this._useFrames ? ZTween.currentTimeFrame : ZTween.currentTime;
			this.delay = tDelay;
			this.time = tTime;
		}

		public get target():any {
			return this._target;
		}
		public set target(target:any) {
			this._target = target;
		}

		public get onStart(): zehfernando.signals.SimpleSignal {
			return this._onStart;
		}
		public get onUpdate(): zehfernando.signals.SimpleSignal {
			return this._onUpdate;
		}
		public get onComplete():zehfernando.signals.SimpleSignal {
			return this._onComplete;
		}
	}

	class ZTweenProperty {

		public valueStart: number;					// Starting value of the tweening (NaN if not started yet)
		public valueComplete: number;				// Final desired value
		public name: string;

		public valueChange: number;					// Change needed in value (cache)

		constructor(name:string, valueComplete:number) {
			this.name = name;
			this.valueComplete = valueComplete;
			//hasModifier			=	boolean(p_modifierFunction);
			//modifierFunction 	=	p_modifierFunction;
			//modifierParameters	=	p_modifierParameters;
		}
	}

	ZTween._init();
}
