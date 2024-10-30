import { getTodoRepository } from "./todo_repository.js";

export function getRepository(database) {
  return {
    todoRepository: getTodoRepository(database),
  };
}
