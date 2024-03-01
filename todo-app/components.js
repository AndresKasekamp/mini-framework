import { removeTodo, toggleTodo, editTodo, enableTodoEdit } from "./actions.js";
import { createElement } from "../framework/VirtualDom.js";

export const todoListItem = (todo) => {
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
