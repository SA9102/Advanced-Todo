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
  Drawer,
  Paper,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import todoType from "./types/todoType";
import { IconMoon, IconPaint, IconPlus, IconSun } from "@tabler/icons-react";
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
  // const [opened, { open, close }] = useDisclosure(false);

  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <AppShell>
      <AppShell.Main>
        <Stack gap="sm" pt="2.5rem" p="xs" h="100vh">
          <Routes>
            <Route path={HOME} element={<HomePage />} />
            <Route path={UPDATE_TODO} element={<EditTodoPage />} />
          </Routes>
        </Stack>
      </AppShell.Main>
      <AppShell.Header>
        <Group p="0.3rem" gap="xs">
          <ActionIcon
            size="sm"
            variant="default"
            onClick={() =>
              setColorScheme(colorScheme === "light" ? "dark" : "light")
            }
          >
            {colorScheme === "light" ? (
              <IconSun size="16" />
            ) : (
              <IconMoon size="16" />
            )}
          </ActionIcon>
          <ActionIcon size="sm" variant="default">
            <IconPaint size="16" />
          </ActionIcon>
        </Group>
      </AppShell.Header>
      {/* <AppShell.Header>
        <Burger
          size="sm"
          opened={opened}
          onClick={open}
          aria-label="Toggle sidebar"
        />
        <Drawer size="xs" opened={opened} onClose={close} title="Sidebar">
          <Stack>
            <Paper bg="red" p="xs" style={{ userSelect: "none" }}>
              Hello
            </Paper>
            <Paper>There</Paper>
          </Stack>
        </Drawer>
      </AppShell.Header> */}
    </AppShell>
  );
};

export default App;
