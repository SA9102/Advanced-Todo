// The section that renders the list of todos
// These todos could be one of 'Pending', 'Upcoming', 'Overdue' or 'Completed'

import { Box, Text, Divider, Stack, useMantineTheme } from "@mantine/core";
import { useGetLayout } from "../store/layoutStore";
import todoType from "../types/todoType";
import TodoItem from "./TodoItem";

type props = {
  todos: todoType[];
  status: "Pending" | "Upcoming" | "Overdue" | "Completed";
};

const TodoSection = ({ todos, status }: props) => {
  const theme = useMantineTheme();
  const layout = useGetLayout();

  return (
    <>
      <Divider />
      <Stack
        style={{
          backgroundColor: theme.colors.dark[8],
          padding: "0.5rem",
          borderRadius: theme.radius[theme.defaultRadius],
        }}
      >
        <Text size="xs">{status}</Text>
        <Box
          style={{
            columnCount: layout == "grid" ? "2" : "1",
            gap: "1rem",
          }}
        >
          {todos.length === 0 ? (
            <Text size="sm" style={{ color: theme.colors.dark[3] }}>
              No todos here.
            </Text>
          ) : (
            todos.map((todo: todoType) => (
              <TodoItem key={todo.id} todo={todo} />
            ))
          )}
        </Box>
      </Stack>
    </>
  );
};

export default TodoSection;
