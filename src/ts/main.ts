/// <reference path='PhotoBooth/App.ts'/>

window.addEventListener("load", function() {
    var element = document.getElementById('content');
	var photobooth = new PhotoBooth.App(element, window.outerWidth, window.outerHeight);
	photobooth.start();

	// Statistics
	var stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild(stats.domElement);
	var renderStats = function () {
		stats.begin();
		// Code...
		stats.end();
		window.requestAnimationFrame(renderStats);
	};
	renderStats();
});