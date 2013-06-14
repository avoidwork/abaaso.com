/**
 * Scrolls to a new spot in the View
 *
 * @param  {String} arg Hash bang to parse
 * @return {Undefined}  undefined
 */
var spot = function (arg) {
	var id = arg.match(/#(.*)/),
	    obj;

	if (id instanceof Array && !id[1].isEmpty()) {
		obj = $("#" + id[1]);

		if (obj !== undefined) {
			// Subtracting 10px for good position relative to font
			window.scrollTo(0, (obj.position().top - 10));
		}
	}
};
