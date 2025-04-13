import { create } from "zustand";
import todoType from "../types/todoType";
import mockTodos from "../utils/mockTodos";

type state = {
  todos: todoType[];
  actions: actions;
};

type actions = {
  createTodo: (newTodo: todoType) => void;
  checkTodo: (todoId: string) => void;
  deleteTodo: (todoId: string) => void;
};

const useTodoStore = create<state>((set) => ({
  todos: mockTodos,
  actions: {
    createTodo: (newTodo: todoType) =>
      set((state) => ({ todos: [...state.todos, newTodo] })),
    checkTodo: (todoId: string) =>
      set((state) => ({
        todos: state.todos.map((todo: todoType) => {
          if (todo.id === todoId) {
            todo.isComplete = !todo.isComplete;
          }
          return todo;
        }),
      })),
    deleteTodo: (todoId: string) =>
      set((state) => ({
        todos: state.todos.filter((todo: todoType) => todo.id !== todoId),
      })),
  },
}));

export const useGetTodos = () => useTodoStore((state) => state.todos);
export const useGetTodo = (id: string) =>
  useTodoStore((state) => state.todos.find((todo) => todo.id === id));

export const useTodoActions = () => useTodoStore((state) => state.actions);
