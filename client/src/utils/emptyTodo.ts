import todoType from "../types/todoType";
import { v4 as uuidv4 } from "uuid";

const emptyTodo: todoType = {
  taskId: uuidv4(),
  userId: "686bb991665e3d6bb3ad2044",
  task: "",
  description: "",
  isComplete: false,
  isChangingTask: false,
  isExpanded: false,
  priority: "1",
  tags: [],
  start: null,
  end: null,
};

export default emptyTodo;
