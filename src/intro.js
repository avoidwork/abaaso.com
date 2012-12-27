(function (global) {
"use strict";

var REGEX_SECTIONS = /^(api|main|tutorials)$/,
    REGEX_URI      = /.*\/|\.html/g,
    push           = typeof history.pushState === "function",
    sections       = [],
    content        = {},
    current        = "main",
    api, copy, converter, display, hash, section, tutorials;
