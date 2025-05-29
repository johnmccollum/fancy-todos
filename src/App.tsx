import "./App.css";

import { useState, type FormEvent } from "react";
import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  async function addTodo(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("todo") as HTMLInputElement;
    const value = input.value.trim();

    if (value) {
      await db.todoItems.add({ item: value, done: false });
      input.value = "";
    }
  }

  const todoItems = useLiveQuery(() => {
    return db.todoItems
      .filter((todoItem) => {
        return searchTerm ? todoItem.item.includes(searchTerm) : true;
      })
      .toArray();
  }, [searchTerm]);

  return (
    <>
      <h1>Fancy ToDo</h1>

      <form onSubmit={addTodo}>
        <label htmlFor="todo-input">New Todo:</label>
        <input id="todo-input" type="text" name="todo" />
        <button type="submit">Add</button>
      </form>

      <div id="items">
        <label htmlFor="filter-input">Filter items:</label>
        <input
          id="filter-input"
          type="text"
          name="filter"
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />

        <ul>
          {todoItems?.map((todo) => (
            <li key={todo.id}>
              {todo.item} {todo.done ? "(done)" : "(not done)"}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
