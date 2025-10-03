import {
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router";
import HomePage from "./pages/HomePage";
import {
  CREATE_TAG,
  HOME,
  EDIT_TODO,
  // EDIT_TAGS,
  EDIT_TAG,
  REGISTER,
  LOGIN,
  TEST,
  TAGS,
} from "./routes/routes";
import EditTodoPage from "./pages/EditTodoPage";
import "./index.css";
import TagPage from "./pages/TagPage";
import EditTagsPage from "./pages/EditTagsPage";
// import EditTagPage from "./pages/EditTagPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { useContext, useEffect } from "react";
import HomePageNew from "./pages/HomePageNew";
import AuthContext from "./context/AuthProvider";
import useLogout from "./hooks/useLogout";
import PersistLogin from "./components/PersistLogin";
import usePersistLogin from "./hooks/usePersistLogin";
import TagsPage from "./pages/TagsPage";

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
  // {
  //   text: "Edit Tags",
  //   path: EDIT_TAGS,
  // },
  {
    text: "Register",
    path: REGISTER,
  },
];

const todosLS = localStorage.getItem("todos");
if (!todosLS) {
  localStorage.setItem("todos", JSON.stringify([]));
}

// localStorage.setItem(
//   "todos",
//   JSON.stringify([
//     {
//       taskId: "1",
//       userId: "abc",
//       task: "Get groceries",
//       description: "",
//       isComplete: false,
//       isChangingTask: false,
//       priority: "2",
//       isExpanded: false,
//       tags: [],
//       // start: new Date("06 August 2025 0:00"),
//       // start: new Date("04/22/2025 12:12"),
//       start: null,
//       // start: null,
//       end: null,
//     },
//   ])
// );

// localStorage.setItem(
//   "tags",
//   JSON.stringify([
//     {
//       tagId: "1",
//       label: "Food",
//       colour: "#ff0000",
//       userId: "abc",
//     },
//     {
//       tagId: "2",
//       label: "Work",
//       colour: "#00ff00",
//       userId: "",
//     },
//     {
//       tagId: "3",
//       label: "Travel",
//       colour: "#0000ff",
//       userId: "abc",
//     },
//   ])
// );
const loginNotification = localStorage.getItem("loginNotification");
if (!loginNotification) {
  localStorage.setItem("loginNotification", "on");
}

const App = () => {
  const path = useLocation();
  const { auth } = useContext(AuthContext);
  const logout = useLogout();
  console.log(auth);
  const navigate = useNavigate();

  usePersistLogin();

  return (
    <>
      {/* // <Stack height="100%"> 1st BEFORE */}
      {/* // <Stack height="100vh"> 2nd BEFORE */}
      {/* <Stack>
        {BUTTONS.map((button) => (
          <Button
            // variant="subtle"
            onClick={close}
            component={Link}
            to={button.path}
          >
            {button.text}
          </Button>
        ))}
      </Stack>
      <AppShell.Header>
    //     <Group p="0.3rem" gap="xs">
    //       <Group justify="space-between" w="100%">
    //         <Group>
    //           <ActionIcon
    //             size="sm"
    //             variant="transparent"
    //             color="white"
    //             onClick={open}
    //           >
    //             <IconMenu2 />
    //           </ActionIcon>
    //           <Text size="lg" fw={700}>
    //             {path.pathname === CREATE_TAG ? "New Tag" : "My Todos"}
    //           </Text>
    //         </Group>
    //         <Group gap={5}>
    //           {auth ? (
    //             <Button size="compact-xs" onClick={logout}>
    //               Logout
    //             </Button>
    //           ) : (
    //             <>
    //               <Button size="compact-xs" component={Link} to={LOGIN}>
    //                 Login
    //               </Button>
    //               <Button size="compact-xs" component={Link} to={REGISTER}>
    //                 Register
    //               </Button>
    //             </>
    //           )}
    //           <ActionIcon
    //             disabled
    //             size="sm"
    //             variant="default"
    //             onClick={() =>
    //               setColorScheme(colorScheme === "light" ? "dark" : "light")
    //             }
    //           >
    //             {colorScheme === "light" ? (
    //               <IconSun size="16" />
    //             ) : (
    //               <IconMoon size="16" />
    //             )}
    //           </ActionIcon>
    //         </Group>
    //       </Group>
    //     </Group>
    //   </AppShell.Header>
      
      */}

      {/* <Stack padding="1rem" height="100%"> BEFORE*/}
      {/* <Stack flex="1" minHeight="0" overflow="hidden"> 2nd BEFORE */}

      <Stack height="100%">
        <Stack direction="row" bgcolor="#141c1b" padding="1rem">
          <Typography variant="h5">Advanced Todo</Typography>
          <Button size="small">Login</Button>
          <Button size="small">Register</Button>
        </Stack>
        {/* <HomePage /> */}
        <Routes>
          <Route path={HOME} element={<HomePage />} />
          <Route path={CREATE_TAG} element={<TagPage />} />
          <Route path={EDIT_TODO} element={<EditTodoPage />} />
          {/* <Route path={EDIT_TAGS} element={<EditTagsPage />} /> */}
          <Route path={TAGS} element={<TagsPage />} />
          {/* <Route path={EDIT_TAG} element={<EditTagPage />} /> */}
          <Route path={REGISTER} element={<RegisterPage />} />
          <Route path={LOGIN} element={<LoginPage />} />
        </Routes>
        <Stack>
          <BottomNavigation
            showLabels
            sx={{ flexShrink: "0" }}
            onChange={(e, newVal) => {
              if (newVal === "todos") {
                navigate(HOME);
              } else if (newVal === "tags") {
                navigate(TAGS);
              }
            }}
          >
            <BottomNavigationAction label="Todos" value="todos" />
            <BottomNavigationAction label="Tags" value="tags" />
          </BottomNavigation>
        </Stack>
      </Stack>
    </>
    // </Stack>
    // <AppShell>
    //   <Drawer opened={opened} onClose={close} title="ASd">
    //     <Stack>
    //       {BUTTONS.map((button) => (
    //         <Button
    //           variant="subtle"
    //           onClick={close}
    //           component={Link}
    //           to={button.path}
    //         >
    //           {button.text}
    //         </Button>
    //       ))}
    //     </Stack>
    //   </Drawer>
    //   <AppShell.Main>
    //     <Stack gap="sm" pt="3rem" p="xs" h="100vh">
    //       <Routes>
    //         {/* <Route element={<PersistLogin />}> */}
    //         <Route path={HOME} element={<HomePage />} />
    //         <Route path={CREATE_TAG} element={<TagPage />} />
    //         <Route path={EDIT_TODO} element={<EditTodoPage />} />
    //         <Route path={EDIT_TAGS} element={<EditTagsPage />} />
    //         <Route path={EDIT_TAG} element={<EditTagPage />} />
    //         {/* </Route> */}
    //         <Route path={REGISTER} element={<RegisterPage />} />
    //         <Route path={LOGIN} element={<LoginPage />} />
    //       </Routes>
    //     </Stack>
    //   </AppShell.Main>
    //   <AppShell.Header>
    //     <Group p="0.3rem" gap="xs">
    //       <Group justify="space-between" w="100%">
    //         <Group>
    //           <ActionIcon
    //             size="sm"
    //             variant="transparent"
    //             color="white"
    //             onClick={open}
    //           >
    //             <IconMenu2 />
    //           </ActionIcon>
    //           <Text size="lg" fw={700}>
    //             {path.pathname === CREATE_TAG ? "New Tag" : "My Todos"}
    //           </Text>
    //         </Group>
    //         <Group gap={5}>
    //           {auth ? (
    //             <Button size="compact-xs" onClick={logout}>
    //               Logout
    //             </Button>
    //           ) : (
    //             <>
    //               <Button size="compact-xs" component={Link} to={LOGIN}>
    //                 Login
    //               </Button>
    //               <Button size="compact-xs" component={Link} to={REGISTER}>
    //                 Register
    //               </Button>
    //             </>
    //           )}
    //           <ActionIcon
    //             disabled
    //             size="sm"
    //             variant="default"
    //             onClick={() =>
    //               setColorScheme(colorScheme === "light" ? "dark" : "light")
    //             }
    //           >
    //             {colorScheme === "light" ? (
    //               <IconSun size="16" />
    //             ) : (
    //               <IconMoon size="16" />
    //             )}
    //           </ActionIcon>
    //         </Group>
    //       </Group>
    //     </Group>
    //   </AppShell.Header>
    // </AppShell>
  );
};

export default App;
