/**
 * Creates and loads an image element by url.
 * @param  {String} url
 * @return {Promise} promise that resolves to an image element or
 *                   fails to an Error.
 */
function request_image(url) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject(url);
    };
    img.src =
      url +
      "?random-no-cache=" +
      Math.floor((1 + Math.random()) * 0x10000).toString(16);
  });
}

/**
 * Pings a url.
 * @param  {String} url
 * @param  {Number} multiplier - optional, factor to adjust the ping by.  0.3 works well for HTTP servers.
 * @return {Promise} promise that resolves to a ping (ms, float).
 */
function ping(url, multiplier) {
  return new Promise(function (resolve, reject) {
    var start = new Date().getTime();
    var response = function () {
      var delta = new Date().getTime() - start;
      delta *= multiplier || 1;
      resolve(delta);
    };
    request_image(url).then(response).catch(response);

    // Set a timeout for max-pings, 5s.
    setTimeout(function () {
      reject(Error("Timeout"));
    }, 5000);
  });
}

// check ping regularly
export function checkPing() {
  const body = document.body as HTMLElement;

  const pulseElement = document.createElement("div");
  pulseElement.id = "pulse";
  pulseElement.title = "Zkouším navázat spojení...";
  body.appendChild(pulseElement);

  // repeat every 5 seconds
  setInterval(function () {
    ping("https://logbook.itstep.org/", 1)
      .then(function (delta) {
        const pulseElement = document.getElementById("pulse");
        if (pulseElement) {
          pulseElement.classList.remove("disconnected");
          pulseElement.classList.add("connected");
          pulseElement.title = `Spojení se serverem v pořádku (${String(
            delta
          )} ms)`;
        }
      })
      .catch(function (err) {
        console.error("Could not ping remote URL", err);

        const pulseElement = document.getElementById("pulse");
        if (pulseElement) {
          pulseElement.classList.remove("connected");
          pulseElement.classList.add("disconnected");
          pulseElement.title = "Server není dostupný. Je VPN zapnutá?";
        }
      });
  }, 5000);
}
