/// <reference path='PhotoBooth/App.ts'/>
/// <reference path="definitions/stats.d.ts" />
/// <reference path="definitions/pixi.d.ts" />

window.addEventListener("load", function() {
    var element = document.getElementById('content');
	var photobooth = new PhotoBooth.App(element);
	photobooth.start();

	var stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild(stats.domElement);
	setInterval(function () {
		stats.begin();
		// your code goes here
		stats.end();
	}, 1000 / 60);


	var renderer = new PIXI.WebGLRenderer(800, 600);
});