export function homeworkEnhancements(state) {
    if (state !== "presents.addHomeWork")
        return;
    // needs small timeout because angular firstly
    // adds and after that removes previous rows
    // so it would count previous rows as present
    setTimeout(function () {
        try {
            console.log("addHomeWork enhancements loaded");
        }
        catch (error) { }
    }, 100);
    // longer timeout
    setTimeout(function () {
        try {
            console.log("addHomeWork enhancements loaded");
        }
        catch (error) { }
    }, 200);
}
