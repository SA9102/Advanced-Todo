// Mantine
import {
  ActionIcon,
  AppShell,
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
import {
  CREATE_TAG,
  HOME,
  EDIT_TODO,
  EDIT_TAGS,
  EDIT_TAG,
  REGISTER,
  LOGIN,
  TEST,
} from "./routes/routes";
import EditTodoPage from "./pages/EditTodoPage";
import "./index.css";
import { useDisclosure, useLogger } from "@mantine/hooks";
import TagPage from "./pages/TagPage";
import EditTagsPage from "./pages/EditTagsPage";
import EditTagPage from "./pages/EditTagPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { useContext, useEffect } from "react";
import HomePageNew from "./pages/HomePageNew";
import AuthContext from "./context/AuthProvider";
import useLogout from "./hooks/useLogout";
import PersistLogin from "./components/PersistLogin";
import usePersistLogin from "./hooks/usePersistLogin";

const BUTTONS = [
  {
    text: "My Todos",
    path: HOME,
  },
  {
    text: "New Todo",
    path: HOME,
  },
  {
    text: "New Tag",
    path: CREATE_TAG,
  },
  {
    text: "Edit Tags",
    path: EDIT_TAGS,
  },
  {
    text: "Register",
    path: REGISTER,
  },
];

const App = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);
  const path = useLocation();
  const { auth } = useContext(AuthContext);
  const logout = useLogout();
  console.log(auth);

  usePersistLogin();

  return (
    <AppShell>
      <Drawer opened={opened} onClose={close} title="ASd">
        <Stack>
          {BUTTONS.map((button) => (
            <Button
              variant="subtle"
              onClick={close}
              component={Link}
              to={button.path}
            >
              {button.text}
            </Button>
          ))}
        </Stack>
      </Drawer>
      <AppShell.Main>
        <Stack gap="sm" pt="3rem" p="xs" h="100vh">
          <Routes>
            {/* <Route element={<PersistLogin />}> */}
            <Route path={HOME} element={<HomePage />} />
            <Route path={CREATE_TAG} element={<TagPage />} />
            <Route path={EDIT_TODO} element={<EditTodoPage />} />
            <Route path={EDIT_TAGS} element={<EditTagsPage />} />
            <Route path={EDIT_TAG} element={<EditTagPage />} />
            {/* </Route> */}
            <Route path={REGISTER} element={<RegisterPage />} />
            <Route path={LOGIN} element={<LoginPage />} />
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
              {auth ? (
                <Button size="compact-xs" onClick={logout}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button size="compact-xs" component={Link} to={LOGIN}>
                    Login
                  </Button>
                  <Button size="compact-xs" component={Link} to={REGISTER}>
                    Register
                  </Button>
                </>
              )}
              <ActionIcon
                disabled
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
