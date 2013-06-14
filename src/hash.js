/**
 * Loads the hash if it's a valid submenu item
 *
 * @return {Undefined} undefined
 */
hash = function () {
	var hash  = $.hash(),
	    file  = hash.replace(/^\/wiki\/|\#.*/g, ""),
	    valid = ($("section.active a[data-filename='" + file + "']").length > 0),
	    obj;

	// Processing the hashbang
	if (!hash.isEmpty() && valid) {
		// Preparing DOM & retrieving content
		obj = $("section.active section.markdown")[0];
		obj.clear().addClass("loading").get(hash.replace(/\#.*/, ""), function (arg) {
			// Filling in HTML
			obj.removeClass("loading").html(converter.makeHtml(arg));

			// Decorating code samples
			obj.find("pre code").each(function (i) {
				hljs.highlightBlock(i);
			});

			// Fixing relative wiki links
			obj.find("a").each(function (i) {
				i.attr("href", "#!/wiki/" + i.href.replace(/.*\//, "").replace("#", ".md#"));
			});

			// Making H2s into anchors / bookmarks
			obj.find("h2").each(function (i) {
				var text = i.text();

				i.clear().create("a", {innerHTML: text, href: "#!" + hash.replace(/#\w+$/, "") + "#" + i.id});
			});

			// Scrolling to target entry
			spot(hash);
		}, function () {
			obj.removeClass("loading").html("<h1>" + $.label.error.serverError + "</h1>");
		});
	}
};
