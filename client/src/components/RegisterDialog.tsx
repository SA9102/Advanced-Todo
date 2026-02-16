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
        <Button onClick={handleSubmit}>Register</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterDialog;
