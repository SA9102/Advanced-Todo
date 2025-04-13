import todoType from "../types/todoType";
import { v4 as uuidv4 } from "uuid";

const emptyTodo: todoType = {
    id: uuidv4(),
    name: "",
    description: "",
    isComplete: false
}

export default emptyTodo