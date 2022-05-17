// automatically login
export function autoLogin(state) {
    setTimeout(function () {
        try {
            if (state !== "login")
                return;
            const languages = document.querySelectorAll(".lang-item");
            languages.forEach((language) => {
                const liElement = language;
                const aElement = liElement.querySelector("a");
                const foundLanguage = liElement.innerText.toLowerCase();
                // skip other languages
                if (foundLanguage !== navigator.language)
                    return;
                // skip if already active
                if (aElement.classList.contains("active"))
                    return;
                aElement.click();
            });
        }
        catch (error) { }
    }, 2000);
}
