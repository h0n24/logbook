// TODO: between dates -> in .beetwen_nav there is - instead of –⁠ (pomlčka)

const replacements = [];

// nenalezeno v lokalizačním systému
replacements.push(["№", "č. "]);
replacements.push(["ч", " hod"]);
replacements.push(["лет", "let"]);

// může být změněno v lokalizačním systému:
replacements.push(["Naposledy v MyStatu :", "Naposledy v MyStatu"]);
replacements.push(["V skupine  není studentů", "Ve skupině nejsou studenti"]);

// nemůže být změněno v lokalizačním systému
replacements.push(["Docházka, %", "Docházka"]); // proč? chyběli by % (css)

// more effective replacement for strings
function replaceWithTreeWalker() {
  let allTextNodes = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    ),
    // some temp references for performance
    tmptxt,
    tmpnode;

  // iterate through all text nodes
  while (allTextNodes.nextNode()) {
    tmpnode = allTextNodes.currentNode;
    tmptxt = tmpnode.nodeValue;

    for (let i = 0; i < replacements.length; i++) {
      tmptxt = tmptxt.replace(replacements[i][0], replacements[i][1]);
    }
    tmpnode.nodeValue = tmptxt;
  }
}

export function replaceStrings() {
  const debug = false;

  try {
    debug ? console.time("replaceStrings") : null;
    replaceWithTreeWalker();
    debug ? console.timeEnd("replaceStrings") : null;
  } catch (error) {}
}
