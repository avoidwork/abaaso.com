/**
 * Toggles the visible section
 * 
 * @param  {String} arg Section to view
 * @return {Undefined}  undefined
 */
section = function (arg) {
	if (!REGEX_SECTIONS.test(arg)) location.href = "/";
	sections.removeClass("active").addClass("hidden");
	$("#" + arg).addClass("active").removeClass("hidden");
};
