// Creating a virtual DOM node
export function createNode(type, props, ...children) {
    return { type, props: props || {}, children: children || [] };
}

// Functions related to properties
function setProp($target, name, value) {
    if (name === 'className') {
        $target.setAttribute('class', value);
    } else if (name == 'checked') {
        if (value == true) {
            $target.setAttribute('checked', '');
        } else {
            $target.removeAttribute('checked');
        }
    } else {
        $target.setAttribute(name, value);
    }
}

function removeProp($target, name, value) {
    if (name === 'className') {
        $target.removeAttribute('class');
    } else {
        $target.removeAttribute(name);
    }
}

function setProps($target, props) {
    Object.keys(props).forEach(name => {
        setProp($target, name, props[name]);
    });
}

function updateProp($target, name, newVal, oldVal) {
    if (!newVal) {
        removeProp($target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
        setProp($target, name, newVal);
    }
}

function updateProps($target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach(name => {
        updateProp($target, name, newProps[name], oldProps[name]);
    });
}

// Creating a real DOM element
export function createElement(node) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);
    setProps($el, node.props);
    node.children
        .map(createElement)
        .forEach($el.appendChild.bind($el));
    return $el;
}

// Checking if node has changed
function changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
        typeof node1 === 'string' && node1 !== node2 ||
        node1.type !== node2.type
}


let indexesToDelete = [] // Make it possible to delete several child nodes of one parent

// Rendering virtual DOM to real DOM
export function render($parent, newNode, oldNode, index = 0) {
    // If we have new node, but no old one, create a new node
    if (!oldNode) {
        $parent.appendChild(
            createElement(newNode)
        );
    // if we have no new node, then remember that this child needs to be deleted later
    } else if (!newNode) {
        indexesToDelete.push(index)
    // if node type has changed, replace it
    } else if (changed(newNode, oldNode)) {
        $parent.replaceChild(
            createElement(newNode),
            $parent.childNodes[index]
        );
    // if it is a checkbox, replace it, otherwise we will have problems
    } else if (newNode.type && newNode.props['type'] == 'checkbox') {
        $parent.replaceChild(
            createElement(newNode),
            $parent.childNodes[index]
        );
    } else if (newNode.type) {
        // If the new node and old node are of same type, update only the props
        updateProps(
            $parent.childNodes[index],
            newNode.props,
            oldNode.props
        );
        
        // Call the render function for all the child nodes
        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        for (let i = 0; i < newLength || i < oldLength; i++) {
            render(
                $parent.childNodes[index],
                newNode.children[i],
                oldNode.children[i],
                i
            );
        }
        
        // Deleting all the child nodes of the parent we checked in the above loop
        if (indexesToDelete.length != 0) {
            indexesToDelete.reverse().forEach(i => {
                $parent.childNodes[index].removeChild($parent.childNodes[index].childNodes[i]);
                indexesToDelete = []
            })
        }
    } 
}
