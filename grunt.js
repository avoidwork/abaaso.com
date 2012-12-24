module.exports = function (grunt) {
	grunt.initConfig({
		pkg : "<json:package.json>",
		meta : {
			  banner : "/**\n" + 
					   " * <%= pkg.name %>\n" +
					   " *\n" +
					   " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
					   " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
					   " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
					   " * @link <%= pkg.homepage %>\n" +
					   " * @module <%= pkg.name %>\n" +
					   " * @version <%= pkg.version %>\n" +
					   " */"
		},
		concat: {
			dist: {
				src : [
					"<banner>",
					"src/intro.js",
					"src/api.js",
					"src/tutorials.js",
					"src/display.js",
					"src/section.js",
					"src/events.js",
					"src/outro.js"
				],
				dest : "assets/dashboard.js"
			}
		},
		min : {
			"assets/dashboard.min.js" : ["<banner>", "assets/dashboard.js"]
		}
	});

	grunt.registerTask("default", "concat min files");

	grunt.registerTask("files", function () {
		var files = ["api", "tutorials"],
			body  = grunt.file.read("index.html").replace('<section id="main">', '<section id="main" class="hidden">');

		files.forEach(function (i) {
			console.log("Creating " + i + ".html");
			grunt.file.write(i + ".html", body.replace(RegExp('<section id="' + i + '" class="hidden">'), '<section id="' + i + '">'));
		});
	});
};