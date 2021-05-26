type IPasteHtml = {
  name: string;
  element: HTMLDivElement
};

export const pasteImgAtCaret = ({ name, element }: IPasteHtml) => {
  let sel, range;
  const src = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@6.0.1/img/apple/64/${name}.png`
  const docSelection = (document as any).selection;
  if (window.getSelection) {
    // IE9 and non-IE
    const img = document.createElement("img");
    img.src = src
    img.className = "emoji-img"
    sel = window.getSelection() as any;
    if (!sel.anchorNode?.closest?.(`#${element.id}`)) {
      const divs = element.querySelectorAll("div")
      const elemToPast = divs.length ?  divs[divs.length - 1] : element
      elemToPast.insertAdjacentElement("beforeend", img)
      return
    }
    if (sel.getRangeAt && sel.rangeCount) {

      range = sel.getRangeAt(0);
      range.deleteContents();
      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      const el = document.createElement("div");
      el.appendChild(img)
      // el.innerHTML = html;
      let frag = document.createDocumentFragment(),
        node,
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (docSelection && docSelection.type != "Control") {
    // IE < 9
    docSelection.createRange().pasteHTML(`<img src={${src}} />`);
  }
};

