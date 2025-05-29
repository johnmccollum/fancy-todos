import Dexie, { type EntityTable } from "dexie";

interface Todo {
  id: number;
  item: string;
  done: boolean;
}

const db = new Dexie("TodoDB") as Dexie & {
  todoItems: EntityTable<Todo, "id">;
};

db.version(1).stores({
  todoItems: "++id, item, done",
});

export type { Todo };
export { db };
