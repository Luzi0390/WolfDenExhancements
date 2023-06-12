// ==UserScript==
// @name         Wolf Den Exhancements
// @namespace    WDE-Beta
// @version      0.0.3-beta
// @description  狼窝用
// @author       Luzi
// @include      /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @grant        none
// @license      MIT
// ==/UserScript==


(function () {
    'use strict';

    const script = document.createElement("script");
    script.src = `https://luzi0390.github.io/WolfDenExhancements/main.js`;
    window.s = script;
    document.head.appendChild(script);
})();