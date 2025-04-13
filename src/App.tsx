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
  const {createTodo} = useTodoActions()
  const [newTodo, setNewTodo] = useState<todoType>(emptyTask);

  const theme = useMantineTheme();

  const resetTodos = () => {
    setNewTodo({ ...emptyTask, id: uuidv4() });
  };

  return (
    <AppShell p="xs">
      <AppShell.Main>
        <Stack gap="xs">
          <Group gap="0">
            <TextInput
              placeholder="Input task"
              value={newTodo.name}
              onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
              flex="1"
              
            />
            <ActionIcon
              size="lg"
              onClick={() => {
                createTodo(newTodo);
                resetTodos();
              }}
            >
              <IconPlus />
            </ActionIcon>
          </Group>
          <Stack gap="xs">
            {todos.map((todo: todoType) => (
              <TodoItem todo={todo} />
            ))}
          </Stack>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
