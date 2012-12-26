/**
 * Sub-menu click handler
 * 
 * @param  {Object} e  Mouse event
 * @return {Undefined} undefined
 */
display = function (e) {
	var url    = "wiki/" + e.target.data("filename"),
	    target = $("#" + e.target.data("target") + " section.markdown")[0];
	
	$.stop(e);

	url.get(function (arg) {
		target.removeClass("loading").html(converter.makeHtml(arg));
	}, function (e) {
		target.removeClass("loading").html("<h1>" + $.label.error.serverError + "</h1>");
	});
};
