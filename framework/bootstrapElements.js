 import { createElement } from "./framework";
 
 /**
   * section creates a <section> HTML element with attributes and childnodes
   * @param {Array.<String>} attrlist list of attributes to be applied to the node
   * @param {Array.<Object>} childnodes array of child DOM nodes.
   * @return {Object} returns the <section> DOM node with appended children
   * @example
   * // returns <section> DOM element with attributes applied & children appended
   * var section = elmish.section(["class=todoapp"], [h1, input]);
   */
  export function section(attrlist, childnodes) {
    return createElement("section", attrlist, childnodes);
  }
  // these are a *bit* repetitive, if you know a better way, please open an issue!
  export function a(attrlist, childnodes) {
    return createElement("a", attrlist, childnodes);
  }
  
  export function button(attrlist, childnodes) {
    return createElement("button", attrlist, childnodes);
  }
  
  export function div(attrlist, childnodes) {
    return createElement("div", attrlist, childnodes);
  }
  
  export function footer(attrlist, childnodes) {
    return createElement("footer", attrlist, childnodes);
  }
  
  export function header(attrlist, childnodes) {
    return createElement("header", attrlist, childnodes);
  }
  
  export function h1(attrlist, childnodes) {
    return createElement("h1", attrlist, childnodes);
  }
  
  export function input(attrlist, childnodes) {
    return createElement("input", attrlist, childnodes);
  }
  
  export function label(attrlist, childnodes) {
    return createElement("label", attrlist, childnodes);
  }
  
  export function li(attrlist, childnodes) {
    return createElement("li", attrlist, childnodes);
  }
  
  export function span(attrlist, childnodes) {
    return createElement("span", attrlist, childnodes);
  }
  
  export function strong(text_str) {
    var el = document.createElement("strong");
    el.innerHTML = text_str;
    return el;
  }
  
  export function text(text) {
    return document.createTextNode(text);
  }
  
  export function ul(attrlist, childnodes) {
    return createElement("ul", attrlist, childnodes);
  }