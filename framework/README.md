# Documentation

This framework utilizes a Virtual DOM, custom Route and State managers. Events are managed by in the virtual DOM. Framework is not opinionated on how you re-render your application, improvement from client-side can be achieved by modularzing the application based on the parts that need to be re-rendered and which do not.

Creating a new element. Set the properties in the list, and optionally add the child elements. The child elements can be other elements or a text.

```javascript
const label = createElement("label",{ class: "toggle-all-label", for: "toggle-all" }, "Mark as completed");
```

Creating a new event. Attach the event in the props.:

```javascript
const input2 = createElement("input",{id: "toggle-all", type: "checkbox", class: "toggle-all", onClick: () => {toggleAllTodos()}},[]);
```

Nesting elements. Virtual DOM will recursively take care of creating any child elements.

```javascript
const inputDiv = createElement("div", { class: "input-container" }, [input, inputLabel]);
```
