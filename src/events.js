// Assets are loaded
$.on("render", function () {
	var obj = $(".g-plusone")[0];

	// Fixing Google Plus positioning (nice code Google!)
	if (obj !== undefined) {
		obj.parentNode.find("> div")[0].css("left", "auto");
	}
});

// DOM is ready
$.on("ready", function () {
	// Caching
	converter    = new Showdown.converter();
	sections     = $("article > section");
	var download = $("a[data-section='download']")[0],
	    popped   = false,
	    previous, oldHash, oldAnchor;

	// HTML5 history API is available
	if (html.hasClass("history")) {
		// Setting back button listener
		$.on(window, "popstate", function (e) {
			var parsed, page, newHash, anchor;

			// Stopping bubbling
			$.stop(e);

			parsed  = $.parse(location.href),
			page    = parsed.pathname.replace(REGEX_URI, ""),
			newHash = $.hash().replace(/#.*$/, ""),
			anchor  = $.hash().match(/#(.*)/);

			// Blocks a second 'load' on initialization
			if (popped === false) {
				popped    = true;
				previous  = page;
				oldHash   = newHash;
				oldAnchor = anchor;
				spot($.hash());
				return;
			}

			if (anchor instanceof Array && !anchor[1].isEmpty()) {
				anchor = anchor[1];
			}

			if (page.isEmpty()) {
				page = "main";
			}

			current = page;

			// New page to display
			if (current !== previous) {
				previous  = current;
				oldHash   = newHash;
				oldAnchor = anchor;

				section(page);
				copy(current);

				window.scrollTo(0, 0);

				if (!parsed.hash.isEmpty()) {
					hash();
				}
			}
			// New hashbang, try to scroll to the current position
			else if (oldHash !== newHash) {
				oldHash   = newHash;
				oldAnchor = anchor;

				window.scrollTo(0, 0);

				hash();
			}
			// New anchor
			else if (oldAnchor !== anchor) {
				oldAnchor = anchor;
				spot($.hash());
			}
			else {
				hash();
			}
		}, "history");

		// Page Navigation
		$("a.section").on("click", function (e) {
			var data;

			$.stop(e);

			data = this.data("section");
			history.pushState({section: data}, this.textContent, this.href);
			section(data);
		});
	}

	// Hash API is available
	if (html.hasClass("hashchange")) {
		// Looking for hashbangs
		if ($.client.opera || !html.hasClass("history")) {
			$.on("hash", function (arg) {
				if (!arg.isEmpty()) {
					hash();
				}
			}, "wiki");
		}

		// Changing sub-menu items to use a hashbang
		$("section.list a").each(function (i) {
			i.attr("href", "#!/wiki/" + i.data("filename"));
		});

		// Explicitly loading hash for all browsers
		if (!$.parse(location.href).hash.isEmpty()) {
			hash();
		}
	}

	// Tying download anchor to input fields
	$("input[name='package']").on("click", function () {
		download.attr("href", this.val()).attr("title", "Download " + this.data("type") + " version");
	});

	// Setting the version number
	$(".version")[0].html($.version);

	// Setting line count
	"http://cdn.abaaso.com/abaaso.js".get(function (arg) {
		$(".lines")[0].html($.number.format(arg.split("\n").length));
	});
});
