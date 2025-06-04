// Mantine
import {
  ActionIcon,
  AppShell,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconPaint, IconSun } from "@tabler/icons-react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { HOME, UPDATE_TODO } from "./routes/routes";
import EditTodoPage from "./pages/EditTodoPage";
import "./index.css";

const App = () => {
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
          <Group justify="space-between" w="100%">
            <Text size="lg" fw={700}>
              My Todos
            </Text>
            <Group gap={5}>
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
          </Group>
        </Group>
      </AppShell.Header>
    </AppShell>
  );
};

export default App;
