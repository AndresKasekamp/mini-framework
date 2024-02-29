// Kirjuta manager ja siia kirjuta use case igale võimalusele
// TODO näiteks deletetodo ja siis mis on täpsemalt callback, puhastab state ja mis veel kas uus funktsioon ja miks?

// Deleting a todo, takes in the element that triggered the event to get the id of the todo to delete
// export function DeleteToDo(el) {
//     let toDoId = el.parentElement.parentElement.getAttribute('data-id')
//     const updatedToDos = ToDoState.state.toDos.filter((todo) => todo.id != toDoId);
//     ToDoState.setState({
//         toDos: updatedToDos,
//         filter: ToDoState.state.filter
//     });
// }

// TODO mis asi on filter ja miks mul seda vaja on siin kontekstis ('all' jne?)

// TODO chatGPT-l lasta genereerida kood kus state ja event töötavad koos