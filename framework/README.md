# Documentation

This framework leverages a Virtual DOM alongside custom Route and State managers to streamline application development. Event handling is seamlessly integrated within the Virtual DOM. The framework maintains flexibility, allowing developers to choose how to re-render their applications. Enhancements on the client-side are facilitated by modularizing the application, pinpointing areas requiring re-rendering and those that do not.

Creating a new element. Set the properties in the list, and optionally add the child elements. The child elements can be other elements or a text.

```javascript
const label = createElement("label",{ class: "toggle-all-label", for: "toggle-all" }, ["Mark as completed"]);
```

Creating a new event. Attach the event in the props.:

```javascript
const input2 = createElement("input",{id: "toggle-all", type: "checkbox", class: "toggle-all", onClick: () => {toggleAllTodos()}},[]);
```

Nesting elements. Virtual DOM will recursively take care of creating any child elements.

```javascript
const inputDiv = createElement("div", { class: "input-container" }, [input, inputLabel]);
```
