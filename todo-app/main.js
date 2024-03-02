import { createElement, mount, diff } from "../framework/VirtualDom.js";
import { model } from "./state.js";
import {
  addTodo,
  clearCompleted,
  toggleAllTodos,
  filterTodos,
} from "./actions.js";
import { todoListItem } from "./components.js";

import { Router } from "../framework/RouteManagement.js";

// Main div from HTML, starting point
const app = document.getElementById("app");

const routes = [
  { path: "#/", callback: () => filterTodos("all") },
  { path: "#/active", callback: () => filterTodos("active") },
  { path: "#/completed", callback: () => filterTodos("completed") },
];

// Route manager init
const router = new Router(routes, "#/");

let mainApp = render(model);

// Updating logic for the app
model.updateState(() => {
  const newVDOM = render(model);
  diff(mainApp, newVDOM);
  mainApp = newVDOM;
  document.getElementById("new-todo").focus();
});

// Main rendering logic
function render(dependency) {
  const { todos, filter } = dependency.state;

  let todoItems;

  // Applying filters based on the page
  const filters = {
    all: todos,
    active: todos.filter(({ completed }) => !completed),
    completed: todos.filter(({ completed }) => completed),
  };

  todoItems = filters[filter].map((todo) => todoListItem(todo));

  const displayState = todos.length > 0 ? "display:block" : "display:none";

  const itemsLeft = todos.filter((obj) => obj.completed === false);
  const itemsComplete = todos.filter((obj) => obj.completed === true);

  // Footer block
  const span2 = createElement(
    "span",
    { id: "completed-count" },
    itemsComplete.length == 0 ? "" : `Clear completed [${itemsComplete.length}]`
  );
  const button = createElement(
    "button",
    {
      class: "clear-completed",
      style: displayState,
      onClick: () => {
        clearCompleted();
      },
    },
    [span2]
  );

  const completedList = createElement(
    "a",
    {
      href: "#/completed",
      id: "completed",
      class: filter === "completed" ? "selected" : "",
    },
    "Completed"
  );
  const activeList = createElement(
    "a",
    {
      href: "#/active",
      id: "active",
      class: filter === "active" ? "selected" : "",
    },
    "Active"
  );
  const allList = createElement(
    "a",
    {
      href: "#/",
      id: "all",
      class: filter === "all" ? "selected" : "",
    },
    "All"
  );

  const liComplete = createElement("li", {}, [completedList]);
  const liActive = createElement("li", {}, [activeList]);
  const liAll = createElement("li", {}, [allList]);

  const ul2 = createElement("ul", { class: "filters" }, [
    liAll,
    liActive,
    liComplete,
  ]);
  const strong = createElement(
    "strong",
    {},
    `${itemsLeft.length} item${itemsLeft.length !== 1 ? "s" : ""} left`
  );
  const span = createElement("span", { class: "todo-count", id: "count" }, [
    strong,
  ]);
  const footer = createElement(
    "footer",
    { class: "footer", id: "footer", style: displayState },
    [span, ul2, button]
  );

  // Main block
  const ul = createElement(
    "ul",
    { class: "todo-list", id: "todo-list" },
    todoItems
  );

  const main = createElement(
    "main",
    { id: "main", class: "main", style: displayState },
    [ul]
  );

  // Header block

  const label = createElement(
    "label",
    { class: "toggle-all-label", for: "toggle-all" },
    "Mark as completed"
  );
  const input2 = createElement(
    "input",
    {
      id: "toggle-all",
      type: "checkbox",
      class: "toggle-all",
      onClick: () => {
        toggleAllTodos();
      },
    },
    []
  );
  const toggleDiv = createElement("div", { class: "toggle-all-container" }, [
    input2,
    label,
  ]);

  const inputLabel = createElement(
    "label",
    { class: "visually-hidden" },
    "New Todo Input"
  );

  const input = createElement(
    "input",
    {
      id: "new-todo",
      class: "new-todo",
      placeholder: "What needs to be done",
      onkeydown: (e) => {
        addTodo(e);
      },
      autofocus: true,
    },
    []
  );
  const inputDiv = createElement("div", { class: "input-container" }, [
    input,
    inputLabel,
  ]);
  const h1 = createElement("h1", {}, "todos");
  const header = createElement(
    "header",
    { class: "header" },
    todos.length > 0 ? [h1, inputDiv, toggleDiv] : [h1, inputDiv]
  );

  const mainApp = createElement("section", { class: "todoapp" }, [
    header,
    main,
    footer,
  ]);

  return mainApp;
}

// Starting mounting point
mount(mainApp, app);
