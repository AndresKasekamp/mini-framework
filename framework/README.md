# TODO dokumentatsion pikemalt

Creating a new element. Set the properties in the list, and optionally add the child elements.
```javascript
const div = createElement('div', ["class=todoapp"], [h1, input]);
```

Creating a new event. Signal based system. Signal is attached to the subscription. For example, toggling an item:
```javascript
typeof signal === "function" ? signal("TOGGLE", item.id)
```

Nest elements. Explained in creating a new element, framework will recursively create each element:
```javascript
const div = createElement('div', ["class=todoapp"], [h1, input]);
```