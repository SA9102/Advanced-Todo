// The section that renders the list of todos
// These todos could be one of 'Pending', 'Upcoming', 'Overdue' or 'Completed'

import { Card, Stack, Typography } from "@mui/material";
import { useGetLayout } from "../store/layoutStore";
import todoType from "../types/todoType";
import TodoItem from "./TodoItem";

type props = {
  todos: todoType[];
  status: "Pending" | "Upcoming" | "Overdue" | "Completed";
};

const TodoSection = ({ todos, status }: props) => {
  const layout = useGetLayout();

  return (
    <>
      <Stack>
        <Typography>{status}</Typography>
        <Stack
          // style={{
          //   columnCount: layout == "grid" ? "2" : "1",
          //   gap: "1rem",
          // }}
          gap="0.5rem"
        >
          {todos.length === 0 ? (
            <Typography
              // size="sm"
              // style={{
              // color: theme.colors.dark[3],
              // }}
              variant="body2"
            >
              No todos here.
            </Typography>
          ) : (
            todos.map((todo: todoType) => (
              <TodoItem key={todo.taskId} todo={todo} />
            ))
          )}
        </Stack>
      </Stack>
      {/* <Divider /> */}
      {/* <Card
        style={{ padding: "0.5rem" }}
        // bgcolor="#212121"
        // p="0.5rem"
        // style={{
        //   backgroundColor: "red",
        //   padding: "0.5rem",
        //   borderRadius: theme.radius[theme.defaultRadius],
        // }}
      >
        <Typography
        // size="xs"
        >
          {status}
        </Typography>
        <Stack
          // style={{
          //   columnCount: layout == "grid" ? "2" : "1",
          //   gap: "1rem",
          // }}
          gap="0.5rem"
        >
          {todos.length === 0 ? (
            <Typography
              // size="sm"
              // style={{
              // color: theme.colors.dark[3],
              // }}
              variant="body2"
            >
              No todos here.
            </Typography>
          ) : (
            todos.map((todo: todoType) => (
              <TodoItem key={todo.taskId} todo={todo} />
            ))
          )}
        </Stack>
      </Card> */}
    </>
  );
};

export default TodoSection;
