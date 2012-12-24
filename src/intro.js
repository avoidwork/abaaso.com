(function (global) {
	"use strict";

	var REGEX_SECTIONS = /^(api|main|tutorials)$/,
	    push           = typeof history.pushState === "function",
	    sections       = [],
	    api, converter, display, section, tutorials;
