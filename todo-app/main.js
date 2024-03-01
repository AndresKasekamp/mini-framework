// TODO local storagesse luua, modulariseerida ja uue TODO lisamisel autofocus tagasi panna

import { createElement, mount, diff } from "../framework/VirtualDom.js";

import { State } from "../framework/StateManager.js";

import { Router } from "../framework/RouteManagement.js";

import { areAllValuesEqual } from "./helpers.js";

// App from main HTML file
const app = document.getElementById("app");

// Initialize State manager
const model = new State({
  todos: [],
  filter: "all",
});

const filterTodos = (path) => {
  console.log("Filter will be applied");

  let newFilter;
  switch (path) {
    case "all":
      newFilter = "all";
      break;
    case "active":
      newFilter = "active";
      break;
    case "completed":
      newFilter = "completed";
      break;
    default:
      console.error("Unknown filter:", e.target.id);
      return;
  }

  model.setState({ ...model.state, filter: newFilter });
};

// Predefined routes
const routes = {
  "#/": () => {
    filterTodos("all");
  },
  "#/active": () => {
    filterTodos("active");
  },
  "#/completed": () => {
    filterTodos("completed");
  },
  "*": () => {
    filterTodos("all");
  },
};

// Route manager
const router = new Router(routes);

let mainApp = render(model);

// Function to add a new todo
const addTodo = (e) => {
  if (e.key === "Enter") {
    const { todos } = model.state;

    const newTodo = {
      id: Math.random(),
      text: e.target.value.trim(),
      completed: false,
      edit: false,
    };
    e.target.value = "";

    model.setState({ ...model.state, todos: [...todos, newTodo] });
  } else if (e.key === "Escape") {
    e.target.value = "";
  }
};

// Removing single todo from todo arrau
const removeTodo = (id) => {
  // Filtering todos
  const { todos } = model.state;
  const todoRemoved = todos.filter((item) => item.id !== id);
  model.setState({ ...model.state, todos: todoRemoved });
};

// Toggle single todo item to mark it as completed or vice versa
const toggleTodo = (id) => {
  const { todos } = model.state;

  const newTodos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  model.setState({ ...model.state, todos: newTodos });
};

// Clearing completed todos
const clearCompleted = () => {
  const { todos } = model.state;

  const newTodos = todos.filter((item) => !item.completed);
  model.setState({ ...model.state, todos: newTodos });
};

// Toggle all todos,
const toggleAllTodos = () => {
  const { todos } = model.state;

  let newTodos;
  if (areAllValuesEqual(todos, "completed")) {
    newTodos = todos.map((item) => {
      return {
        ...item,
        completed: !item.completed,
      };
    });
    //model.setState({ ...model.state, todos: newTodos });
  } else {
    newTodos = todos.map((item) => {
      return {
        ...item,
        completed: true,
      };
    });
  }

  model.setState({ ...model.state, todos: newTodos });
};

// Enabling todo edit
const enableTodoEdit = (todo) => {
  const { todos } = model.state;

  const newTodos = todos.map((item) => {
    if (item.id === todo.id) {
      return {
        ...item,
        edit: !item.edit,
      };
    }
    return item;
  });
  model.setState({ ...model.state, todos: newTodos });
};

// Editing todo
const editTodo = (e, todo) => {
  const { todos } = model.state;

  if (e.key === "Enter") {
    let newTodos = todos.map((item) => {
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
        return false;
      }
      return true;
    });

    model.setState({ ...model.state, todos: newTodos });
  } else if (e.key === "Escape") {
    const newTodos = todos.map((item) => {
      if (item.id === todo.id) {
        return {
          ...item,
          text: todo.text,
          edit: !item.edit,
        };
      }
      return item;
    });

    model.setState({ ...model.state, todos: newTodos });
  }
};

model.updateState(() => {
  const newVDOM = render(model); // Generate new virtual DOM based on updated state
  diff(mainApp, newVDOM); // Patch the new virtual DOM onto the existing one
  mainApp = newVDOM; // Update mainApp reference to the new virtual DOM
});

const todoListItem = (todo) => {
  let displayState;
  let editInput = null;
  if (todo.edit) {
    displayState = "editing";
    // Creating edit input
    editInput = createElement(
      "input",
      {
        value: todo.text,
        class: "edit",
        id: todo.id,
        autofocus: true,
        onkeydown: (e) => {
          editTodo(e, todo);
        },
        placeholder: todo.text,
      },
      []
    );
  } else {
    displayState = todo.completed ? "completed" : "";
  }

  const destroyButton = createElement(
    "button",
    {
      class: "destroy",
      onClick: () => {
        removeTodo(todo.id);
      },
    },
    []
  );
  const todoLabel = createElement(
    "label",
    {
      ondblclick: () => {
        enableTodoEdit(todo);
      },
    },
    todo.text
  );
  const input3 = createElement(
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
  const div = createElement("div", { class: "view" }, [
    input3,
    todoLabel,
    destroyButton,
  ]);

  const li = createElement(
    "li",
    { "data-id": todo.id, id: todo.id, class: displayState },
    editInput === null ? [div] : [div, editInput]
  );

  return li;
};

// TODO modulariseeri välja komponendid, mis pole stateful

// Main rendering logic
function render(model) {
  const { todos, filter } = model.state;

  // route checker
  router.checkRoute();

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
      onClick: (e) => {
        filterTodos(e.target.id);
      },
    },
    "Completed"
  );
  const activeList = createElement(
    "a",
    {
      href: "#/active",
      id: "active",
      class: filter === "active" ? "selected" : "",
      onClick: (e) => {
        filterTodos(e.target.id);
      },
    },
    "Active"
  );
  const allList = createElement(
    "a",
    {
      href: "#/",
      id: "all",
      class: filter === "all" ? "selected" : "",
      onClick: (e) => {
        filterTodos(e.target.id);
      },
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
