module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: {
				src: ["release/"]
			}
		},
		copy: {
			main: {
				files: [
					{ expand: true, cwd: 'src/', src: ['**', '!**/*.ts', '!ts/**'], dest: 'release/' },
				],
			},
		},
		ts: {
			// use to override the default options, See: http://gruntjs.com/configuring-tasks#options
			// these are the default options to the typescript compiler for grunt-ts:
			// see `tsc --help` for a list of supported options.
			options: {
				compile: true,					// perform compilation. [true (default) | false]
				comments: false,				// same as !removeComments. [true | false (default)]
				target: 'es3',					// target javascript language. [es3 | es5 (grunt-ts default) | es6]
				module: 'amd',					// target javascript module style. [amd (default) | commonjs]
				sourceMap: true,				// generate a source map for every output js file. [true (default) | false]
				sourceRoot: '',					// where to locate TypeScript files. [(default) '' == source ts location]
				mapRoot: '',					// where to locate .map.js files. [(default) '' == generated js location.]
				declaration: false,				// generate a declaration .d.ts file for every output js file. [true | false (default)]
				/*
				htmlModuleTemplate: 'My.Module.<%= filename %>',	// Template for module name for generated ts from html files [(default) '<%= filename %>']
				htmlVarTemplate: '<%= ext %>',						// Template for variable name used in generated ts from html files [(default) '<%= ext %>]
																	// Both html templates accept the ext and filename parameters.
				*/
				noImplicitAny: false,			// set to true to pass --noImplicitAny to the compiler. [true | false (default)]
				fast: "watch"					// see https://github.com/TypeStrong/grunt-ts/blob/master/docs/fast.md ["watch" (default) | "always" | "never"]
				/* ,compiler: './node_modules/grunt-ts/customcompiler/tsc'	*/ //will use the specified compiler.
			},
			// a particular target
			dev: {
				src: ["src/ts/main.ts"],			// The source typescript files, http://gruntjs.com/configuring-tasks#files
				// html: ['app/**/**.tpl.html'],	// The source html files, https://github.com/basarat/grunt-ts#html-2-typescript-support
				// reference: 'app/reference.ts',	// If specified, generate this file that you can use for your reference management
				out: 'release/js/photobooth.js',				// If specified, generate an out.js file which is the merged js file
				watch: 'src/ts',					// If specified, watches this directory for changes, and re-runs the current target
				// use to override the grunt-ts project options above for this target
				/*
				options: {
					module: 'commonjs',
				},
				*/
			}
		},
	});
	
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask("build", ["clean:build", "copy:main", "ts:dev"]);

	grunt.registerTask('default', 'Shows available tasks', function() {
		grunt.log.writeln("--------------------------------------------------------------------");
		grunt.log.writeln("Available tasks: ");
		grunt.log.writeln();
		grunt.log.writeln("clean		: Clean the /release folder");
		grunt.log.writeln("copy			: Copy static (main) files");
		grunt.log.writeln("build		: Clean, copy static files, and build the ts files and watch for changes");
		grunt.log.writeln("--------------------------------------------------------------------");
	});
	
	/*
	make.bat used to be:
	tsc ts/main.ts --sourcemap -out photobooth.js
	*/

};