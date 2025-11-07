import { Stack, Typography } from "@mui/material";
import todoType from "../types/todoType";
import TodoItem from "./TodoItem";

type props = {
  todos: todoType[];
  status: "Pending" | "Upcoming" | "Overdue" | "Completed";
};

// The section that renders the list of todos
// These todos could be one of 'Pending', 'Upcoming', 'Overdue' or 'Completed'
const TodoSection = ({ todos, status }: props) => {
  return (
    <>
      <Stack>
        <Typography>{status}</Typography>
        <Stack gap="0.5rem">
          {todos.length === 0 ? (
            <Typography variant="body2">No todos here.</Typography>
          ) : (
            todos.map((todo: todoType) => (
              <TodoItem key={todo.taskId} todo={todo} />
            ))
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default TodoSection;
