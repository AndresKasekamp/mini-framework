/**
 * Fastest way to remove element, DOM mutation
 * @param  {Element} node empyting the contents of the following DOM node
 * @example
 * const node = document.getElementById('app'); // selecting the node
 * clearNode(node);
 */
function clearNode(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
}

/**
 * Mount ROOT DOM element
 * @param {Object} model store of the application's state, e.g todo state
 * @param {Function} patch how the application state is updated/patched ("controller")
 * @param {Function} view rendering with the model
 * @param {HTMLElement} rootDiv root DOM element in which the app is mounted, e.g app
 * @param {Function} subscriptions any event listeners the application needs
 */
export function mount(model, patch, view, rootDiv, subscriptions) {
  const localStorageStore = "todo-app-mvc"; // 

  /**
   * Renders the view based on the provided model and signal.
   * @param {Object} mod - The current model/state of the application.
   * @param {Function} sig - The signal function used for handling actions.
   * @param {HTMLElement} root - The root DOM element where the view will be rendered.
   */
  function render(mod, sig, root) {
    localStorage.setItem(localStorageStore, JSON.stringify(mod)); // saving the state of the model to local storage
    clearNode(root); // clear root element (container) before (re)rendering
    // Rendering new view based on model and signal given
    const newView = view(mod, sig)
    root.appendChild(newView); 
  }

  /**
   * Handles actions by updating the model and triggering a re-render.
   * @param {String} action - The action to be performed, for example EDIT, TOGGLE, DELETE
   * @param {*} data - Additional data needed for the action.
   * @param {Object} model - The current model/state of the application.
   * @returns {Function} - A callback function that updates the model and triggers a re-render.
   */
  function signal(action, data, model) {
    // signal function takes action
    return () => {
      // and returns callback
      model = JSON.parse(localStorage.getItem(localStorageStore)); //|| model;
      const updatedModel = patch(action, model, data); // update model for action
      render(updatedModel, signal, rootDiv);
    };
  }

  model = JSON.parse(localStorage.getItem(localStorageStore)) || model;
  render(model, signal, rootDiv);
  // Subscriptions handling
  if (subscriptions && typeof subscriptions === "function") {
    subscriptions(signal);
  }
}

/**
 * addProps applies the desired attribute(s) to the specified DOM node, mutates DOM noode
 * @param {Array.<String>/<Function>} props list of attributes to be applied (borh string and function are accepted)
 * @param {Object} node DOM node upon which attribute(s) should be applied
 * @example
 * input = addProps(["type=checkbox", "id=todo1", "checked=true"], input);
 */
function addProps(props, node) {
  if (props && Array.isArray(props) && props.length > 0) {

    props.forEach( (attr) => {
      // onclick and action handler
      if (typeof attr === "function") {
        node.onclick = attr;
        return node;
      }
      // apply any attributes that are *not* functions (i.e. Strings):
      const a = attr.split("=");
      switch (a[0]) {
        case "autofocus":
          node.autofocus = "autofocus";
          node.focus();
          setTimeout(function () {
            // wait till DOM has rendered then focus()
            node.focus();
          }, 200);
          break;
        case "checked":
          node.setAttribute("checked", true);
        case "class":
          node.className = a[1]; // apply one or more CSS classes
          break;
        case "data-id":
          node.setAttribute("data-id", a[1]); // add data-id e.g: to <li>
          break;
        case "for":
          node.setAttribute("for", a[1]); // e.g: <label for="toggle-all">
          break;
        case "href":
          node.href = a[1]; // e.g: <a href="#/active">Active</a>
          break;
        case "id":
          node.id = a[1]; // apply element id e.g: <input id="toggle-all">
          break;
        case "placeholder":
          node.placeholder = a[1]; // add placeholder to <input> element
          break;
        case "style":
          node.setAttribute("style", a[1]); // <div style="display: block;">
          break;
        case "type":
          node.setAttribute("type", a[1]); // <input id="go" type="checkbox">
          break;
        case "value":
          node.value = a[1];
        default:
          break;
      }
    });
  }
  return node;
}

/**
 * Adding children to parent
 * @param  {Array.<Object>} childnodes array of child DOM nodes.
 * @param  {Object} parent the "parent" DOM node where children will be added.
 * @return {Object} returns parent DOM node with appended children
 * @example
 * // returns the parent node with the "children" appended
 * const parent = elmish.addChildNodes([div, p, section], parent);
 */
function addChildNodes(childnodes, parent) {
  if (Array.isArray(childnodes) && childnodes.length > 0) {
    childnodes.forEach((el) => parent.appendChild(el));
  }
  return parent;
}

/**
 * createElement for creating new elements
 * @param {String} type of element to be created e.g: 'div', 'section'
 * @param {Array.<String>} proplist list of attributes to be applied to the node
 * @param {Array.<Object>} childnodes array of child DOM nodes.
 * @return {Object} returns the <section> DOM node with appended children
 */
export function createElement(type, proplist, childnodes) {
  return addChildNodes(
    childnodes,
    addProps(proplist, document.createElement(type))
  );
}




