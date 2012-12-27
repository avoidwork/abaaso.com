/**
 * Loads the hash if it's a valid submenu item
 * 
 * @return {Undefined} undefined
 */
hash = function () {
	var arg   = $.hash(),
	    valid = ($("section.active a[data-filename='" + arg.replace(/^wiki\//, "") + "']").length > 0),
	    obj;

	if (!arg.isEmpty() && valid) {
		obj = $("section.active section.markdown")[0];
		obj.addClass("loading").get(arg, function (arg) {
			obj.removeClass("loading").html(converter.makeHtml(arg));
		}, function (e) {
			obj.removeClass("loading").html("<h1>" + $.label.error.serverError + "</h1>");
		});
	}
};
