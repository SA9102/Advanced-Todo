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
import { useContext, useEffect, useState } from "react";
import HomePageNew from "./pages/HomePageNew";
import AuthContext from "./context/AuthProvider";
import useLogout from "./hooks/useLogout";
import PersistLogin from "./components/PersistLogin";
import usePersistLogin from "./hooks/usePersistLogin";
import TagsPage from "./pages/TagsPage";
import LoginDialog from "./components/LoginDialog";
import RegisterDialog from "./components/RegisterDialog";

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
  const { auth, setAuth } = useContext(AuthContext);
  const logout = useLogout();
  const navigate = useNavigate();

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  usePersistLogin();
  // console.log("AUTH");
  // console.log(auth);

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <>
      <LoginDialog open={loginDialogOpen} setOpen={setLoginDialogOpen} />
      <RegisterDialog
        open={registerDialogOpen}
        setOpen={setRegisterDialogOpen}
      />
      <Stack height="100%">
        <Stack
          direction="row"
          bgcolor="#141c1b"
          padding="1rem"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            Welcome, {auth ? auth.username : "guest"}!
          </Typography>
          <Stack direction="row" alignItems="center">
            <Typography>ADVANCED TODO</Typography>
            {auth ? (
              <Button size="small" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button size="small" onClick={() => setLoginDialogOpen(true)}>
                  Login
                </Button>
                <Button
                  size="small"
                  onClick={() => setRegisterDialogOpen(true)}
                >
                  Register
                </Button>
              </>
            )}
          </Stack>
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
  );
};

export default App;
