// right click on menu -> leads to doubleclick to prevent waiting --------------
function click(x, y) {
    const ev = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: x,
        screenY: y,
    });
    const el = document.elementFromPoint(x, y);
    el.dispatchEvent(ev);
}
// TODO: maybe detect what is under the cursor and then clik on it directly?
// because waiting for the menu to open is extremely slow
export function onContextMenu(event) {
    // @ts-ignore: Not in this file, it's on the website
    if (event.pageX <= 16 * 3) {
        // alert("yes");
        event.preventDefault();
        // @ts-ignore: Not in this file, it's on the website
        click(event.clientX, event.clientY);
        setTimeout(() => {
            // @ts-ignore: Not in this file, it's on the website
            click(event.clientX, event.clientY);
        }, 250);
    }
}
// title info for .open-menu-block
export function addInfoForMenu() {
    try {
        document.querySelector(".open-menu-block").title =
            "Levé tlačítko: Otevřít menu — Pravé tlačítko: Otevřít položku menu";
    }
    catch (error) { }
}
