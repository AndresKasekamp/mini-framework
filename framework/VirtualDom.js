/**
 * Mounts a DOM node onto another DOM node, replacing the target node.
 * @param {Node} $node - The DOM node to be mounted.
 * @param {Node} $target - The target DOM node to be replaced with $node.
 * @returns {Node} - The enhanced node that has been mounted.
 */
export const mount = ($node, $target) => {
  $target.replaceWith($node);
  return $node;
};

/**
 * Mounts a DOM node onto another DOM node, replacing the target node.
 * @param {string} $node - The DOM node to be mounted.
 * @param {Object} $target - The target DOM node to be replaced with $node.
 * @param {Array<string|HTMLElement>} children - Array of children nodes or strings.
 */
export const createElement = (tagName, attrs = {}, children = []) => {
  return {
    tagName,
    attrs,
    children,
  };
};

/**
 * Renders an HTML element.
 * @param {string} tagName - The tag name of the element, such as "a", "div", or "button".
 * @param {Object} attrs - Object containing attributes (props) for the element.
 * @param {Array<string|HTMLElement>} children - Array of children nodes or strings.
 * @returns {HTMLElement} - The created element.
 */
const renderElem = ({ tagName, attrs, children }) => {
  // Creating an element
  const $el = document.createElement(tagName);

  // set attributes
  for (const [k, v] of Object.entries(attrs)) {
    // Addint events here
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

/**
 * Renders a node.
 * @param {Node|string} vNode - The node to render.
 * @returns {HTMLElement|Text} - The rendered element or text node.
 */
export const render = (vNode) => {
  // Easy case for default string
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  return renderElem(vNode);
};

/**
 * Zips two arrays, akin to Python's zip function, for efficient length comparison.
 * @param {Array} xs - The first array to zip.
 * @param {Array} ys - The second array to zip.
 * @returns {Array} - The zipped representation of the arrays.
 */
const zip = (xs, ys) => {
  const zipped = [];
  for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
};

/**
 * Compares the difference between attributes of old and new nodes.
 * @param {Object} oldAttrs - The attributes of the old node.
 * @param {Object} newAttrs - The attributes of the new node.
 * @returns {Function} - A function to apply the patches to a given node.
 * @example
 * // Example of applying attribute patches
 * const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
 */
const diffAttrs = (oldAttrs, newAttrs) => {
  const patches = []; // storing patches

  // set new attributes
  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node) => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  // remove old attributes
  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push(($node) => {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }

  return ($node) => {
    for (const patch of patches) {
      patch($node);
    }
  };
};

/**
 * Compares the difference between the children of old and new nodes.
 * @param {Array<Node|string>} oldVChildren - The children of the old node.
 * @param {Array<Node|string>} newVChildren - The children of the new node.
 * @returns {Function} - A function to apply the patches to the parent node.
 * @example
 * // Example of applying child patches
 * const patchChildren = diffChildren(vOldNode.children, vNewNode.children);
 */
const diffChildren = (oldVChildren, newVChildren) => {
  const childPatches = [];
  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });

  const additionalPatches = [];
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node) => {
      $node.appendChild(render(additionalVChild));
      return $node;
    });
  }

  return ($parent) => {
    for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
      patch(child);
    }

    for (const patch of additionalPatches) {
      patch($parent);
    }

    return $parent;
  };
};

/**
 * Compares the difference between children of old and new nodes.
 * @param {Node} vOldNode - The old node.
 * @param {Node} vNewNode - The new node.
 * @returns {Function} - A function to apply the patch.
 * @example
 * // Example of applying a patch
 * const patch = diff(vApp, vNewApp);
 */
export const diff = (vOldNode, vNewNode) => {
  // Complete removal if new node does not exist
  if (vNewNode === undefined) {
    return ($node) => {
      $node.remove();
      return undefined;
    };
  }

  // String type, easy replacement
  if (typeof vOldNode === "string" || typeof vNewNode === "string") {
    if (vOldNode !== vNewNode) {
      return ($node) => {
        const $newNode = render(vNewNode);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      return ($node) => undefined;
    }
  }

  // Tags have changed, complete replacement
  if (vOldNode.tagName !== vNewNode.tagName) {
    return ($node) => {
      const $newNode = render(vNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  // Check if IDs are different
  if (vOldNode.attrs.id !== vNewNode.attrs.id) {
    return ($node) => {
      const $newNode = render(vNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  // Checkbox bug workaround
  if (
    vOldNode.attrs["type"] === "checkbox" ||
    vNewNode.attrs["type"] === "checkbox"
  ) {
    return ($node) => {
      const $newNode = render(vNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }


  // Patches with attributes and children
  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
  const patchChildren = diffChildren(vOldNode.children, vNewNode.children);

  // Function to apply changes
  return ($node) => {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };
};


  // if (
  //   (vOldNode.attrs["class"] === "view") ||
  //   (vNewNode.attrs["class"] === "view")
  // ) {
  //   return ($node) => {
  //     const $newNode = render(vNewNode);
  //     $node.replaceWith($newNode);
  //     return $newNode;
  //   };
  // }
