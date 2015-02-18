# OpenPhotoBooth

This is a Photo Booth application. It is created in TypeScript and compiled as a JavaScript/HTML5 application that runs inside a browser.

The idea is not to run from a website, but instead, as a dedicated application, possibly under [Node-webkit](https://github.com/nwjs/nw.js/tree/master).

This is a very empty project right now, as it's still being built.

## Features planned:

* Standby/attractor mode
* Taking sequence of photos
* Applying photo effects (a la Instagram)
* Uploading to Instagram (UploadQueue)
* Printing (PrintQueue)
* Tagging?
* Showing current collection of photos during standby?

## Building

OpenPhotoBooth uses grunt as its build manager. Once downloaded, run `npm install` to install all dependencies, then `grunt build` to build it into /release. The build task will also watch for changes to the source .ts files and re-build as needed.


## Running

Open /release/index.html inside a compatible browser.


## Visual Studio

The project is also set as a Visual Studio 2013 project. However, it is not a typical TypeScript project, but rather a "blank" website project.

To build from Visual Studio, you can either run grunt externally, or install [tools to run Grunt from inside Visual Studio](http://www.hanselman.com/blog/IntroducingGulpGruntBowerAndNpmSupportForVisualStudio.aspx). You can then right-click the gruntfile.js file from the Solution Explorer, open the "Task Runner Explorer" window, and then run your tasks right there.

To run from Visual Studio, click the "release" folder on Solution Explorer, then start debugging (F5) to run it in your browser using the internal server. You then only need to reload the website after changing source files.