import { update, view, subscriptions  } from "./TODOMVC/todo-app";
import { mount } from "./framework/VirtualDom";
import { State } from "./framework/StateManagement.js";


const initModel = new State({ todos: [], hash: "#/" });

const app = document.getElementById('app')

mount(initModel, update, view, app, subscriptions);