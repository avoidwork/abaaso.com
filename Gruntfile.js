var $         = require("abaaso"),
    Showdown  = require("showdown"),
    converter = new Showdown.converter();

module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json")
	});

	// aliases
	grunt.registerTask("build", ["files", /*"nav",*/ "sitemap"]);
	grunt.registerTask("default", ["build"]);

	// generates URI entry points
	grunt.registerTask("files", function () {
		var files = ["index"],
			body  = grunt.file.read("template.html");

		files.forEach(function (i) {
			console.log("Creating " + i + ".html");
			grunt.file.write(i + ".html", body);
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
		    tpl   = "<li><a href=\"#{{list}}-scroll\" class=\"scroll\" title=\"View {{display}}\"\"><div class=\"blue-btn\" data-target=\"{{target}}\">{{display}}</div></a></li>",
		    tpl2  = "<div class=\"eight columns price-table fast-anim flyIn hide {{item}}\">{{content}}</div>";

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
			var li_nav  = [],
			    li_copy = [],
			    regex   = new RegExp("(<ul class=\"" + i + "\">)(.*)(<\/ul>)"),
			    regex2  = new RegExp("{{CONTENT_" + i.toUpperCase() + "}}");

			nav[i].each(function (p) {
				var filename = p.hyphenate() + ".md",
				    content  = converter.makeHtml(grunt.file.read("wiki/" + filename)/*.replace(/```javascript/g, "```\n")*/),
				    html1, html2;

				html1 = tpl.replace("{{list}}", i).replace(/\{\{display\}\}/g, p.replace(".prototype", "")).replace(/\{\{target\}\}/g, p.replace("Prototype", "").toCamelCase());
				li_nav.push(html1);

				html2 = tpl2.replace("{{item}}", p.replace("Prototype", "").toCamelCase()).replace("{{content}}", content);
				li_copy.push(html2);
			});

			body = body.replace(regex, "$1" + li_nav.join("") + "$3");
			body = body.replace(regex2, li_copy.join("\n"));
		});

		grunt.file.write(file, body);
	});
};