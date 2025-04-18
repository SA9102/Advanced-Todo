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
import emptyTask from "./utils/emptyTodo";
import mockTasks from "./utils/mockTodos";
import { useGetTodos, useTodoActions } from "./store/todoStore";
import { v4 as uuidv4 } from "uuid";
import TodoItem from "./components/TodoItem";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { HOME, UPDATE_TODO } from "./routes/routes";
import EditTodoPage from "./pages/EditTodoPage";
import "./index.css";

const App = () => {
  return (
    <AppShell>
      <AppShell.Main>
        <Stack gap="sm" p="xs" h="100vh">
          <Routes>
            <Route path={HOME} element={<HomePage />} />
            <Route path={UPDATE_TODO} element={<EditTodoPage />} />
          </Routes>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};

export default App;
