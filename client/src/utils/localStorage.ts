import tagType from "../types/tagType";
import todoType from "../types/todoType";

const retrieveTodosLS = () => {
  return JSON.parse(localStorage.getItem("todos"));
};

const saveTodosLS = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

export const getTodosLS = () => {
  let todos = JSON.parse(localStorage.getItem("todos"));
  // When we fetch the data from local storage, the date values will
  // no longer be date objects but strings instead, so we must convert
  // these back into date objects.
  if (!todos) {
    todos = [];
  } else {
    todos = todos.map((todo) => {
      let start = null;
      let end = null;
      if (todo.start) {
        start = new Date(todo.start);
      }

      if (todo.end) {
        end = new Date(todo.end);
      }

      return { ...todo, start, end };
    });
  }
  return todos;
};

export const addTodoLS = (newTodo: todoType) => {
  let todosLS = retrieveTodosLS();
  todosLS = [...todosLS, { ...newTodo, userId: "" }];
  saveTodosLS(todosLS);
};

export const updateTodoLS = (updatedTodo: todoType) => {
  let todosLS = retrieveTodosLS();
  todosLS = todosLS.map((todo: todoType) => {
    if (todo.taskId === updatedTodo.taskId) {
      return updatedTodo;
    }
    return todo;
  });
  saveTodosLS(todosLS);
};

export const deleteTodoLS = (todoId: string) => {
  // const newTodos = todos.filter((todo) => todo.taskId !== todoId);
  let todosLS = retrieveTodosLS();
  todosLS = todosLS.filter((todo) => todo.taskId !== todoId);
  saveTodosLS(todosLS);
};

export const getTagsLS = () => {
  let tags = JSON.parse(localStorage.getItem("tags"));
  if (!tags) {
    tags = [];
  }
  return tags;
};

export const addTagToLS = (tagInput: tagType) => {
  let tagsLS = JSON.parse(localStorage.getItem("tags"));
  if (!tagsLS) {
    tagsLS = [tagInput];
  } else {
    tagsLS = [...tagsLS, tagInput];
  }
  localStorage.setItem("tags", JSON.stringify(tagsLS));
};
