import { Button, PasswordInput, TextInput } from "@mantine/core";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router";
import { HOME } from "../routes/routes";
import useRefreshToken from "../hooks/useRefreshToken";

type form = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [formInput, setFormInput] = useState<form>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const { setAuth, persist, setPersist } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setAuth({
        _id: res.data._id,
        username: formInput.username,
        accessToken: res.data.accessToken,
      });
      setPersist(true);
      navigate(HOME);
    } catch (err) {
      console.log(err);
    }
  };

  // const togglePersist = () => {
  //   setPersist(prev => !prev)
  // }

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <>
      <TextInput
        label="Username"
        value={formInput.username}
        onChange={(e) =>
          setFormInput({ ...formInput, username: e.target.value })
        }
      />
      <PasswordInput
        label="Password"
        value={formInput.password}
        onChange={(e) =>
          setFormInput({ ...formInput, password: e.target.value })
        }
      />
      <Button onClick={handleSubmit}>Log In</Button>
      {/* <Button onClick={handleSubmit}>Log In</Button> */}
    </>
  );
};

export default LoginPage;
