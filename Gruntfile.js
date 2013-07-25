var $ = require("abaaso");

module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		concat : {
			options : {
				banner : "/**\n" + 
				         " * <%= pkg.name %>\n" +
				         " *\n" +
				         " * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
				         " * @copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
				         " * @license <%= pkg.licenses[0].type %> <<%= pkg.licenses[0].url %>>\n" +
				         " * @link <%= pkg.homepage %>\n" +
				         " * @module <%= pkg.name %>\n" +
				         " * @version <%= pkg.version %>\n" +
				         " */\n"
			},
			dist : {
				src : [
					"src/intro.js",
					"src/copy.js",
					"src/display.js",
					"src/hash.js",
					"src/section.js",
					"src/spot.js",
					"src/events.js",
					"src/outro.js"
				],
				dest : "assets/dashboard.js"
			}
		},
		exec : {
			closure : {
				cmd : "cd assets\nclosure-compiler --js <%= pkg.name %>.js --js_output_file <%= pkg.name %>.min.js --create_source_map ./<%= pkg.name %>.map"
			},
			sourcemap : {
				cmd : "echo //@ sourceMappingURL=<%= pkg.name %>.map >> assets/<%= pkg.name %>.min.js"
			}
		},
		jshint : {
			options : {
				jshintrc : ".jshintrc"
			},
			src : "assets/<%= pkg.name %>.js"
		},
		nodeunit : {
			all : ["test/*.js"]
		},
		sed : {
			"version" : {
				pattern : "{{VERSION}}",
				replacement : "<%= pkg.version %>",
				path : ["<%= concat.dist.dest %>"]
			}
		},
		watch : {
			js : {
				files : "<%= concat.dist.src %>",
				tasks : "default"
			},
			pkg: {
				files : "package.json",
				tasks : "default"
			},
			idx: {
				files : "index.html",
				tasks : "default"
			}
		}
	});

	// tasks
	grunt.loadNpmTasks("grunt-sed");
	grunt.loadNpmTasks("grunt-exec");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks('grunt-contrib-watch');

	// aliases
	grunt.registerTask("test", [/*"nodeunit", */"jshint"]);
	grunt.registerTask("build", ["concat", "sed", "exec", "nav", "files", "sitemap"]);
	grunt.registerTask("default", ["build", "test"]);

	// generates URI entry points
	grunt.registerTask("files", function () {
		var files = ["api", "tutorials"],
			body  = grunt.file.read("index.html").replace('<section id="main">', '<section id="main" class="hidden">');

		files.forEach(function (i) {
			console.log("Creating " + i + ".html");
			grunt.file.write(i + ".html", body.replace(RegExp('<section id="' + i + '" class="hidden">'), '<section id="' + i + '"  class="active">'));
		});
	});

	// generates a sitemap.xml
	grunt.registerTask("sitemap", function () {
		var file    = "sitemap.xml",
			body    = grunt.file.read(file),
			date    = new Date(),
			year    = date.getFullYear(),
			month   = date.getMonth() + 1,
			day     = date.getDate(),
			dstring = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);

		console.log("Updating " + file);
		grunt.file.write(file, body.replace(/(lastmod\>)(.*)(<\/lastmod)/g, "$1" + dstring + "$3"));
	});

	// fills in the navigation
	grunt.registerTask("nav", function () {
		var file  = "index.html",
		    body  = grunt.file.read(file),
		    lists = ["api", "tutorials"],
		    nav   = {api: [], turtorials: []},
		    tpl   = "<li><a href=\"{{url}}\" title=\"{{name}}\" data-filename=\"{{filename}}\" data-target=\"{{target}}\">{{display}}</a></li>";

		nav.api = [
			"Array.prototype",
			"Element.prototype",
			"Function.prototype",
			"Number.prototype",
			"String.prototype",
			"abaaso",
			"array",
			"client",
			"cookie",
			"data",
			"datalist",
			"deferred ",
			"element",
			"events",
			"filter",
			"grid",
			"json",
			"label",
			"loading",
			"lru",
			"message",
			"mouse",
			"number",
			"observer",
			"promise",
			"route",
			"string",
			"timer",
			"validate",
			"xml"
		];

		nav.tutorials = [
			"Creating an AJAX request",
			"Creating an event listener",
			"Creating a data store",
			"Creating a RESTful data store",
			"Creating a data list",
			"Creating a data list filter",
			"Using events",
			"Using promises",
			"Using application states",
			"Iterating an Array",
			"Iterating an Object",
			"Using MongoDB for persistent storage"
		];

		lists.each(function (i) {
			var li    = [],
			    regex = new RegExp("(<ul class=\"" + i + "\">)(.*)(<\/ul>)");

			nav[i].each(function (p) {
				var filename = p.hyphenate() + ".md",
				    html     = tpl;

				html = html.replace(/\{\{url\}\}/g, "wiki/" + filename).replace(/\{\{name\}\}/g, p).replace(/\{\{filename\}\}/g, filename).replace(/\{\{target\}\}/g, i).replace(/\{\{display\}\}/g, p.replace(".prototype", ""));
				li.push(html);
			});

			body = body.replace(regex, "$1" + li.join("") + "$3");
			grunt.file.write(file, body);
		});
	});
};