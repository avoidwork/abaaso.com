/**
 * abaaso.com
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2012 Jason Mulligan
 * @license BSD-3 <https://github.com/avoidwork/abaaso.com/blob/master/LICENSE>
 * @link https://github.com/avoidwork/abaaso.com
 * @module abaaso.com
 * @version 4.0.2
 */

(function (global) {
	"use strict";

	var REGEX_SECTIONS = /^(api|main|tutorials)$/,
	    REGEX_URI      = /.*\/|\.html/g,
	    push           = typeof history.pushState === "function",
	    sections       = [],
	    api, converter, display, section, tutorials;

// API pages
api = [
	"Array.prototype",
	"Element.prototype",
	"Function.prototype",
	"Number.prototype",
	"String.prototype",
	"$",
	"array",
	"client",
	"cookie",
	"data",
	"datalist",
	"element",
	"events",
	"filter",
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

// Tutorials pages
tutorials = [];

/**
 * Sub-menu click handler
 * 
 * @param  {Object} e Mouse event
 * @return {Undefined} undefined
 */
display = function (e, target) {
	var url = "wiki/" + e.target.data("filename");
	
	$.stop(e);

	url.get(function (arg) {
		target.removeClass("loading").html(converter.makeHtml(arg));
	}, function (e) {
		target.removeClass("loading").html($.label.error.serverError);
	});
};

/**
 * Toggles the visible section
 * 
 * @param  {String} arg Section to view
 * @return {Undefined}  undefined
 */
section = function (arg) {
	if (!REGEX_SECTIONS.test(arg)) location.href = "/";
	sections.addClass("hidden");
	$("#" + arg).removeClass("hidden");
};

// Setting back button listener (if valid)
if (push) {
	$.on(window, "popstate", function (e) {
		var page = location.href.replace(REGEX_URI, "");

		if (page.isEmpty()) page = "main";

		$.stop(e);
		section(e.state !== null ? e.state.section : page);
	}, "history");
}

// Assets loaded
$.on("render", function () {
	var targets  = ["api", "tutorials"],
	    dotproto = /\.prototype/,
	    proto    = /prototype/,
	    ab       = false;

	targets.each(function (target) {
		ab          = (target === "api");
		var obj     = $("#" + target),
		    ul      = obj.find("ul")[0],
		    section = obj.find("section.markdown")[0],
		    array   = ab ? api : tutorials;

		array.each(function (i) {
			var name = i.replace(dotproto, ""),
			    a    = ul.create("li").create("a", {"class": (ab ? (proto.test(i) ? "prototype" : "abaaso") : ""), innerHTML: name, "data-filename": i + ".md", "data-type": "api", title: name});
			
			a.on("click", function (e) {
				section.clear().addClass("loading");
				display(e, section);
			}, "menu");
		});
	});

	converter = new Showdown.converter();
	sections  = $("article > section");

	$("body").removeClass("opacity");
});

// DOM is ready
$.on("ready", function () {
	var anchor   = /A/,
	    download = $("a[data-section='download']")[0];

	// Navigation
	$("a.section").on("click", function (e) {
		var data;

		// Using history.pushHistory() if available
		if (push) {
			$.stop(e);
			data = this.data("section");
			history.pushState({section: data}, this.textContent, this.href);
			section(data);
		}
	});

	// Tying download anchor to input fields
	$("input[name='package']").on("click", function () {
		download.attr("href", this.val()).attr("title", "Download " + this.data("type") + " version");
	});

	// Setting sizes
	"http://cdn.abaaso.com/abaaso.min.js".headers(function (arg) {
		var obj  = $("span[data-type='production']")[0],
		    size = arg["Content-Length"] || 0;

		if (size > 0) obj.html(obj.html() + " (" + filesize(size, true) + ")");
	});

	"http://cdn.abaaso.com/abaaso.js".headers(function (arg) {
		var obj  = $("span[data-type='debugging']")[0],
		    size = arg["Content-Length"] || 0;

		if (size > 0) obj.html(obj.html() + " (" + filesize(size, true) + ")");
	});

	// Setting the version number
	$("#version").html($.version);
});

}(this));
