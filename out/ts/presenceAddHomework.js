export function homeworkEnhancements(state) {
    if (state !== "presents.addHomeWork")
        return;
    // needs small timeout because angular firstly
    // adds and after that removes previous rows
    // so it would count previous rows as present
    setTimeout(function () {
        try {
            // reset value if its weird
            const max100mb = "(Maximálně 100 MB)";
            const inputFile = document.querySelector('[ng-model="file_hw_filename"]');
            if (inputFile.value === "select_file_dz") {
                inputFile.value = max100mb;
            }
            const inputCover = document.querySelector('[ng-model="file_cover"]');
            if (inputCover.value === "select_file_dz") {
                inputCover.value = max100mb;
            }
            // preset basic message
            const message = `Milí studenti, 

čeká nás další úkol. V přiloženém souboru najdete veškeré informace. Jistě si s tím hravě poradíte. Na úkol je klasicky týden. Těším se na Vaše práce. 

S pozdravem`;
            const homeworkMessage = document.querySelector('textarea[ng-model="form.descr"]');
            if (homeworkMessage.innerText === "") {
                homeworkMessage.innerText = message;
            }
        }
        catch (error) { }
    }, 100);
}
