// Ta teeb valmis vdom representatiooni objektina esmalt
// mingi tavaline div propidega lihtsalt?

import { mount } from "./VirtualDom";

// KAS ATRIBUUTIDE MUUTUS TÄHEBDAB BLUR, FOCUS, STIILI MUUTUS JNE?
// Atribuutide võrdlus
const diffAttrs = (oldAttrs, newAttrs) => {
  const patches = [];

  // SET NEW ATTRIBUTES
  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node) => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  // REMOVE OLD ATTRIBUTES
  for (const [k, v] of Object.entries(oldAttrs)) {
      // Ühesõnaga vaatab kas key on uute atribuutide hulgas
    if (!(k in newAttrs)) {
        patches.push(($node) => {
            $node.removeAttribute(k);
            return $node;
          });
    }
  }

  // Returning a wrapper
  return $node => {
    for (const patch of patches) {
        patch($node)
    }
  }
};

// ZIP on pmst vist nagu püütoni implementatsioon
const zip = (xs, ys) => {
    const zipped = []
    for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]])
    }

    return zipped;
}

const diffChildren = (oldVChildren, newVChildren) => {

    const childPatches = []
    // Returnid funktsioone jälle, length on siinkohal megaoluline
    for (const [oldVChild, newVChild] of zip(oldVChildren, newVChildren)) {
        childPatches.push(diff(oldVChild, newVChild))
    }

    const additionalPatches = []
    for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
        additionalPatches.push($node => {
            $node.appendChild(render(additionalVChild))
        })
    }

    // MIS ASJAD ON ADDITIONAL PATCHES????
    return $parent => {
        for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
            patch(child)
        }

        for (const patch of additionalPatches) {
            patch($parent)
        }

        return $parent
    }
}

// TODO see funktsioon võib olla väga aeganõudev
// TODO kas see funktsioon tagastab funktsiooni või elemendi siis, mis nende vahe on?
// SEE ASI SIIN RETURNING FUNKTSIOONI MIDA SA SAAD HILJEM KASUTADA
const diff = (vOldNode, vNewNode) => {
  // KAS SEE TÄHENDAB ET UUS NODE ON EEMALDATUD STATEMANAGERIGA?
  if (vNewNode === undefined) {
    // Ma returnin ju meetodi millegi eemaldamiseks?, kust see node siin täpsemalt tuleb?
    return ($node) => {
      $node.remove();
      return undefined;
    };
  }

  // String and element comparison
  if (typeof vOldNode === "string" || typeof vNewNode === "string") {
    // Stringide on kerge sisuliselt
    if (vOldNode !== vNewNode) {
      return ($node) => {
        const $newNode = render(vNewNode);
        $node.replaceWith($newNode);
        return $newNode;
      };

      // Do nothing if they are the same
    } else {
      return ($node) => undefined;
    }
  }

  // Kui kahel tagil on erinevad tagi nimed, siis vahetab tervenisti välja
  if (vOldNode.tagname !== vNewNode.tagname) {
    // Kerge juhtum, uus loogika = täiesti uus render
    return ($node) => {
      const $newNode = render(vNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
  const patchChildren = diffChildren(vOldNode.children, vNewNode.children);

  return ($node) => {
    patchAttrs($node);
    patchChildren($node);
    return $node
  };
};

// NII ET PÕHIMÕTTELISELT ROOTEL ON NODE?

// Siin on destructuring
const createElementH = (tagname, { attrs = {}, children = [] }) => {
  return {
    tagname,
    attrs: attrs,
    children: children,
  };
};

// Example of vdom
// TODO chilren ja props on eraldi
// TODO mis on mul custom elemendid?
const createVapp = (count) =>
  createElementH("div", {
    // TODO kuidas peaks autofocus, class ja style jms elementide handlimine olema
    attrs: {
      id: "app",
      dataCount: count,
    },
    children: [
      createElementH("input"), // TODO input on ka mul
      String(count), // this is a text node
      createElementH("img", {
        attrs: { src: "some-image.png" }, // this is an element node
      }),
    ],
  });

// RENDER ON ELEMENTIDE LOOMINE JA VÕRDLEMINE PROBABLY
// VirtualNode on element
// FUNKTSIOON ON REKURSIIVNE
// TODO vaata kuidas ta teeb destructimise elementidele siin
const renderElem = ({ tagname, attrs, children }) => {
  // Creating an element
  const $el = document.createElement(tagname);

  // SET ATTRIBUTES
  // Setting the props during rendering
  // VÕivad olla classid focused vms
  for (const [k, v] of Object.entries(attrs)) {
    $el.setAttribute(k, v);
  }

  // SETTING CHILDREN
  // TODO recursion
  for (const child of children) {
    // Actual DOM element
    const $child = render(child);
    // Append child to parent created element
    $el.appendChild($child);
  }

  // Returning parent element with children and props added
  return $el;
};

// Element and text node handling
const render = (vNode) => {
  // TODO vaata kuidas siin on kaks case mida ta lahendab
  // Creating a textNode
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  // See on vähemalt Vappile alguspunkt
  return renderElem(vNode);
};

const mount = ($node, $target) => {
  // KAS SEE ON TODOLIST SIIS?
  $target.replaceWith($node);
};

// TODO kas count on state siin
let count = 0;
let vApp = createVapp(count);

// REAL DOM ELEMENT on dollariga
const $app = render(vApp);

// First mount
let $rootEl = mount($app, document.getElementsById("app"));

// TODO see ei töötaks inputi korral, kuna app tervenisti rerenderdub
// TODO aga ainult input ei tohi rerenderuda vist?
// See oleks sisuliselt state callback funktsioon vist, sest meil on callback funktsioon mida ta kutsub
setInterval(() => {
  count++;
  const vNewApp = createVapp(count);
  const patch = diff(vApp, vNewApp);
  // Patching with root element
  $rootEl = patch($rootEl); // will return new root element, mis siis juhtub kui terve root asendatakse?
  vApp = vNewApp;
}, 1000);

// TODO alguses üritada vue implementatsioonigaa tööle saada terve app, mis ma tahan, et ta oleks
