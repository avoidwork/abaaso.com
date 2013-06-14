/**
 * Scrolls to a new spot in the View
 *
 * @param  {String} arg Hash bang to parse
 * @return {Undefined}  undefined
 */
var spot = function (arg) {
	var id = arg.match(/#(.*)/),
	    obj, pos;

	if (id instanceof Array && !id[1].isEmpty()) {
		obj = $("#" + id[1]);

		// Scrolling to Element if needed
		if (obj !== undefined) {
			pos = obj.position();

			if ((pos.top > document.body.scrollTop) || (pos.top < ($.position().bottom - $.client.size.height))) {
				window.scrollTo(0, (pos.top - 10));
			}
		}
	}
};
