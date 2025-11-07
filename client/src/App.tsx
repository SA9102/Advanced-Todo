import {
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router";
import HomePage from "./pages/HomePage";
import { HOME, TAGS } from "./routes/routes";
import "./index.css";
import { useContext, useState } from "react";
import AuthContext from "./context/AuthProvider";
import useLogout from "./hooks/useLogout";
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
  const { auth, setAuth } = useContext(AuthContext);
  const logout = useLogout();
  const navigate = useNavigate();

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  usePersistLogin();

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
          sx={{
            paddingX: {
              xs: "0.5rem",
              sm: "3rem",
              md: "5rem",
              lg: "10rem",
              xl: "15rem",
            },
          }}
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
        <Routes>
          <Route path={HOME} element={<HomePage />} />
          <Route path={TAGS} element={<TagsPage />} />
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
