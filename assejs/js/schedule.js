"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scheduleEnhancements = scheduleEnhancements;
// schedulePage

// add right click to menu
function scheduleEnhancements(state) {
  if (state !== "schedulePage") return;

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      alert("schedule");
    } catch (error) {}
  }, 100);
}