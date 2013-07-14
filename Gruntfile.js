var $ = require("abaaso");

module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json")
	});

	// aliases
	grunt.registerTask("build", ["nav", "files", "sitemap"]);
	grunt.registerTask("default", ["build"]);

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