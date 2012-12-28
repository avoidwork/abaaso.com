(function (global) {
"use strict";

var REGEX_SECTIONS = /^(api|main|tutorials)$/,
    REGEX_URI      = /.*\/|\.html/g,
    push           = $("html")[0].hasClass("history"),
    sections       = [],
    content        = {},
    current        = "main",
    api, copy, converter, display, hash, section, tutorials;
