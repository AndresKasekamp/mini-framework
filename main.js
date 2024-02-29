// import { update, view, subscriptions  } from "./TODOMVC/todo-app";
// import { mount } from "./framework/VirtualDom";
// import { State } from "./framework/StateManagement.js";


import {h, mount } from "./framework_2/vdom-vue.js"



// TODO toimib lahendus
// const initModel = new State({ todos: [], hash: "#/" });

// const app = document.getElementById('app')

// mount(initModel, update, view, app, subscriptions);


//-----

// const vdom = h('div', {style: "background-color: coral;"}, h('h2', {style: "color: green;"}, 'Foobar'))
// //const vdom = h('button', {style: "color: red;", onclick: () => alert('Hello')}, 'Click here')
// const app = document.getElementById('app')

// mount(vdom, app)
//unmount(vdom)


// export function view(model, signal) {
//     return section(
//       ["class=todoapp"],
//       [
//         // array of "child" elements
//         header(
//           ["class=header"],
//           [
//             h1([], [text("todos")]), // </h1>
//             input(
//               [
//                 "id=new-todo",
//                 "class=new-todo",
//                 "placeholder=What needs to be done?",
//                 "autofocus",
//               ],
//               []
//             ), // <input> is "self-closing"
//           ]
//         ), // </header>
//         renderMain(model, signal),
//         renderFooter(model, signal),
//       ]
//     ); // <section>
//   }