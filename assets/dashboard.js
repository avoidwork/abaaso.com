/**
 * dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2013 Jason Mulligan
 * @license BSD-3 <https://github.com/avoidwork/abaaso.com/blob/master/LICENSE>
 * @link https://github.com/avoidwork/abaaso.com
 * @module dashboard
 * @version 4.0.10
 */
(function ($) {
"use strict";

var REGEX_SECTIONS = /^(api|main|tutorials)$/,
    REGEX_URI      = /.*\/|\.html/g,
    html           = $("html")[0],
    sections       = [],
    content        = {},
    current        = "main",
    copy, converter, display, hash, section;

// Setting tabs as 4 spaces
hljs.tabReplace = "    ";

/**
 * Gets or sets the copy of a section
 *
 * @param  {String} arg Section
 * @return {Undefined}  undefined
 */
copy = function (arg) {
	var obj = $("#" + arg + " section.markdown")[0];

	if (obj !== undefined) {
		if (!content.hasOwnProperty(arg)) {
			content[arg] = obj.html();
		}
		else {
			obj.html(content[arg]);
		}
	}
};

/**
 * Sub-menu click handler
 *
 * @param  {Object} e  Mouse event
 * @return {Undefined} undefined
 */
display = function (e) {
	$.stop(e);
	$.hash("wiki/" + $.target(e).data("filename"));
};

/**
 * Loads the hash if it's a valid submenu item
 *
 * @return {Undefined} undefined
 */
hash = function () {
	var hash  = decodeURIComponent($.hash()).replace( /^\#\!/, ""),
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

/**
 * Toggles the visible section
 *
 * @param  {String} arg Section to view
 * @return {Undefined}  undefined
 */
section = function (arg) {
	var obj;

	if (!REGEX_SECTIONS.test(arg)) {
		location.href = "/";
	}

	sections.removeClass("active").addClass("hidden");
	obj = $("#" + current + " section.markdown")[0];

	if (obj !== undefined) {
		obj.html(content[current]);
	}

	$("#" + arg).addClass("active").removeClass("hidden");
};

/**
 * Scrolls to a new spot in the View
 *
 * @param  {String} arg Hash bang to parse
 * @return {Undefined}  undefined
 */
var spot = function (arg) {
	var id = arg.replace( /.*#/, "" ),
	    obj;

	if ( !id.isEmpty() ) {
		obj = $("#" + id);

		if ( obj ) {
			obj.scrollTo();
		}
	}
};

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
			var parsed, page, newHash, anchor, hashbang;

			// Stopping bubbling
			$.stop(e);

			parsed   = $.parse(location.href),
			page     = parsed.pathname.replace(REGEX_URI, ""),
			hashbang = decodeURIComponent($.hash()).replace(/^\#\!/, "");
			newHash  = hashbang.replace(/#.*$/, ""),
			anchor   = hashbang.match(/#(.*)/);

			// Blocks a second 'load' on initialization
			if (popped === false) {
				popped    = true;
				previous  = page;
				oldHash   = newHash;
				oldAnchor = anchor;
				hash();
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

				$.scroll([0, 0]);

				if (!parsed.hash.isEmpty()) {
					hash();
				}
			}
			// New hashbang, try to scroll to the current position
			else if (oldHash !== newHash) {
				oldHash   = newHash;
				oldAnchor = anchor;

				$.scroll([0, 0]);

				hash();
			}
			// New anchor
			else if (oldAnchor !== anchor) {
				oldAnchor = anchor;
				spot(hashbang);
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

}(abaaso));
