/**
 * Sub-menu click handler
 * 
 * @param  {Object} e Mouse event
 * @return {Undefined} undefined
 */
display = function (e, target) {
	var url = "wiki/" + e.target.data("filename");
	
	$.stop(e);

	url.get(function (arg) {
		target.removeClass("loading").html(converter.makeHtml(arg));
	}, function (e) {
		target.removeClass("loading").html($.label.error.serverError);
	});
};
