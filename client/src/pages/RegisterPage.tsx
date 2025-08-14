import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router";
import { LOGIN } from "../routes/routes";
import { API_BASE_URL } from "../config";
import useRefreshToken from "../hooks/useRefreshToken";

type form = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const [formInput, setFormInput] = useState<form>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hashedPassword = await bcrypt.hash(formInput.password, 12);
      await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          username: formInput.username,
          email: formInput.email,
          password: hashedPassword,
        },
        { withCredentials: true }
      );
      navigate(LOGIN);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <TextInput
        label="Username"
        value={formInput.username}
        onChange={(e) =>
          setFormInput({ ...formInput, username: e.target.value })
        }
      />
      <TextInput
        label="Email"
        value={formInput.email}
        onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
      />
      <PasswordInput
        label="Password"
        value={formInput.password}
        onChange={(e) =>
          setFormInput({ ...formInput, password: e.target.value })
        }
      />
      <PasswordInput
        label="Confirm Password"
        value={formInput.confirmPassword}
        onChange={(e) =>
          setFormInput({ ...formInput, confirmPassword: e.target.value })
        }
      />
      <Button onClick={handleSubmit}>Register</Button>
    </>
  );
};

export default RegisterPage;
