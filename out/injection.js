const s = document.createElement("script");
s.src = chrome.runtime.getURL("script-dist.js");
(document.head || document.documentElement).appendChild(s);
s.onload = function () {
  s.parentNode.removeChild(s);
};
