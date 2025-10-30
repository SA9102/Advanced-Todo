import todoType from "../types/todoType";

export const getNumberOfCompletedTodos = (todos: todoType[]) => {
  return todos.filter((todo: todoType) => todo.isComplete).length;
};

export const getCompletedValue = (todos: todoType[]) => {
  return (getNumberOfCompletedTodos(todos) / todos.length) * 100;
};

export const getPercentageOfCompletedPendingTodos = (todos: todoType[]) => {
  return (
    (getCompletedPendingTodos(todos) / getCurrentTodos(todos).length) * 100
  );
};

export const getCompletedPendingTodos = (todos: todoType[]) => {
  const currentTodos = getCurrentTodos(todos);
  const completedCurrentTodos = currentTodos.reduce((count, todo) => {
    return count + (todo?.isComplete ? 1 : 0);
  }, 0);
  return completedCurrentTodos;
};

// Here, 'current' todos means the todos that are pending, and the todos that are complete that were also pending before.
export const getCurrentTodos = (todos: todoType[]) => {
  const currentTodos = todos.filter((todo) => {
    if (hasExceededStart(todo) && !hasExceededEnd(todo)) {
      return todo;
    }
  });
  return currentTodos;
};

// Check if the todo item has a start date and, if it does then check
// if the current time is past this start date.
export const hasExceededStart = (todo: todoType) => {
  if (todo.start !== null) {
    const todoStart = new Date(todo.start);
    if (Date.now() >= todoStart.getTime()) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

// Check if the todo item has an end date and, if it does then check
// if the current time is past this end date.
export const hasExceededEnd = (todo: todoType) => {
  if (todo.end !== null) {
    const todoEnd = new Date(todo.end);
    if (Date.now() >= todoEnd.getTime()) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
