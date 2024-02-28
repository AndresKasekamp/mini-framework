import {
  a,
  button,
  div,
  footer,
  input,
  h1,
  header,
  label,
  li,
  section,
  span,
  strong,
  text,
  ul,
} from "../framework/bootstrapElements.js";

export const initModel = {
  todos: [],
  hash: "#/",
};

// TODO see on mvc implemnetation update funktsionaalsuse kasutamisest
/**
 * Updating model based on action
 * @param {String} action - the desired action to perform on the model.
 * @param {String} data - the data we want to "apply" to the item.
 * @param {Object} model - the App's (current) model (or "state").
 * @return {Object} new_model - the transformed model.
 */
export function update(action, model, data) {
  const useModel = JSON.parse(JSON.stringify(model)); // "clone" the model

  // Actopm for the model
  switch (action) {
    case "ADD":
      const last =
        typeof model.todos !== "undefined" && model.todos.length > 0
          ? model.todos[model.todos.length - 1]
          : null;
      var id = last ? last.id + 1 : 1;
      const input = document.getElementById("new-todo");
      useModel.todos =
        useModel.todos && useModel.todos.length > 0 ? useModel.todos : [];
      useModel.todos.push({
        id: id,
        title: data || input.value.trim(),
        done: false,
      });
      break;

    case "TOGGLE":
      useModel.todos.forEach((item) => {
        // takes 1ms on a "slow mobile"
        if (item.id === data) {
          item.done = !item.done;
        }
      });
      // if all todos are done=true then "check" the "toggle-all" checkbox:
      const allDone = useModel.todos.filter((item) => {
        return item.done === false; // only care about items that are NOT done
      }).length;
      useModel.allDone = allDone === 0 ? true : false;
      break;
    case "TOGGLE_ALL":
      useModel.allDone = useModel.allDone ? false : true;
      useModel.todos.forEach((item) => {
        item.done = useModel.allDone;
      });
      break;
    case "DELETE":
      useModel.todos = useModel.todos.filter((item) => {
        return item.id !== data;
      });
      break;
    case "EDIT":
      // this code is inspired by: https://stackoverflow.com/a/16033129/1148249
      // simplified as we are not altering the DOM!
      if (
        useModel.clicked &&
        useModel.clicked === data &&
        Date.now() - 300 < useModel.clickTime
      ) {
        // DOUBLE-CLICK < 300ms
        useModel.editing = data;
      } else {
        // first click
        useModel.clicked = data; // so we can check if same item clicked twice!
        useModel.clickTime = Date.now(); // timer to detect double-click 300ms
        useModel.editing = false; // reset
      }
      break;
    case "SAVE":
      const edit = document.getElementsByClassName("edit")[0];
      const value = edit.value;
      var id = parseInt(edit.id, 10);
      // End Editing
      useModel.clicked = false;
      useModel.editing = false;

      // Edge case for handling delete
      if (!value || value.length === 0) {
        // delete item if title is blank:
        return update("DELETE", useModel, id);
      }
      // update the value of the item.title that has been edited:
      useModel.todos = useModel.todos.map((item) => {
        if (item.id === id && value && value.length > 0) {
          item.title = value.trim();
        }
        return item; // return all todo items.
      });
      break;
    case "CANCEL":
      useModel.clicked = false;
      useModel.editing = false;
      break;
    case "CLEAR_COMPLETED":
      useModel.todos = useModel.todos.filter(function (item) {
        return !item.done; // only return items which are item.done = false
      });
      break;
    case "ROUTE":
      useModel.hash = window.location.hash; // (window && window.location && window.location.hash) ? // : '#/';
      break;
    default: // if action unrecognised or undefined,
      return model; // return model unmodified
  }
  return useModel;
}

// TODO siit saab näidetesse panna
/**
 * Creating a single todo list item
 * using the "elmish" DOM functions (`li`, `div`, `input`, `label` and `button`)
 * returns an `<li>` HTML element with a nested `<div>` which in turn has the:
 * + `<input type=checkbox>` which lets users to "Toggle" the status of the item
 * + `<label>` which displays the Todo item text (`title`) in a `<text>` node
 * + `<button class="destroy">` lets people "delete" a todo item.
 * see: https://github.com/dwyl/learn-elm-architecture-in-javascript/issues/52
 * @param  {Object} item the todo item object
 * @param {Object} model - the App's (current) model (or "state").
 * @param {Function} singal - the Elm Architicture "dispacher" which will run
 * @return {Object} <li> DOM Tree which is nested in the <ul>.
 * @example
 * // returns <li> DOM element with <div>, <input>. <label> & <button> nested
 * const DOM = render_item({id: 1, title: "Build Todo List App", done: false});
 */

// TODO renderdamine raudselt kuhugi mujale panna
function renderListItem(item, model, signal) {
  return li(
    [
      "data-id=" + item.id,
      "id=" + item.id,
      item.done ? "class=completed" : "",
      model && model.editing && model.editing === item.id
        ? "class=editing"
        : "",
    ],
    [
      div(
        ["class=view"],
        [
          input(
            [
              item.done ? "checked=true" : "",
              "class=toggle",
              "type=checkbox",
              typeof signal === "function" ? signal("TOGGLE", item.id) : "",
            ],
            []
          ), // <input> does not have any nested elements
          label(
            [typeof signal === "function" ? signal("EDIT", item.id) : ""],
            [text(item.title)]
          ),
          button([
            "class=destroy",
            typeof signal === "function" ? signal("DELETE", item.id) : "",
          ]),
        ]
      ), // </div>
    ].concat(
      model && model.editing && model.editing === item.id
        ? [
            // editing?
            input([
              "class=edit",
              "id=" + item.id,
              "value=" + item.title,
              "autofocus",
            ]),
          ]
        : []
    ) // end concat()
  ); // </li>
}

/**
 * rendering main logic, no todos are added here
 * which contains all the "main" controls and the `<ul>` with the todo items.
 * @param {Object} model - the App's (current) model (or "state").
 * @param {Function} signal - dispatching
 * @return {Object} <section> DOM Tree which containing the todo list <ul>, etc.
 */
function renderMain(model, signal) {
  const display =
    "style=display:" +
    (model.todos && model.todos.length > 0 ? "block" : "none");

  return section(
    ["class=main", "id=main", display],
    [
      // hide if no todo items.
      input(
        [
          "id=toggle-all",
          "type=checkbox",
          typeof signal === "function" ? signal("TOGGLE_ALL") : "",
          model.all_done ? "checked=checked" : "",
          "class=toggle-all",
        ],
        []
      ),
      label(["for=toggle-all"], [text("Mark all as complete")]),
      ul(
        ["class=todo-list"],
        model.todos && model.todos.length > 0
          ? model.todos
              .filter(function (item) {
                switch (model.hash) {
                  case "#/active":
                    return !item.done;
                  case "#/completed":
                    return item.done;
                  default: // if hash doesn't match Active/Completed render ALL todos:
                    return item;
                }
              })
              .map(function (item) {
                return renderListItem(item, model, signal);
              })
          : null
      ),
    ]
  );
}

/**
 * rendring the bottom of the application
 * which contains count of items to (still) to be done and a `<ul>` "menu"
 * with links to filter which todo items appear in the list view.
 * @param {Object} model - the App's (current) model (or "state").
 * @param {Function} signal - di
 * @return {Object} <section> DOM Tree which containing the <footer> element.
 * @example
 * // returns <footer> DOM element with other DOM elements nested:
 */
function renderFooter(model, signal) {
  // count how many "active" (not yet done) items by filtering done === false:
  let done =
    model.todos && model.todos.length > 0
      ? model.todos.filter(function (i) {
          return i.done;
        }).length
      : 0;
  let count =
    model.todos && model.todos.length > 0
      ? model.todos.filter(function (i) {
          return !i.done;
        }).length
      : 0;

  // Requirement #1 - No Todos, should hide #footer and #main
  let display = count > 0 || done > 0 ? "block" : "none";

  // number of completed items:
  done = model.todos && model.todos.length > 0 ? model.todos.length - count : 0;
  let displayClear = done > 0 ? "block;" : "none;";

  // pluarisation of number of items:
  let left = " item" + (count > 1 || count === 0 ? "s" : "") + " left";

  return footer(
    ["class=footer", "id=footer", "style=display:" + display],
    [
      span(["class=todo-count", "id=count"], [strong(count), text(left)]),
      ul(
        ["class=filters"],
        [
          li(
            [],
            [
              a(
                [
                  "href=#/",
                  "id=all",
                  "class=" + (model.hash === "#/" ? "selected" : ""),
                ],
                [text("All")]
              ),
            ]
          ),
          li(
            [],
            [
              a(
                [
                  "href=#/active",
                  "id=active",
                  "class=" + (model.hash === "#/active" ? "selected" : ""),
                ],
                [text("Active")]
              ),
            ]
          ),
          li(
            [],
            [
              a(
                [
                  "href=#/completed",
                  "id=completed",
                  "class=" + (model.hash === "#/completed" ? "selected" : ""),
                ],
                [text("Completed")]
              ),
            ]
          ),
        ]
      ), // </ul>
      button(
        [
          "class=clear-completed",
          "style=display:" + displayClear,
          typeof signal === "function" ? signal("CLEAR_COMPLETED") : "",
        ],
        [
          text("Clear completed ["),
          span(["id=completed-count"], [text(done)]),
          text("]"),
        ]
      ),
    ]
  );
}

/**
 * `view` renders the entire Todo List App
 * which contains count of items to (still) to be done and a `<ul>` "menu"
 * with links to filter which todo items appear in the list view.
 * @param {Object} model - the App's (current) model (or "state").
 * @param {Function} singal - the Elm Architicture "dispacher" which will run
 * @return {Object} <section> DOM Tree which containing all other DOM elements.
 * @example
 * // returns <section class="todo-app"> DOM element with other DOM els nested:
 * var DOM = view(model);
 */
export function view(model, signal) {
  return section(
    ["class=todoapp"],
    [
      // array of "child" elements
      header(
        ["class=header"],
        [
          h1([], [text("todos")]), // </h1>
          input(
            [
              "id=new-todo",
              "class=new-todo",
              "placeholder=What needs to be done?",
              "autofocus",
            ],
            []
          ), // <input> is "self-closing"
        ]
      ), // </header>
      renderMain(model, signal),
      renderFooter(model, signal),
    ]
  ); // <section>
}

/**
 * `subscriptions` let us "listen" for events such as "key press" or "click".
 * and respond according to a pre-defined update/action.
 * @param {Function} signal - dispatcher
 * both the "update" and "render" functions when invoked with singal(action)
 */
export function subscriptions(signal) {
  const ENTER_KEY = "Enter"; // add a new todo item when [Enter] key is pressed
  const ESCAPE_KEY = "Escape"; // used for "escaping" when editing a Todo item

  document.addEventListener("keyup", function handler(e) {
    switch (e.key) {
      case ENTER_KEY:
        const editing = document.getElementsByClassName("editing");
        if (editing && editing.length > 0) {
          signal("SAVE")(); // invoke singal inner callback
        }

        let newTodo = document.getElementById("new-todo");
        if (newTodo.value.length > 0) {
          signal("ADD")(); // invoke singal inner callback
          newTodo.value = ""; // reset <input> so we can add another todo
          document.getElementById("new-todo").focus();
        }
        break;
      case ESCAPE_KEY:
        signal("CANCEL")();
        break;
    }
  });

  // Subsribing to route changes
  window.onhashchange = function route() {
    signal("ROUTE")();
  };
}


