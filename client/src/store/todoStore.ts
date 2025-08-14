import { create } from "zustand";
import todoType from "../types/todoType";
import mockTodos from "../utils/mockTodos";

type state = {
  todos: todoType[];
  isSynced: boolean; // True if fetched from database and not yet changed.
  actions: actions;
};

type actions = {
  setTodos: (todos: todoType[]) => void; // Given an array of todos of the correct type, this will overwrite everything with the new todos
  createTodo: (newTodo: todoType) => void;
  updateTodo: (updatedTodo: todoType) => void;
  checkTodo: (todoId: string) => void;
  deleteTodo: (todoId: string) => void;
  changeTask: (todoId: string, isChange: boolean) => void;
  toggleExpandTodo: (todoId: string) => void;
  setSynced: (isSynced: boolean) => void;
};

const useTodoStore = create<state>((set) => ({
  todos: [],
  isSynced: true,
  actions: {
    setTodos: (todos: todoType[]) => set((state) => ({ todos })),
    createTodo: (newTodo: todoType) =>
      set((state) => ({ todos: [...state.todos, newTodo] })),
    updateTodo: (updatedTodo: todoType) =>
      set((state) => ({
        todos: state.todos.map((todo: todoType) => {
          if (todo.taskId === updatedTodo.taskId) {
            return updatedTodo;
          }
          return todo;
        }),
      })),
    checkTodo: (todoId: string) =>
      set((state) => ({
        todos: state.todos.map((todo: todoType) => {
          if (todo.taskId === todoId) {
            todo.isComplete = !todo.isComplete;
          }
          return todo;
        }),
      })),
    deleteTodo: (todoId: string) =>
      set((state) => ({
        todos: state.todos.filter((todo: todoType) => todo.taskId !== todoId),
      })),
    changeTask: (todoId: string, isChange: boolean) => {
      set((state) => ({
        todos: state.todos.map((todo: todoType) => {
          if (todo.taskId === todoId) {
            if (isChange) {
              todo.isChangingTask = true;
            } else {
              todo.isChangingTask = false;
            }
          }
          return todo;
        }),
      }));
    },
    toggleExpandTodo: (todoId: string) => {
      set((state) => ({
        todos: state.todos.map((todo: todoType) => {
          if (todo.taskId === todoId) {
            todo.isExpanded = !todo.isExpanded;
          }
          return todo;
        }),
      }));
    },
    setSynced: (isSynced: boolean) => {
      set((state) => ({ isSynced }));
    },
  },
}));

export const useGetTodos = () => useTodoStore((state) => state.todos);
export const getTodos = () => useTodoStore.getState().todos; // Same as above, but a non-hook getter for utility functions.
export const useGetTodo = (id: string) =>
  useTodoStore((state) => state.todos.find((todo) => todo.taskId === id));
export const useTodoActions = () => useTodoStore((state) => state.actions);
