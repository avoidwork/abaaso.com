(function ($) {
"use strict";

var REGEX_SECTIONS = /^(api|main|tutorials)$/,
    REGEX_URI      = /.*\/|\.html/g,
    html           = $("html")[0],
    sections       = [],
    content        = {},
    current        = "main",
    copy, converter, display, hash, section;

// Setting tabs as 4 spaces
hljs.tabReplace = "    ";
