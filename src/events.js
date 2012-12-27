// Setting back button listener (if valid)
if (push) {
	$.on(window, "popstate", function (e) {
		var parsed = $.parse(location.href),
		    page   = parsed.pathname.replace(REGEX_URI, "");

		if (page.isEmpty()) page = "main";

		$.stop(e);

		if (current !== page) {
			current = page;
			section(e.state !== null ? e.state.section : page);
		}

		if (!parsed.hash.isEmpty()) hash();
		else {
			if (!content.hasOwnProperty(current)) content[current] = $("#" + current).html()
			else $("#" + current).html(content[current]);
		}
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
