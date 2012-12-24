(function (global) {
	"use strict";

	var REGEX_SECTIONS = /^(api|main|tutorials)$/,
	    REGEX_URI      = /.*\/|\.html/g,
	    push           = typeof history.pushState === "function",
	    sections       = [],
	    api, converter, display, section, tutorials;
