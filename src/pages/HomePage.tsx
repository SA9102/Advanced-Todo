import {
  ActionIcon,
  Divider,
  Group,
  Progress,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import TodoItem from "../components/TodoItem";
import todoType from "../types/todoType";
import { useGetTodos, useTodoActions } from "../store/todoStore";
import { useState } from "react";
import emptyTask from "../utils/emptyTodo";
import { v4 as uuidv4 } from "uuid";

const HomePage = () => {
  const todos: todoType[] = useGetTodos();
  // const createTodo = useCreateTodo();
  // const checkTodo = useCheckTodo();
  const { createTodo } = useTodoActions();
  const [newTodo, setNewTodo] = useState<todoType>(emptyTask);

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
    <>
      <Title order={1} mb="sm">
        My Todos
      </Title>
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
    </>
  );
};

export default HomePage;
