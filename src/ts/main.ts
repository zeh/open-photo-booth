/// <reference path='PhotoBooth/App.ts'/>

window.addEventListener("load", function() {
    var element = document.getElementById('content');
	var photobooth = new PhotoBooth.App(element);
	photobooth.start();
});