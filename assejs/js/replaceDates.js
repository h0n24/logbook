// Time since
function timeSince(date) {
    var now = +new Date();
    var seconds = Math.floor((now - date) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " let";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " měsíců";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " dní";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hodin";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minut";
    }
    return Math.floor(seconds) + " sekund";
}
// Rewrite dates to ago
// Example: Naposledy navštívil MyStat : 13.12.21
// Return: 1 dní+
export function replaceDates() {
    // todo: rework so its more persistent?
    // right now its not catching switch between pairs aka different lectures
    setTimeout(function () {
        try {
            var testElement = document.querySelector('[ng-if="stud.last_date_vizit != null"] span');
            var testElementText = testElement.innerText;
            var _a = testElementText.split("."), day = _a[0], month = _a[1], year = _a[2];
            var date = "20" + year + "-" + month + "-" + day;
            var testElementDate = Date.parse(date);
            var testElementFinal = timeSince(testElementDate);
            var testElementLocalizedDate = new Date(testElementDate).toLocaleDateString("cs-CZ");
            testElement.innerText = testElementFinal;
            testElement.title = testElementLocalizedDate + "+";
            console.log("trying to replace dates");
            console.log(testElementText, date, testElementDate, testElementFinal, testElementLocalizedDate);
        }
        catch (error) { }
    }, 1000);
}
