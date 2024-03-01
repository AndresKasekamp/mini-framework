import { h, mount, patch } from "./framework_2/vdom-vue.js";

import { State } from "./framework_2/StateManager.js";

import { Router } from "./framework_2/RouteManagement.js";








// TODO active, completed nupud css-is ja siis onclick vms ja ruuteri klass kommunikeerida

const app = document.getElementById("app");

// Initialize State manager
const model = new State({
  todos: [],
  filter: 'all',
});

const routes = { // routes and callback functions key-value pairs
  "#/": () => {
    console.log(model);
  },
  "#/active": () => {
    console.log("active page");
  },
  "#/completed": () => {
    console.log("completed page");
  },
  "*": () => {
    console.log("foo");
  },
};

const router = new Router(routes);


let mainApp = render(model);


function areAllValuesEqual(array, key) {
  if (array.length === 0) {
    return true; // If array is empty, return true
  }

  const firstValue = array[0][key]; // Get the value of the key from the first object

  // Check if the value of the key in each object is equal to the first value
  return array.every((obj) => obj[key] === firstValue);
}

// Function to add a new todo
const addTodo = (e) => {
  if (e.key === "Enter") {
    const { todos, filter } = model.state;

    const newTodo = {
      id: Math.random(),
      text: e.target.value.trim(),
      completed: false,
      edit: false,
    };
    e.target.value = "";

    // Adding value to model
    // const currentState = model.state.todos;
    // const currentFilter = model.state.filter
    // const newTodos = {todos: [...currentState, newTodo], filter: currentFilter};
    // model.setState(newTodos);
    model.setState({ ...model.state, todos: [...todos, newTodo] })
  } else if (e.key === "Escape") {
    e.target.value = "";
  }
}

function removeTodo(id) {
  // Filtering todos
  const todoRemoved = model.state.todos.filter((item) => {
    return item.id !== id;
  });
  const currentFilter = model.state.filter
  const newTodos = {todos: todoRemoved, filter: currentFilter};
  model.setState(newTodos);
}

function toggleTodo(id) {
  const newTodos = model.state.todos.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        completed: !item.completed,
      };
    }
    return item;
  });
  model.setState(newTodos);
}

const clearCompleted = () => {
  const newTodos = model.state.todos.filter((item) => !item.completed);
  model.setState(newTodos);
};

// Functions will modify the state of all todos
function toggleAllTodos() {
  if (areAllValuesEqual(model.state.todos, "completed")) {
    const newTodos = model.state.todos.map((item) => {
      return {
        ...item,
        completed: !item.completed,
      };
    });
    model.setState(newTodos);
  } else {
    const newTodos = model.state.todos.map((item) => {
      return {
        ...item,
        completed: true,
      };
    });
    model.setState(newTodos);
  }
}

function editTodos(todo) {
  const newTodos = model.state.todos.map((item) => {
    if (item.id === todo.id) {
      return {
        ...item,
        edit: !item.edit,
      };
    }
    return item;
  });
  model.setState(newTodos);
}

function updateTodo(e, todo) {
  if (e.key === "Enter") {
    let newTodos = model.state.todos.map((item) => {
      if (item.id === todo.id) {
        return {
          ...item,
          text: e.target.value.trim(),
          edit: !item.edit,
        };
      }
      return item;
    });

    // Filtering is use set the value empty string
    newTodos = newTodos.filter((item) => {
      if (item.id === todo.id && item.text === "") {
        return false
      }
      return true
    })

    model.setState(newTodos);
  } else if (e.key === "Escape") {
    const newTodos = model.state.todos.map((item) => {
      if (item.id === todo.id) {
        return {
          ...item,
          text: todo.text,
          edit: !item.edit,
        };
      }
      return item;
    });

    model.setState(newTodos);
  }
}


model.setOnStateChange(() => {
  const newVDOM = render(model); // Generate new virtual DOM based on updated state
  patch(mainApp, newVDOM); // Patch the new virtual DOM onto the existing one
  mainApp = newVDOM; // Update mainApp reference to the new virtual DOM
});

function todoListItem(todo) {
  let displayState;
  let editInput = null;
  if (todo.edit) {
    displayState = "editing";
    // Creating edit input
    editInput = h(
      "input",
      {
        value: todo.text,
        class: "edit",
        id: todo.id,
        autofocus: true,
        onkeydown: (e) => {
          updateTodo(e, todo);
        },
        placeholder: todo.text,
      },
      []
    );
  } else {
    displayState = todo.completed ? "completed" : "";
  }

  const destroyButton = h(
    "button",
    {
      class: "destroy",
      onClick: () => {
        removeTodo(todo.id);
      },
    },
    []
  );
  const todoLabel = h(
    "label",
    {
      ondblclick: () => {
        editTodos(todo);
      },
    },
    todo.text
  );
  const input3 = h(
    "input",
    {
      class: "toggle",
      type: "checkbox",
      checked: todo.completed,
      onClick: () => {
        toggleTodo(todo.id);
      },
    },
    []
  );
  const div = h("div", { class: "view" }, [input3, todoLabel, destroyButton]);

  let li;
  if (editInput !== null) {
    li = h("li", { "data-id": todo.id, id: todo.id, class: displayState }, [
      div,
      editInput,
    ]);
  } else {
    li = h("li", { "data-id": todo.id, id: todo.id, class: displayState }, [
      div,
    ]);
  }

  return li;
}

// Initializing starting view
function render(model) {

  // Check if route has changed
  router.handleRouteChange()

  console.log("Model state", model.state)
  const todoItems = model.state.todos.map((todo) => todoListItem(todo));

  const displayState =
  model.state.todos.length > 0 ? "display:block" : "display:none";

  const itemsLeft = model.state.todos.filter((obj) => obj.completed === false);
  const itemsComplete = model.state.todos.filter((obj) => obj.completed === true);

  // Footer block
  const span2 = h(
    "span",
    { id: "completed-count" },
    itemsComplete.length == 0 ? "" : `Clear completed [${itemsComplete.length}]`
  );
  const button = h(
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

  const completedList = h(
    "a",
    { href: "#/completed", id: "completed" },
    "Completed"
  );
  const activeList = h("a", { href: "#/active", id: "active", onClick: () => {router._navigateTo("#/active")} }, "Active");
  const allList = h("a", { href: "#/", id: "all", class: "selected" }, "All");

  const liComplete = h("li", {}, [completedList]);
  const liActive = h("li", {}, [activeList]);
  const liAll = h("li", {}, [allList]);

  const ul2 = h("ul", { class: "filters" }, [liAll, liActive, liComplete]);
  const strong = h(
    "strong",
    {},
    `${itemsLeft.length} item${itemsLeft.length !== 1 ? "s" : ""} left`
  );
  const span = h("span", { class: "todo-count", id: "count" }, [strong]);
  const footer = h(
    "footer",
    { class: "footer", id: "footer", style: displayState },
    [span, ul2, button]
  );

  // Main block
  const ul = h("ul", { class: "todo-list", id: "todo-list" }, todoItems);
  const label = h("label", { for: "toggle-all" }, "Mark all as complete");
  const input2 = h(
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
  const main = h("main", { id: "main", class: "main", style: displayState }, [
    input2,
    label,
    ul,
  ]);

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
