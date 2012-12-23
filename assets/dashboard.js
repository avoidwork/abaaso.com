/**
 * abaaso.com
 * 
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 4.0.0
 */
(function (global) {
	"use strict";

	$.on("render", function () {
		$("body").removeClass("opacity");
	});

	$.on("ready", function () {
		var anchor            = /A/,
		    download          = $("a[data-section='download']")[0];

		// Navigation
		$("a.section").on("click", function (e) {
			$.stop(e);
			$("article > section").addClass("hidden");
			$("#" + this.data("section")).removeClass("hidden");
		});

		// Tying download anchor to input fields
		$("input[name='package']").on("click", function () {
			download.attr("href", this.val()).attr("title", "Download " + this.data("type") + " version");
		});

		// Setting sizes
		"http://cdn.abaaso.com/abaaso.min.js".headers(function (arg) {
			var obj  = $("span[data-type='production']")[0],
			    size = arg["Content-Lenght"] || 0;

			if (size > 0) obj.html(obj.html() + " (" + filesize(size, true) + ")");
		});

		"http://cdn.abaaso.com/abaaso.js".headers(function (arg) {
			var obj  = $("span[data-type='debugging']")[0],
			    size = arg["Content-Lenght"] || 0;

			if (size > 0) obj.html(obj.html() + " (" + filesize(size, true) + ")");
		});

		// Setting the version number
		$("#version").html($.version);
	});
}(this));