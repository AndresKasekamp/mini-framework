/**
 * Creates a new DOM element.
 *
 * @param {string} tag The HTML tag name of the element (e.g., "div", "button", "input").
 * @param {Object.<string, any>} [props] Optional object containing attributes, props, and events for the element.
 * @param {Array<Element|string>} [children] Optional array containing child elements or content strings.
 * @returns {Element} The newly created DOM element.
 *
 * @example
 * const header = createElement("header", { class: "header" }, [h1, input]);
 */
export function createElement(tag, props, children) {
  // Return the virtual node
  return {
    tag,
    props,
    children,
  };
}

/**
 * Mounts a Virtual DOM element, manipulating the actual DOM.
 * @param {Element} vnode - The Virtual DOM element to be mounted.
 * @param {HTMLElement} container - The parent container element where the Virtual DOM will be mounted.
 * @example
 * // Mount a Virtual DOM element 'n2' to its parent container element
 * mount(n2, el.parentNode);
 */
export function mount(vnode, container) {
  // Create the element
  const el = document.createElement(vnode.tag);

  // Set properties & event listeners
  for (const key in vnode.props) {
    if (key.startsWith("on")) {
      el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
    } else {
      if (key === "checked") {
        if (vnode.props[key] === true) {
          el.setAttribute(key, vnode.props[key]);
        } else {
          continue;
        }
      }
      el.setAttribute(key, vnode.props[key]);
    }
  }

  // Handle children
  if (typeof vnode.children === "string") {
    el.textContent = vnode.children;
  } else {
    vnode.children.forEach((child) => {
      mount(child, el);
    });
  }

  vnode.el = el;

  // Mount to the DOM
  container.appendChild(el);
}

/**
 * Removes a DOM node from the document tree, effectively unmounting it.
 *
 * This function directly manipulates the DOM and should be used with caution. 
 * Consider using framework-specific methods for component unmounting whenever possible.
 *
 * @param {Node} node The DOM node to be removed.
 *
 * @example
 * unmount(n1);
 */
export function unmount(vnode) {
  vnode.el.parentNode.removeChild(vnode.el);
}

/**
 * Compares two virtual DOM nodes and efficiently updates the DOM to reflect the changes.
 *
 * This function handles cases where:
 * - Nodes have different tags, requiring replacement.
 * - Nodes have the same tag but different props, requiring full replacement.
 * - Nodes have the same tag and props:
   - If new node has string children, update the existing element's text content.
   - If both nodes have array children:
     - Patch children that are present in both nodes using recursion.
     - Remove extra children from the old node.
     - Append new children from the new node.
 *
 * **Important:** This function directly manipulates the DOM and should be used with caution.
 * Consider using framework-specific methods for efficiently updating views whenever possible.
 *
 * @param {Node} firstNode The first virtual DOM node (old node).
 * @param {Node} secondNode The second virtual DOM node (new node).
 *
 * @example
 * diff(c1[i], c2[i]);
 */
export function diff(firstNode, secondNode) {
  const el = (secondNode.el = firstNode.el);

  // Case where the nodes are of different tags
  if (firstNode.tag !== secondNode.tag) {
    mount(secondNode, el.parentNode);
    unmount(firstNode);
  }

  // Workaround if props have changed
  if (firstNode.props !== secondNode.props) {
    mount(secondNode, el.parentNode);
    unmount(firstNode);
  }

  // Case where the nodes are of the same tag
  else {
    // New virtual node has string children
    if (typeof secondNode.children === "string") {
      el.textContent = secondNode.children;
    }

    // New virtual node has array children
    else {
      // Old virtual node has string children
      if (typeof firstNode.children === "string") {
        el.textContent = "";
        secondNode.children.forEach((child) => mount(child, el));
      }

      // Case where the new vnode has string children
      else {
        const c1 = firstNode.children;
        const c2 = secondNode.children;
        const commonLength = Math.min(c1.length, c2.length);

        // Patch the children both nodes have in common
        for (let i = 0; i < commonLength; i++) {
          diff(c1[i], c2[i]);
        }

        // Old children was longer
        // Remove the children that are not "there" anymore
        if (c1.length > c2.length) {
          c1.slice(c2.length).forEach((child) => {
            unmount(child);
          });
        }

        // Old children was shorter
        // Add the newly added children
        else if (c2.length > c1.length) {
          c2.slice(c1.length).forEach((child) => {
            mount(child, el);
          });
        }
      }
    }
  }
}
