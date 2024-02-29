import { h, mount, patch } from "./framework_2/vdom-vue.js";

import { State } from "./framework_2/StateManager.js";


const app = document.getElementById("app");

// Initialize State manager
const model = new State([]);

let mainApp = initView(model);

// Function to add a new todo
function addTodo(e) {
  if (e.key === "Enter") {
    console.log(e.target.value);
    const newTodo = {
      id: Math.random(),
      text: e.target.value.trim(),
      completed: false,
    };
    e.target.value = "";

    // Adding value to model
    const currentState = model.state;
    const newTodos = [...currentState, newTodo];
    model.setState(newTodos);

  }
}

function removeTodo() {
    console.log("I clicked on removal")
    // Full removal try
    const newTodos = [];
    model.setState(newTodos);
}

model.setOnStateChange((newState) => {
    console.log("Somethin happened with the state", newState)
    const newVDOM = initView(model); // Generate new virtual DOM based on updated state
    patch(mainApp, newVDOM); // Patch the new virtual DOM onto the existing one
    mainApp = newVDOM; // Update mainApp reference to the new virtual DOM

});



function todoListItem(todoTxt) {
  const destroyButton = h("label", { class: "destroy", onClick: () => {removeTodo()} }, []);
  const todoLabel = h("label", {}, todoTxt);
  const input3 = h("input", { class: "toggle", type: "checkbox" }, []);
  const div = h("div", { class: "view" }, [input3, todoLabel, destroyButton]);
  const li = h("li", { "data-id": 1, id: 1 }, [div]);

  return li;
}



// Initializing starting view
function initView(model) {

  const todoItems = model.state.map(todo => todoListItem(todo.text))

  console.log("Tod items", todoItems)

  // Footer block
  const span2 = h("span", { id: "completed-count" }, "0");
  const button = h(
    "button",
    { class: "clear-completed", style: "display:none" },
    [span2]
  );

  const completedList = h("a", { href: "#/" }, "Completed");
  const activeList = h("a", { href: "#/active" }, "Active");
  const allList = h("a", { href: "#/completed" }, "All");

  const ul2 = h("ul", { class: "filters" }, [
    completedList,
    activeList,
    allList,
  ]);
  const strong = h("strong", {}, "0 items left"); // TODO see on muutuja mudelist probs
  const span = h("span", { class: "todo-count", id: "todo-count" }, [strong]);
  const footer = h(
    "footer",
    { class: "footer", id: "footer", style: "display:none" },
    [span, ul2, button]
  );

  // Main block
  const ul = h("ul", { class: "todo-list", id: "todo-list" }, todoItems);
  const label = h("label", { for: "toggle-all" }, "Mark all as complete");
  const input2 = h(
    "input",
    { id: "toggle-all", type: "checkbox", class: "toggle-all" },
    []
  );
  const main = h(
    "main",
    { id: "main", class: "main", style: "display:block" },
    [input2, label, ul]
  );

  // Header block
  const input = h(
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
  const h1 = h("h1", {}, "todos");
  const header = h("header", { class: "header" }, [h1, input]);

  const mainApp = h("section", { class: "todoapp" }, [header, main, footer]);

  return mainApp;
}




mount(mainApp, app);



    // const oldTodoList = h("ul", { class: "todo-list" }, []);
    // //const foobar = document.getElementById("todo-list")

    // const todoItems = newState.map(todo => todoListItem(todo.text)); // Generate todo list items based on state
    // // console.log(todoItems)

    // // //const newTodoList = h("ul", { class: "todo-list" }, todoItems); // Create new todo list with updated items
    // // const newTodoList = h("ul", { class: "todo-list" }, "weird text"); // Create new todo list with updated items
    // let newVDOM = initView(newState)
    // patch(mainApp, newVDOM); // Patch the new todo list onto the DOM
    // mainApp = newVDOM