import axios from "axios";
import bcrypt from "bcryptjs";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router";
import { HOME } from "../routes/routes";
import { Button, TextField, Typography } from "@mui/material";

type form = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [formInput, setFormInput] = useState<form>({
    username: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setAuth, persist, setPersist } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    if (formInput.username === "" || formInput.password === "") {
      setError(true);
      return;
    }

    e.preventDefault();
    setLoading(true);
    try {
      const hashedPassword = await bcrypt.hash(formInput.password, 12);
      const res = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          username: formInput.username,
          password: hashedPassword,
        },
        { withCredentials: true }
      );
      console.log("!!!!!!!");
      console.log(res.data);
      setAuth({
        _id: res.data._id,
        username: formInput.username,
        accessToken: res.data.accessToken,
      });
      const todosLS = JSON.parse(localStorage.getItem("todos"));

      if (!todosLS || (todosLS && todosLS.length === 0)) {
        navigate(HOME);
      } else if (todos) setPersist(true);
    } catch (err) {
      setIncorrect(true);
      console.log(err);
      if (err.status === 401) {
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <>
      <Typography
      //  order={1} size="h2"
      >
        Login
      </Typography>
      <TextField
        label="Username"
        value={formInput.username}
        onChange={(e) => {
          setError(false);
          setIncorrect(false);
          setFormInput({ ...formInput, username: e.target.value });
        }}
        // error={
        //   error && formInput.username === ""
        //     ? "Username required"
        //     : incorrect && "Username and/or password incorrect"
        // }
      />
      <TextField
        type="password"
        label="Password"
        value={formInput.password}
        onChange={(e) => {
          setError(false);
          setIncorrect(false);
          setFormInput({ ...formInput, password: e.target.value });
        }}
        // error={
        //   error && formInput.password === ""
        //     ? "Password required"
        //     : incorrect && "Username and/or password incorrect"
        // }
      />
      <Button onClick={handleSubmit} loading={loading}>
        Log In
      </Button>
    </>
  );
};

export default LoginPage;
