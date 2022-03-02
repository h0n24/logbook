// TODO: between dates -> in .beetwen_nav there is - instead of –⁠ (pomlčka)

// more effective replacement for strings
function replaceWithTreeWalker() {
  var allTextNodes = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    ),
    // some temp references for performance
    tmptxt,
    tmpnode,
    // compile the RE and cache the replace string, for performance
    // cakeRE = "Naposledy v MyStatu :",
    // replaceValue = "Naposledy v MyStatu:";

    cakeRE = "№",
    replaceValue = "č. ";

  // iterate through all text nodes
  while (allTextNodes.nextNode()) {
    tmpnode = allTextNodes.currentNode;
    tmptxt = tmpnode.nodeValue;
    tmpnode.nodeValue = tmptxt.replace(cakeRE, replaceValue);
  }
}

export function replaceStrings() {
  setTimeout(() => {
    try {
      console.time("replaceStrings");
      replaceWithTreeWalker();
      console.timeEnd("replaceStrings");
    } catch (error) {}
  }, 6000);
}
