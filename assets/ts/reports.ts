export function reportsEnhacements(state) {
  console.log("0", state);
  if (state !== "report") return;

  console.log("1", state);

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      console.log("reportAutomation");
      console.log("2", state);
    } catch (error) {}
  }, 100);
}
