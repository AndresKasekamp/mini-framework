import { initModel, update, view, subscriptions  } from "./TODOMVC/todo-app";
import { mount } from "./framework/framework";

mount(initModel, update, view, 'app', subscriptions);