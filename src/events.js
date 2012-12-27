// Setting back button listener (if valid)
if (push) {
	$.on(window, "popstate", function (e) {
		var parsed = $.parse(location.href),
		    page   = parsed.pathname.replace(REGEX_URI, "");

		if (page.isEmpty()) page = "main";

		$.stop(e);
		section(e.state !== null ? e.state.section : page);
		current = page;
		copy(current);
		if (!parsed.hash.isEmpty()) hash();
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
	var download = $("a[data-section='download']")[0];

	if (push) {
		// Page Navigation
		$("a.section").on("click", function (e) {
			var data;

			$.stop(e);
			data = this.data("section");
			history.pushState({section: data}, this.textContent, this.href);
			section(data);
		});

		// Changing to hashbangs
		$("section.list a").each(function (i) {
			i.attr("href", "#!/wiki/" + i.data("filename"));
		});
	}

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
