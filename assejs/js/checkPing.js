// check ping regularly
export function checkPing() {
    var body = document.body;
    var pulseElement = document.createElement("div");
    pulseElement.id = "pulse";
    body.appendChild(pulseElement);
}
