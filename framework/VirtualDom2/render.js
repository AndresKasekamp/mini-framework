const renderElem = ({ tagName, attrs, children }) => {
  const $el = document.createElement(tagName);

  // set attributes
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith("on")) {
      $el.addEventListener(k.slice(2).toLowerCase(), v);
    } else {
      $el.setAttribute(k, v);
    }
    
  }

  // set children
  for (const child of children) {
    const $child = render(child);
    $el.appendChild($child);
  }

  return $el;
};

const render = (vNode) => {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  return renderElem(vNode);
};

export default render;


// if (key.startsWith("on")) {
//   el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
// } else {
//   if (key === "checked") {
//     if (vnode.props[key] === true) {
//       el.setAttribute(key, vnode.props[key]);
//     } else {
//       continue;
//     }
//   }
//   el.setAttribute(key, vnode.props[key]);
// }