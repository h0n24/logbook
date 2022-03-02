// remove all previous rules
for (var index = 0; index < 100; index++) {
    // @ts-ignore: Not in this file, it's the chrome
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [index]
    });
}
var blockUrls = [];
blockUrls = [
    [
        "logbook.itstep.org/assets/*/bootstrap/dist/css/bootstrap.css",
        "stylesheet",
    ],
    [
        "logbook.itstep.org/assets/*/angular-material/angular-material.min.css",
        "stylesheet",
    ],
    ["fonts.googleapis.com/css", "stylesheet"],
    ["logbook.itstep.org/css/main.css", "stylesheet"],
    ["logbook.itstep.org/assets/*/bootstrap/dist/js/bootstrap.js", "script"],
    ["logbook.itstep.org/assets/*/jquery/dist/jquery.js", "script"],
    ["logbook.itstep.org/assets/*/jquery.js", "script", "/js/jquery.js"],
    [
        "logbook.itstep.org/assets/*/angular-material.min.js",
        "script",
        "/js/angular-material.min.js",
    ],
    [
        "logbook.itstep.org/assets/*/angular.min.js",
        "script",
        "/js/angular.min.js",
    ],
];
var rulesArray = [];
blockUrls.forEach(function (url, index) {
    var id = index + 1;
    var domain = url[0], resourceType = url[1], redirectUrl = url[2];
    var rule;
    // console.log(`Blocking ${domain} with ${resourceType}`);
    if (redirectUrl !== undefined) {
        // redirecting url
        rule = {
            id: id,
            priority: 1,
            action: { type: "redirect", redirect: { extensionPath: redirectUrl } },
            condition: {
                urlFilter: domain,
                domains: ["logbook.itstep.org"],
                resourceTypes: [resourceType]
            }
        };
    }
    else {
        // blocking url
        rule = {
            id: id,
            priority: 1,
            action: { type: "block" },
            condition: {
                urlFilter: domain,
                domains: ["logbook.itstep.org"],
                resourceTypes: [resourceType]
            }
        };
    }
    rulesArray.push(rule);
});
// @ts-ignore: Not in this file, it's the chrome
chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rulesArray
});
// @ts-ignore: Not in this file, it's the chrome
// chrome.declarativeNetRequest.getEnabledRulesets((rulesetIds) =>
//   console.log("rules added", rulesetIds)
// );
