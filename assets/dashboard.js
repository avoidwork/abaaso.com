/**
 * abaaso.com
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2012 Jason Mulligan
 * @license BSD-3 <https://github.com/avoidwork/abaaso.com/blob/master/LICENSE>
 * @link https://github.com/avoidwork/abaaso.com
 * @module abaaso.com
 * @version 4.0.3
 */

(function (global) {
"use strict";

var REGEX_SECTIONS = /^(api|main|tutorials)$/,
    REGEX_URI      = /.*\/|\.html/g,
    push           = typeof history.pushState === "function",
    sections       = [],
    api, converter, display, section, tutorials;

/**
 * Sub-menu click handler
 * 
 * @param  {Object} e  Mouse event
 * @return {Undefined} undefined
 */
display = function (e) {
	var url    = "wiki/" + e.target.data("filename"),
	    target = $("#" + e.target.data("target") + " section.markdown")[0];
	
	$.stop(e);

	url.get(function (arg) {
		target.removeClass("loading").html(converter.makeHtml(arg));
	}, function (e) {
		target.removeClass("loading").html("<h1>" + $.label.error.serverError + "</h1>");
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
	// Caching
	converter = new Showdown.converter();
	sections  = $("article > section");

	// Fixing Google Plus positioning (nice code Google!)
	$(".g-plusone")[0].parentNode.find("> div")[0].css("left", "auto")

	// Showing body
	$("body").removeClass("opacity");
});

// DOM is ready
$.on("ready", function () {
	var anchor   = /A/,
	    download = $("a[data-section='download']")[0];

	// Page Navigation
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

	// Sub-section Navigation
	$("section.list a").on("click", function (e) {
		$.stop(e);
		display(e);
	});

	// Tying download anchor to input fields
	$("input[name='package']").on("click", function () {
		download.attr("href", this.val()).attr("title", "Download " + this.data("type") + " version");
	});

	// Setting sizes
	"http://cdn.abaaso.com/abaaso.min.js".headers(function (arg) {
		var size = arg["Content-Length"] || 0,
		    obj;

		if (size > 0) {
			obj = $("label[data-type='production']")[0];
			obj.html(obj.html() + " (" + filesize(size, true) + ")");
		}
	});

	"http://cdn.abaaso.com/abaaso.js".headers(function (arg) {
		var size = arg["Content-Length"] || 0,
		    obj;

		if (size > 0) {
			obj = $("label[data-type='debugging']")[0];
			obj.html(obj.html() + " (" + filesize(size, true) + ")");
		}
	});

	// Setting the version number
	$("#version").html($.version);
});

}(this));
