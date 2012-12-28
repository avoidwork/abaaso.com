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

// Assets are loaded
$.on("render", function () {
	// Fixing Google Plus positioning (nice code Google!)
	$(".g-plusone")[0].parentNode.find("> div")[0].css("left", "auto")
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

	// Setting the version number
	$("#version").html($.version);

	// Caching
	converter = new Showdown.converter();
	sections  = $("article > section");
});
