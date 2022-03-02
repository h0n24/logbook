// not being used yet - more effective replacement for strings
function replaceWithTreeWalker() {
  var allTextNodes = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    ),
    // some temp references for performance
    tmptxt,
    tmpnode,
    // compile the RE and cache the replace string, for performance
    cakeRE = "Naposledy navštívil MyStat",
    replaceValue = "V MyStatu?";

  // iterate through all text nodes
  while (allTextNodes.nextNode()) {
    tmpnode = allTextNodes.currentNode;
    tmptxt = tmpnode.nodeValue;
    tmpnode.nodeValue = tmptxt.replace(cakeRE, replaceValue);
  }
}

export function replaceStrings() {}
