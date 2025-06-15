// Mantine
import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Drawer,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconPaint, IconSun, IconMenu2 } from "@tabler/icons-react";
import { Link, Route, Routes, useLocation } from "react-router";
import HomePage from "./pages/HomePage";
import { CREATE_TAG, HOME, UPDATE_TODO } from "./routes/routes";
import EditTodoPage from "./pages/EditTodoPage";
import "./index.css";
import { useDisclosure } from "@mantine/hooks";
import TagPage from "./pages/TagPage";

const App = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);
  const path = useLocation();
  return (
    <AppShell>
      <Drawer opened={opened} onClose={close} title="ASd">
        <Stack>
          <Button variant="subtle">New Todo</Button>
          <Button
            variant="subtle"
            onClick={close}
            component={Link}
            to={CREATE_TAG}
          >
            New Tag
          </Button>
        </Stack>
      </Drawer>
      <AppShell.Main>
        <Stack gap="sm" pt="3rem" p="xs" h="100vh">
          <Routes>
            <Route path={HOME} element={<HomePage />} />
            <Route path={CREATE_TAG} element={<TagPage />} />
            <Route path={UPDATE_TODO} element={<EditTodoPage />} />
          </Routes>
        </Stack>
      </AppShell.Main>
      <AppShell.Header>
        <Group p="0.3rem" gap="xs">
          <Group justify="space-between" w="100%">
            <Group>
              <ActionIcon
                size="sm"
                variant="transparent"
                color="white"
                onClick={open}
              >
                <IconMenu2 />
              </ActionIcon>
              <Text size="lg" fw={700}>
                {path.pathname === CREATE_TAG ? "New Tag" : "My Todos"}
              </Text>
            </Group>
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
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
    </AppShell>
  );
};

export default App;
