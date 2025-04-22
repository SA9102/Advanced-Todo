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
import { v4 as uuidv4 } from "uuid";
import FiltersInput from "../components/FiltersInput";
import emptyTodo from "../utils/emptyTodo";
import todoFiltersType from "../types/todoFiltersType";
import emptyTodoFilters from "../utils/emptyTodoFilters";

const HomePage = () => {
  const todos: todoType[] = useGetTodos(); // Get all todos from store
  const { createTodo } = useTodoActions(); // Function for creating a todo
  const [newTodo, setNewTodo] = useState<todoType>(emptyTodo); // Input for adding a new todo
  const [todoFilters, setTodoFilters] =
    useState<todoFiltersType>(emptyTodoFilters); // Input for todo filters
  const [filterGroups, setFilterGroups] = useState([
    "pending",
    "completed",
    "upcoming",
    "overdue",
  ]);

  const resetTodos = () => {
    setNewTodo({ ...emptyTodo, id: uuidv4() });
  };

  const getNumberOfCompletedTodos = () => {
    return todos.filter((todo: todoType) => todo.isComplete).length;
  };

  // Return percentage of completed todos
  const getCompletedValue = () => {
    return (getNumberOfCompletedTodos() / todos.length) * 100;
  };

  const getFilteredTodos = () => {
    let filtered = [...todos];

    // If the text input is not empty, then filter by text within task and/or description
    if (todoFilters.text.trim() !== "") {
      filtered = filtered.filter(
        (todo) =>
          todo.task.toLowerCase().includes(todoFilters.text.toLowerCase()) ||
          todo.description
            .toLowerCase()
            .includes(todoFilters.text.toLowerCase())
      );
    }

    // Filter by priority
    filtered = filtered.filter((todo) =>
      todoFilters.priority.includes(todo.priority)
    );

    // Fitler by tags. If no tags are selected, then show todos belonging to all tags.
    if (todoFilters.tags.length > 0) {
      filtered = filtered.filter((todo) => {
        for (let i = 0; i < todo.tags.length; i++) {
          for (let j = 0; j < todoFilters.tags.length; j++) {
            if (todo.tags[i] === todoFilters.tags[j]) {
              return todo;
            }
          }
        }
      });
    }

    return filtered;
  };

  // Check if the todo item has a start date and, if it does then check
  // if the current time is past this start date.
  const hasExceededStart = (todo: todoType) => {
    if (todo.start !== null) {
      if (Date.now() >= todo.start.getTime()) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const hasExceededEnd = (todo: todoType) => {
    if (todo.end !== null) {
      if (Date.now() >= todo.end.getTime()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <>
      <Title order={1} mb="sm">
        My Todos
      </Title>
      <FiltersInput todoFilters={todoFilters} setTodoFilters={setTodoFilters} />
      <Stack flex="1" style={{ overflow: "auto" }}>
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
            {/* Pending todos */}
            {getFilteredTodos().map((todo: todoType) => {
              if (
                !todo.isComplete &&
                hasExceededStart(todo) &&
                !hasExceededEnd(todo)
              ) {
                return <TodoItem key={todo.id} todo={todo} />;
              }
            })}
          </Stack>
        </Stack>
        <Divider />
        <Stack>
          <Text size="xs">Upcoming</Text>
          <Stack gap="xs">
            {/* Upcoming todos */}
            {getFilteredTodos().map((todo: todoType) => {
              if (!todo.isComplete && !hasExceededStart(todo)) {
                return <TodoItem key={todo.id} todo={todo} />;
              }
            })}
          </Stack>
        </Stack>
        <Divider />
        <Stack>
          <Text size="xs">Overdue</Text>
          <Stack gap="xs">
            {/* Overdue todos */}
            {getFilteredTodos().map((todo: todoType) => {
              if (!todo.isComplete && hasExceededEnd(todo)) {
                return <TodoItem key={todo.id} todo={todo} />;
              }
            })}
          </Stack>
        </Stack>
        <Divider />
        <Stack>
          <Text size="xs">Completed</Text>
          <Stack gap="xs">
            {/* Completed todos */}
            {getFilteredTodos().map((todo: todoType) => {
              if (todo.isComplete) {
                return <TodoItem key={todo.id} todo={todo} />;
              }
            })}
          </Stack>
        </Stack>
      </Stack>
      <Group
        gap="xs"
        // mb="sm"
      >
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
    </>
  );
};

export default HomePage;
