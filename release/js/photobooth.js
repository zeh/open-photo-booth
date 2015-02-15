var PhotoBooth;
(function (PhotoBooth) {
    var App = (function () {
        function App(root) {
            this.root = root;
            this.root.innerHTML = "Loaded.";
        }
        App.prototype.start = function () {
            console.log("Initialized successfully");
        };
        return App;
    })();
    PhotoBooth.App = App;
})(PhotoBooth || (PhotoBooth = {}));
window.addEventListener("load", function () {
    var element = document.getElementById('content');
    var photobooth = new PhotoBooth.App(element);
    photobooth.start();
});
//# sourceMappingURL=photobooth.js.map