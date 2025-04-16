import todoType from "../types/todoType";

const mockTodos: todoType[] = [
  {
    id: "1",
    task: "Get groceries",
    description: "",
    isComplete: false,
    isChangingTask: false,
    priority: "2",
  },
  {
    id: "2",
    task: "Feed cat",
    description: "",
    isComplete: false,
    isChangingTask: false,
    priority: "1",
  },
  {
    id: "3",
    task: "Eat lunch",
    description: "",
    isComplete: true,
    isChangingTask: false,
    priority: "3",
  },
];

export default mockTodos;
