import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useState } from "react";
import { API_BASE_URL } from "../config";

const RegisterDialog = ({ open, setOpen }) => {
  const [registerInput, setRegisterInput] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // setError(false);

    // if (!validatePassword()) {
    //   setPasswordValid(false);
    //   setError(true);
    // } else {
    //   setPasswordValid(true);
    // }

    // if (!matchPasswords()) {
    //   setPasswordsMatch(false);
    //   setError(true);
    // } else {
    //   setPasswordsMatch(true);
    // }

    // if (error) {
    //   return;
    // }

    // setLoading(true);
    try {
      const hashedPassword = await bcrypt.hash(registerInput.password, 12);
      await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          username: registerInput.username,
          password: hashedPassword,
        },
        { withCredentials: true }
      );
      //   navigate(LOGIN);
      setOpen(false);
    } catch (err) {
      console.log(err);
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
      <DialogTitle>Register</DialogTitle>
      <DialogContent>
        <Stack gap="1rem">
          <TextField
            label="Username"
            value={registerInput.username}
            onChange={(e) =>
              setRegisterInput({ ...registerInput, username: e.target.value })
            }
          />
          <TextField
            label="Password"
            type="password"
            value={registerInput.password}
            onChange={(e) =>
              setRegisterInput({ ...registerInput, password: e.target.value })
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            setRegisterInput({ username: "", password: "" });
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
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterDialog;
