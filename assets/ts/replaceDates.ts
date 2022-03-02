// Time since
function timeSince(date) {
  const now = +new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;

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

  setTimeout(() => {
    try {
      const testElement = document.querySelector(
        '[ng-if="stud.last_date_vizit != null"] span'
      ) as HTMLElement;

      const testElementText = testElement.innerText;
      const [day, month, year] = testElementText.split(".");
      const date = `20${year}-${month}-${day}`;

      const testElementDate = Date.parse(date);
      const testElementFinal = timeSince(testElementDate);
      const testElementLocalizedDate = new Date(
        testElementDate
      ).toLocaleDateString("cs-CZ");

      testElement.innerText = testElementFinal;
      testElement.title = testElementLocalizedDate + "+";

      console.log("trying to replace dates");
      console.log(
        testElementText,
        date,
        testElementDate,
        testElementFinal,
        testElementLocalizedDate
      );
    } catch (error) {}
  }, 1000);
}
