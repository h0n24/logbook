"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportsEnhacements = reportsEnhacements;
function reportsEnhacements(state) {
  if (state !== "report") return;

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      console.log("reportAutomation");
    } catch (error) {}
  }, 100);
}