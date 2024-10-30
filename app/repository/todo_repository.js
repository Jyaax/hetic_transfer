export function getTodoRepository(database) {
  return {
    getAll: async () => {
      const [results] = await database.query(
        "SELECT id, title, completed FROM todo"
      );
      return results;
    },
    delete: async (id) => {
      await database.execute("DELETE FROM todo where id = ?", [id]);
    },
    getOne: async (id) => {
      const [results] = await database.execute(
        "SELECT id, title, completed FROM todo WHERE id = ?",
        [id]
      );
      //@ts-ignore
      return results[0];
    },
    insert(todo) {
      return Promise.resolve({ id: 1, title: "test", completed: true });
    },
    update(todo) {
      return Promise.resolve({ id: 1, title: "test", completed: true });
    },
  };
}
