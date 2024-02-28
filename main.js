import { initModel, update, view, subscriptions  } from "./TODOMVC/todo-app";
import { mount } from "./framework/VirtualDom";

mount(initModel, update, view, 'app', subscriptions);