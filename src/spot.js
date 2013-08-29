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
