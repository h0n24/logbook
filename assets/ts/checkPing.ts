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
      delta = Math.round(delta);
      resolve(delta);
    };
    request_image(url).then(response).catch(response);

    // Set a timeout for max-pings, 5s.
    setTimeout(function () {
      reject(Error("Timeout"));
    }, 5000);
  });
}

function testPing() {
  try {
    ping("https://logbook.itstep.org/", 0.4)
      .then(function (delta) {
        // console.error("Your ping is: ", delta);

        const pulseElement = document.getElementById("pulse");
        if (pulseElement) messageYourVPNisOnline(pulseElement, delta);
      })
      .catch(function (err) {
        // console.error("Could not ping remote URL", err);

        const pulseElement = document.getElementById("pulse");
        if (pulseElement) messageYourVPNisOffline(pulseElement);
      });
  } catch (error) {}
}

function messageYourVPNisOnline(pulseElement, delta) {
  pulseElement.classList.remove("disconnected");
  pulseElement.classList.add("connected");
  pulseElement.title = `Spojení se serverem v pořádku (${String(delta)} ms)`;
}

function messageYourVPNisOffline(pulseElement) {
  pulseElement.classList.remove("connected");
  pulseElement.classList.add("disconnected");
  pulseElement.title = "Server není dostupný. Je VPN zapnutá?";
}

function messageYoureOffline(pulseElement) {
  pulseElement.classList.remove("connected");
  pulseElement.classList.add("disconnected");
  pulseElement.title = "Váš počítač je offline.";
}

// check ping regularly
export function checkPing() {
  const body = document.body as HTMLElement;

  // init
  const pulseElement = document.createElement("div");
  pulseElement.id = "pulse";
  pulseElement.title = "Zkouším navázat spojení...";
  body.appendChild(pulseElement);

  // first run
  testPing();

  // repeat every 5 seconds
  let repeatWhenOnline = setTimeout(() => testPing(), 5000);

  // addEventListener version
  window.addEventListener("offline", (event) => {
    // console.log("The network connection has been lost.");
    clearInterval(repeatWhenOnline);

    messageYoureOffline(pulseElement);
    setTimeout(() => messageYoureOffline(pulseElement), 5000);
  });

  window.addEventListener("online", (event) => {
    // console.log("The network connection has been restored.");

    testPing();
    repeatWhenOnline = setTimeout(() => testPing(), 5000);
  });
}
