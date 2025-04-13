// Mantine
import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Card,
  Group,
  TextInput,
  Text,
  useMantineTheme,
  Checkbox,
  Stack,
  Divider,
  Progress,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import todoType from "./types/todoType";
import { IconPlus } from "@tabler/icons-react";
import emptyTask from "./utils/emptyTodos";
import mockTasks from "./utils/mockTodos";
import { useGetTodos, useTodoActions } from "./store/todoStore";
import { v4 as uuidv4 } from "uuid";
import TodoItem from "./components/TodoItem";

const App = () => {
  const todos: todoType[] = useGetTodos();
  // const createTodo = useCreateTodo();
  // const checkTodo = useCheckTodo();
  const { createTodo } = useTodoActions();
  const [newTodo, setNewTodo] = useState<todoType>(emptyTask);

  const theme = useMantineTheme();

  const resetTodos = () => {
    setNewTodo({ ...emptyTask, id: uuidv4() });
  };

  const getNumberOfCompletedTodos = () => {
    return todos.filter((todo: todoType) => todo.isComplete).length;
  };

  const getCompletedValue = () => {
    return (getNumberOfCompletedTodos() / todos.length) * 100;
  };

  return (
    <AppShell p="xs">
      <AppShell.Main>
        <Stack gap="sm">
          <Group gap="xs" mb="sm">
            <TextInput
              size="xs"
              placeholder="Enter todo ..."
              value={newTodo.task}
              onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })}
              flex="1"
            />
            <ActionIcon
              size="md"
              onClick={() => {
                createTodo(newTodo);
                resetTodos();
              }}
            >
              <IconPlus />
            </ActionIcon>
          </Group>
          <Stack>
            <Text size="xs">
              Completed Todos: {getNumberOfCompletedTodos()} / {todos.length}
            </Text>
            <Progress value={getCompletedValue()} />
          </Stack>
          <Divider />
          <Stack>
            <Text size="xs">Pending</Text>
            <Stack gap="xs">
              {todos.map((todo: todoType) => {
                if (!todo.isComplete) {
                  return <TodoItem key={todo.id} todo={todo} />;
                }
              })}
            </Stack>
          </Stack>
          <Divider />
          <Stack>
            <Text size="xs">Completed</Text>
            <Stack gap="xs">
              {todos.map((todo: todoType) => {
                if (todo.isComplete) {
                  return <TodoItem key={todo.id} todo={todo} />;
                }
              })}
            </Stack>
          </Stack>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
