import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useContext, useState } from "react";
import { API_BASE_URL } from "../config";
import AuthContext from "../context/AuthProvider";

const LoginDialog = ({ open, setOpen }) => {
  const [loginInput, setLoginInput] = useState({ username: "", password: "" });

  const { auth, setAuth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    // if (formInput.username === "" || formInput.password === "") {
    //   setError(true);
    //   return;
    // }

    e.preventDefault();
    // setLoading(true);
    try {
      const hashedPassword = await bcrypt.hash(loginInput.password, 12);
      const res = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          username: loginInput.username,
          password: hashedPassword,
        },
        { withCredentials: true }
      );
      console.log("!!!!!!!");
      console.log(res.data);
      setAuth({
        _id: res.data._id,
        username: loginInput.username,
        accessToken: res.data.accessToken,
      });
      const todosLS = JSON.parse(localStorage.getItem("todos"));

      //   if (!todosLS || (todosLS && todosLS.length === 0)) {
      //     navigate(HOME);
      //   } else if (todos) setPersist(true);
      setOpen(false);
    } catch (err) {
      //   setIncorrect(true);
      console.log(err);
      if (err.status === 401) {
      }
    } finally {
      //   setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.3)", // translucent overlay
          backdropFilter: "blur(5px)", // <-- blur effect
        },
      }}
    >
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <Stack gap="1rem">
          <TextField
            label="Username"
            value={loginInput.username}
            onChange={(e) =>
              setLoginInput({ ...loginInput, username: e.target.value })
            }
          />
          <TextField
            label="Password"
            type="password"
            value={loginInput.password}
            onChange={(e) =>
              setLoginInput({ ...loginInput, password: e.target.value })
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            setLoginInput({ username: "", password: "" });
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          // onClick={() => {
          //   setOpen(false);
          // //   updateTodo(todoInput);
          //   if (auth) {
          //     console.log("SAVE TO DB");
          //     // handleSaveToDB();
          //   } else {
          //     console.log("SAVE TO LS");
          //     // handleSaveToLS();
          //   }
          // }}
        >
          Log In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
