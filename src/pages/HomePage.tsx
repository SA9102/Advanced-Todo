import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  NativeSelect,
  Progress,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
  VisuallyHidden,
} from "@mantine/core";
import {
  IconLayout2Filled,
  IconLayoutList,
  IconLayoutListFilled,
  IconPlus,
} from "@tabler/icons-react";
import TodoItem from "../components/TodoItem";
import todoType from "../types/todoType";
import { useGetTodos, useTodoActions } from "../store/todoStore";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FiltersInput from "../components/FiltersInput";
import emptyTodo from "../utils/emptyTodo";
import todoFiltersType from "../types/todoFiltersType";
import emptyTodoFilters from "../utils/emptyTodoFilters";
import { useGetLayout, useSetLayout } from "../store/layoutStore";
import TodoSection from "../components/TodoSection";

const HomePage = () => {
  // Mantine theme
  const theme = useMantineTheme();
  // Get all todos from store
  const todos: todoType[] = useGetTodos();
  // Function for creating a todo
  const { createTodo } = useTodoActions();
  // Get current layout of todos
  const layout = useGetLayout();
  // Set layout of todos
  const setLayout = useSetLayout();
  // Input for adding a new todo
  const [newTodo, setNewTodo] = useState<todoType>(emptyTodo);
  // Input for todo filters
  const [todoFilters, setTodoFilters] =
    useState<todoFiltersType>(emptyTodoFilters);
  // The different 'states' that a todo item can be in
  const [filterGroups, setFilterGroups] = useState([
    "Pending",
    "Completed",
    "Upcoming",
    "Overdue",
  ]);
  // By what the todos are sorted
  const [sortBy, setSortBy] = useState<"name" | "priority">("priority");

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

    // Filter by priority.
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

  // Sorts todos (NOTE: this is done after the todos are split into
  // the different status e.g. Pending, hence the reason why it takes
  // an argument of an array of todos. These todos would be of the same
  // status
  const sortTodos = (todos: todoType[]) => {
    if (sortBy === "name") {
      todos = todos.sort((a, b) => a.task.localeCompare(b.task));
    } else if (sortBy === "priority") {
      todos = todos.sort((a, b) => {
        if (a.priority > b.priority) {
          return -1;
        } else if (a.priority < b.priority) {
          return 1;
        }
        return 0;
      });
    }

    return todos;
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

  // Check if the todo item has an end date and, if it does then check
  // if the current time is past this end date.
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

  // Organises the todos into their statuses, namely 'Pending', 'Upcoming',
  // 'Overdue' and 'Complete'. (NOTE: this is done AFTER the todos have been
  // filtered, to avoid unnecessary allocation of todos.).
  const organiseTodosByStatus = () => {
    let pending: todoType[] = [];
    let upcoming: todoType[] = [];
    let overdue: todoType[] = [];
    let completed: todoType[] = [];
    const filteredTodos = getFilteredTodos();

    for (let i = 0; i < filteredTodos.length; i++) {
      const todo = filteredTodos[i];
      if (!todo.isComplete && hasExceededStart(todo) && !hasExceededEnd(todo)) {
        pending = [...pending, todo];
      } else if (!todo.isComplete && !hasExceededStart(todo)) {
        upcoming = [...upcoming, todo];
      } else if (!todo.isComplete && hasExceededEnd(todo)) {
        overdue = [...overdue, todo];
      } else if (todo.isComplete) {
        completed = [...completed, todo];
      }
    }

    return [
      { status: "Pending", todos: sortTodos(pending) },
      { status: "Upcoming", todos: sortTodos(upcoming) },
      { status: "Overdue", todos: sortTodos(overdue) },
      { status: "Completed", todos: sortTodos(completed) },
    ];
  };

  return (
    <>
      <Stack
        p="0.5rem"
        style={{
          backgroundColor: theme.colors.dark[6],
          borderRadius: theme.radius[theme.defaultRadius],
        }}
      >
        <Stack gap="xs">
          <Text size="xs">
            Completed Todos: {getNumberOfCompletedTodos()} / {todos.length}
          </Text>
          <Progress value={getCompletedValue()} />
        </Stack>
        {/* Set the layout of the todos to list or grid */}
        <Stack gap="xs">
          <Text size="xs">Layout</Text>
          <SegmentedControl
            style={{ alignSelf: "flex-start" }}
            size="xs"
            value={layout}
            onChange={setLayout}
            data={[
              {
                value: "list",
                label: (
                  <>
                    <IconLayoutListFilled
                      size="20"
                      stroke="1.5"
                      style={{ display: "block" }}
                    />
                    <VisuallyHidden>List Layout</VisuallyHidden>
                  </>
                ),
              },
              {
                value: "grid",
                label: (
                  <>
                    <IconLayout2Filled
                      size="20"
                      stroke="1.5"
                      style={{ display: "block" }}
                    />
                    <VisuallyHidden>Grid Layout</VisuallyHidden>
                  </>
                ),
              },
            ]}
          />
        </Stack>
        {/* Sort todos */}
        <Stack gap="xs">
          <Text size="xs">Sort by:</Text>
          <NativeSelect
            size="xs"
            value={sortBy}
            onChange={(e) => setSortBy(e.currentTarget.value)}
            data={[
              { label: "Name", value: "name" },
              { label: "Priority", value: "priority" },
            ]}
          />
        </Stack>
        <FiltersInput
          todoFilters={todoFilters}
          setTodoFilters={setTodoFilters}
          filterGroups={filterGroups}
          setFilterGroups={setFilterGroups}
        />
      </Stack>
      <Group>
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
      {/* Main part */}
      <Stack flex="1" style={{ overflow: "auto" }}>
        {organiseTodosByStatus().map((val) => {
          if (filterGroups.includes(val.status)) {
            return <TodoSection todos={val.todos} status={val.status} />;
          }
        })}
      </Stack>
      <Group
        gap="xs"
        // mb="sm"
      ></Group>
      <Group gap="xs">
        <Button size="xs" variant="outline" flex="1">
          New Todo
        </Button>
        <Button size="xs" variant="outline" flex="1">
          New Tag
        </Button>
      </Group>
    </>
  );
};

export default HomePage;
