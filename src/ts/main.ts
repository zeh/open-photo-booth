/// <reference path='PhotoBooth/App.ts'/>
/// <reference path="definitions/rStats.d.ts" />

window.addEventListener("load", function() {
    var element = document.getElementById('content');
	var photobooth = new PhotoBooth.App(element, window.outerWidth, window.outerHeight);
	photobooth.start();

	// Statistics
	window["glS"] = new glStats(); // init at any point

	window["bS"] = new BrowserStats(); // init at any point

	window["rS"] = new rStats({
		CSSPath: "css/",
		values: {
			fps: { caption: 'Framerate (FPS)', below: 30 },
			raf: { caption: 'Time since last rAF (ms)' },
			frame: { caption: 'Total frame time (ms)', over: 16 },
			action1: { caption: 'Render action #1 (ms)', over: 3000 },
			render: { caption: 'WebGL Render (ms)' },
			rstats: { caption: 'rStats update (ms)' },
		},
		groups: [
			{ caption: 'Framerate', values: ['fps', 'raf'] },
			{ caption: 'Frame Budget', values: ['frame', 'action1', 'render', 'rstats'] }
		],
		fractions: [
			{ base: 'frame', steps: ['action1', 'render'] }
		],
		plugins: [
			window["glS"], window["bS"]
		]
	});

	window["renderStats"] = function() {
		window["glS"].start();

		var rS = window["rS"];

		rS("frame").start();
		rS("rAF").tick();
		rS("FPS").frame();

		//rS("action1").start();
		/* Perform action #1 */
		//rS("action1").end();

		rS("render").start();
		/* Perform render */
		rS("render").end();

		rS("frame").end();
		rS().update();

		window.requestAnimationFrame(window["renderStats"]);
	};
	window["renderStats"]();
});