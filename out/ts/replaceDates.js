// using forced czech date format:
// dateFormat = "d. M. yyyy"
function detectDate(element) {
    var elementText = element.innerText;
    var testElementText = elementText.replace(/\s/g, "");
    var _a = testElementText.split("."), day = _a[0], month = _a[1], year = _a[2];
    if (day.length === 1) {
        day = "0" + day;
    }
    if (month.length === 1) {
        month = "0" + month;
    }
    var date = year + "-" + month + "-" + day;
    var parsedDate = Date.parse(date);
    if (isNaN(parsedDate)) {
        return elementText;
    }
    return parsedDate;
}
// time since
function timeSince(date) {
    var now = +new Date();
    var seconds = Math.floor((now - date) / 1000);
    var interval = seconds / 31536000;
    // if not recognized, return original
    if (typeof interval !== "number") {
        return date;
    }
    if (interval > 1) {
        if (interval > 2) {
            return "před " + Math.floor(interval) + " lety";
        }
        return "před rokem";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        if (interval > 2) {
            return "před " + Math.floor(interval) + " měsíci";
        }
        return "před měsícem";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        if (interval > 2) {
            return "před " + Math.floor(interval) + " dny";
        }
        return "včera";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        // před hodinami
        return "dnes";
    }
    interval = seconds / 60;
    if (interval > 1) {
        // před minutami
        return "dnes";
    }
    return "nyní";
}
function localizedDate(date) {
    var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    try {
        return new Date(date).toLocaleDateString("cs-CZ", options);
    }
    catch (error) {
        return date;
    }
}
// Rewrite dates to ago
// Example: Naposledy navštívil MyStat : 13.12.21
// Return: před 2 hodinami
export function replaceDates() {
    // TODO: rework so its more persistent?
    // right now its not catching switch between pairs aka different lectures
    setTimeout(function () {
        console.time("replaceDates");
        // test elements
        var testedElements = document.querySelectorAll('[ng-if="stud.last_date_vizit != null"] span, .presents_stud td.mystat');
        // for each element
        for (var i = 0; i < testedElements.length; i++) {
            try {
                var testElement = testedElements[i];
                var date = detectDate(testElement);
                testElement.innerText = timeSince(date);
                testElement.title = localizedDate(date);
            }
            catch (error) { }
        }
        console.timeEnd("replaceDates");
    }, 5000);
}
