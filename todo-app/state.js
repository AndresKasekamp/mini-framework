import { State } from "../framework/StateManager.js";

// Initialize State manager
export const model = new State({
  todos: [],
  filter: "all",
});
