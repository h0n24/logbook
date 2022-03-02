// remove all previous rules
for (var index = 0; index < 100; index++) {
    // @ts-ignore: Not in this file, it's the chrome
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [index]
    });
}
// TODO: find why it sometimes break the whole page
var blockUrls = [];
blockUrls = [
    [
        "logbook.itstep.org/assets/*/bootstrap/dist/css/bootstrap.css",
        "stylesheet",
    ],
];
//   ["fonts.googleapis.com", "stylesheet"],
//   ["logbook.itstep.org/assets/*/angular-material/angular-material.min.css","stylesheet",],
//   ["logbook.itstep.org/assets/*/bootstrap/dist/js/bootstrap.js", "script"],
//   ["logbook.itstep.org/assets/*/jquery.js", "script"],
//  ["logbook.itstep.org/assets/*/jquery/dist/jquery.js", "script"],
// raven leads to crash:   ["logbook.itstep.org/assets/9e4f2116/raven-js/dist/raven.js", "script"],
var rulesArray = [];
blockUrls.forEach(function (url, index) {
    var id = index + 1;
    var domain = url[0], resourceType = url[1];
    // console.log(`Blocking ${domain} with ${resourceType}`);
    var rule = {
        id: id,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: domain, resourceTypes: [resourceType] }
    };
    rulesArray.push(rule);
});
// console.log("rulesArray", rulesArray);
// @ts-ignore: Not in this file, it's the chrome
chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rulesArray
});
// @ts-ignore: Not in this file, it's the chrome
// chrome.declarativeNetRequest.getEnabledRulesets((rulesetIds) =>
//   console.log("rules added", rulesetIds)
// );
