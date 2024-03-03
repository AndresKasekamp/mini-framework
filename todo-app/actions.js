import { model } from "./state";
import { areAllValuesEqual, generatorId } from "./helpers.js";

export const addTodo = (e) => {
  if (e.key === "Enter") {
    if (e.target.value !== "") {
      const uid = generatorId.next();
      const { todos } = model.state;

      const newTodo = {
        id: uid.value,
        text: e.target.value.trim(),
        completed: false,
        edit: false,
      };
      e.target.value = "";

      model.setState({ ...model.state, todos: [...todos, newTodo] });
    }
  } else if (e.key === "Escape") {
    e.target.value = "";
  }
};

export const removeTodo = (id) => {
  // Filtering todos
  const { todos } = model.state;
  const todoRemoved = todos.filter((item) => item.id !== id);
  model.setState({ ...model.state, todos: todoRemoved });
};

// Toggle single todo item to mark it as completed or vice versa
export const toggleTodo = (id) => {
  const { todos } = model.state;

  const newTodos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  model.setState({ ...model.state, todos: newTodos });
};

// Clearing completed todos
export const clearCompleted = () => {
  const { todos } = model.state;

  const newTodos = todos.filter((item) => !item.completed);
  model.setState({ ...model.state, todos: newTodos });
};

// Toggle all todos,
export const toggleAllTodos = () => {
  const { todos } = model.state;

  let newTodos;
  if (areAllValuesEqual(todos, "completed")) {
    newTodos = todos.map((item) => {
      return {
        ...item,
        completed: !item.completed,
      };
    });
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

// Editing todo
export const editTodo = (e, todo) => {
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

// Enabling todo edit
export const enableTodoEdit = (todo) => {
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

export const filterTodos = (path) => {
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
