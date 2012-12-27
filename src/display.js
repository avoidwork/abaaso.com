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
	$.hash(url);
};
