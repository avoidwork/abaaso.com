/**
 * Loads the hash if it's a valid submenu item
 * 
 * @return {Undefined} undefined
 */
hash = function () {
	var hash  = $.hash(),
	    spot  = hash.match(/:(.*)/),
	    file  = hash.replace(/^wiki\/|\:.*/g, ""),
	    valid = ($("section.active a[data-filename='" + file + "']").length > 0),
	    obj;

	if (!hash.isEmpty() && valid) {
		obj = $("section.active section.markdown")[0];
		obj.clear().addClass("loading").get(hash.replace(/\:.*/, ""), function (arg) {
			var x;

			// Filling in HTML
			obj.removeClass("loading").html(converter.makeHtml(arg));

			// Decorating code samples
			obj.find("pre code").each(function (i) {
				hljs.highlightBlock(i);
			});

			// Fixing relative wiki links
			obj.find("a").each(function (i) {
				i.attr("href", "#!/wiki/" + i.href.replace(/.*\//, "").replace("#", ".md:"));
			});

			// Scrolling to target entry
			if (spot instanceof Array && !spot[1].isEmpty()) {
				x = $("#" + spot[1]);

				if (x !== undefined) {
					// Subtracting 10px for good position relative to font
					window.scrollTo(0, (x.position().top - 10));
				}
			}
		}, function (e) {
			obj.removeClass("loading").html("<h1>" + $.label.error.serverError + "</h1>");
		});
	}
};
