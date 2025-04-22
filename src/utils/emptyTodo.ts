import todoType from "../types/todoType";
import { v4 as uuidv4 } from "uuid";

const emptyTodo: todoType = {
  id: uuidv4(),
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
